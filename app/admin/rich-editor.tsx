import { useMemo, useRef, useState } from "react";
import { ArticleMediaPicker } from "./article-media-picker";

type Mode = "visual" | "html" | "preview";
type Insert = "Link" | "Image" | "Table";

export function RichEditor({initial,readOnly=false,title,author,excerpt,image,imageAlt,onEdit}:{
  initial:string; readOnly?:boolean; title:string; author:string; excerpt:string; image:string; imageAlt:string; onEdit:()=>void;
}) {
  const [mode,setMode] = useState<Mode>("visual");
  const [value,setValue] = useState(initial);
  const [safeHtml,setSafeHtml] = useState(initial);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [insert,setInsert] = useState<Insert>();
  const [url,setUrl] = useState(""), [label,setLabel] = useState(""), [caption,setCaption] = useState("");
  const [rows,setRows] = useState(2), [columns,setColumns] = useState(2);
  const editor = useRef<HTMLDivElement>(null);
  const selection = useRef<Range|null>(null);
  const markup = useMemo(() => ({__html:safeHtml}),[safeHtml]);

  async function switchMode(next:Mode) {
    if (next === mode || busy) return;
    setError(""); setInsert(undefined); selection.current = null;
    if (next === "html") {setMode(next); return;}
    setBusy(true);
    try {
      const body = new FormData(); body.set("body",value);
      const response = await fetch("/admin/blog-preview",{method:"POST",body});
      if (!response.ok) throw new Error("Preview unavailable. Your article is still in the editor.");
      const {html} = await response.json();
      if (typeof html !== "string") throw new Error("Preview unavailable.");
      setSafeHtml(html);
      if (next === "visual") setValue(html);
      setMode(next);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Preview unavailable."); }
    finally { setBusy(false); }
  }

  function rememberSelection() {
    const current = window.getSelection();
    if (current?.rangeCount && editor.current?.contains(current.getRangeAt(0).commonAncestorContainer)) {
      selection.current = current.getRangeAt(0).cloneRange();
    }
  }

  function change(html:string) {setValue(html); onEdit();}
  function command(name:string,arg?:string) {
    if (readOnly || busy || !editor.current) return;
    editor.current.focus();
    const current = window.getSelection();
    if (selection.current && editor.current.contains(selection.current.commonAncestorContainer)) {
      current?.removeAllRanges(); current?.addRange(selection.current);
    }
    document.execCommand(name,false,arg);
    change(editor.current.innerHTML); rememberSelection();
  }

  function openInsert(kind:Insert) {
    rememberSelection(); setInsert(kind); setUrl(""); setCaption(""); setError("");
    setLabel(kind === "Link" ? selection.current?.toString() ?? "" : "");
  }

  function insertBlock() {
    let node:HTMLElement;
    if (insert === "Table") {
      if (![rows,columns].every(n => Number.isInteger(n) && n >= 1 && n <= 10)) {
        setError("Choose between 1 and 10 rows and columns."); return;
      }
      const table = document.createElement("table");
      const header = table.createTHead().insertRow();
      for (let col=0; col<columns; col++) {
        const cell = document.createElement("th"); cell.textContent = `Column ${col+1}`; header.append(cell);
      }
      const body = table.createTBody();
      for (let index=0; index<rows; index++) {
        const row = body.insertRow();
        for (let col=0; col<columns; col++) row.insertCell().append(document.createElement("br"));
      }
      node = table;
    } else {
      let target:URL;
      try {
        target = new URL(url.trim());
        if (!(insert === "Image" ? ["https:"] : ["https:","http:","mailto:","tel:"]).includes(target.protocol)) throw Error();
      } catch { setError(insert === "Image" ? "Enter an HTTPS image address." : "Enter a web, email (mailto:) or phone (tel:) link."); return; }
      if (!label.trim()) {setError(insert === "Image" ? "Describe the image for readers." : "Enter the link text."); return;}
      if (insert === "Image") {
        const figure = document.createElement("figure"), img = document.createElement("img");
        img.src = target.href; img.alt = label.trim(); figure.append(img);
        if (caption.trim()) {const text=document.createElement("figcaption"); text.textContent=caption.trim(); figure.append(text);}
        node = figure;
      } else {
        const anchor = document.createElement("a"); anchor.href=target.href; anchor.textContent=label.trim(); node=anchor;
      }
    }
    command("insertHTML",node.outerHTML + (insert === "Link" ? "" : "<p><br></p>"));
    setInsert(undefined); setError("");
  }

  return <div className="crm-form">
    <input type="hidden" name="body" value={value}/>
    <div className="crm-editor-tabs">{([["visual","Visual editor"],["html","HTML source"],["preview","Reader preview"]] as const).map(([key,name]) =>
      <button key={key} type="button" aria-pressed={mode===key} disabled={busy} className={mode===key?"active":""} onClick={()=>void switchMode(key)}>{name}</button>)}</div>
    {error && <p role="alert" className="crm-alert">{error}</p>}
    {mode === "visual" && <>
      {!readOnly && <div className="crm-editor-toolbar" role="group" aria-label="Text formatting">
        {[["bold","Bold"],["italic","Italic"],["formatBlock","Heading","h2"],["formatBlock","Subheading","h3"],["formatBlock","Paragraph","p"],["formatBlock","Quote","blockquote"],["insertUnorderedList","Bullet list"],["insertOrderedList","Numbered list"],["unlink","Remove link"],["undo","Undo"],["redo","Redo"]].map(([cmd,name,arg]) =>
          <button key={name} type="button" disabled={busy} onMouseDown={e=>e.preventDefault()} onClick={()=>command(cmd,arg)}>{name}</button>)}
        {(["Link","Image","Table"] as const).map(kind=><button key={kind} type="button" disabled={busy} onMouseDown={e=>e.preventDefault()} onClick={()=>openInsert(kind)}>Insert {kind.toLowerCase()}</button>)}
      </div>}
      {insert && <fieldset className="crm-form crm-insert-panel" onKeyDown={event=>{
        if(event.key==="Enter" && event.target instanceof HTMLInputElement){event.preventDefault();insertBlock();}
      }}>
        <legend>Insert {insert.toLowerCase()}</legend>
        {insert==="Table" ? <>
          <label>Data rows<input type="number" min={1} max={10} value={rows||""} onChange={e=>setRows(Number(e.target.value))}/></label>
          <label>Columns<input type="number" min={1} max={10} value={columns||""} onChange={e=>setColumns(Number(e.target.value))}/></label>
        </> : <>
          {insert==="Image" && <ArticleMediaPicker onPick={(src,item)=>{setUrl(src);setLabel(item.alt);setCaption(item.caption);}}/>}
          <label>{insert==="Link"?"Link address":"Image address"}<input value={url} maxLength={2000} onChange={e=>setUrl(e.target.value)}/></label>
          <label>{insert==="Link"?"Link text":"Alternative text"}<input value={label} maxLength={500} onChange={e=>setLabel(e.target.value)}/></label>
          {insert==="Image" && <label>Image caption<input value={caption} maxLength={1000} onChange={e=>setCaption(e.target.value)}/></label>}
        </>}
        <div className="crm-editor-toolbar"><button type="button" onClick={insertBlock}>Add to article</button><button type="button" onClick={()=>{setInsert(undefined);setError("");}}>Cancel insert</button></div>
      </fieldset>}
      <div ref={editor} className="crm-article-preview crm-editable" contentEditable={!readOnly&&!busy} role="textbox" aria-readonly={readOnly||busy} aria-label="Article content" aria-multiline suppressContentEditableWarning dangerouslySetInnerHTML={markup}
        onKeyUp={rememberSelection} onMouseUp={rememberSelection} onInput={e=>{change(e.currentTarget.innerHTML);rememberSelection();}}
        onDrop={e=>{e.preventDefault();command("insertText",e.dataTransfer.getData("text/plain"));}} onPaste={e=>{e.preventDefault();command("insertText",e.clipboardData.getData("text/plain"));}}/>
    </>}
    {mode==="html" && <label>Article HTML<textarea className="crm-code-editor" readOnly={readOnly||busy} rows={24} maxLength={500000} value={value} onChange={e=>change(e.target.value)}/></label>}
    {mode==="preview" && <article aria-label="Draft reader preview" className="crm-reader">
      <h2>{title||"Untitled article"}</h2>{author && <p className="crm-muted">By {author}</p>}{excerpt && <p>{excerpt}</p>}
      {/^https:\/\//i.test(image) && <img src={image} alt={imageAlt||title} referrerPolicy="no-referrer"/>}
      <div className="crm-article-preview" onClick={e=>{if(e.target instanceof Element && e.target.closest("a"))e.preventDefault();}} dangerouslySetInnerHTML={markup}/>
    </article>}
  </div>;
}
