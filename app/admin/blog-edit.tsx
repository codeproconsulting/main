import { useState } from "react";
import { Form,Link,data,redirect,useActionData,useLoaderData,useSearchParams } from "react-router";
import type { ActionFunctionArgs,LoaderFunctionArgs } from "react-router";
import { ArticleMediaPicker } from "./article-media-picker";
import { RichEditor } from "./rich-editor";
import { requireStaff,sameOrigin } from "./auth.server";
import { featureImageAlt,postFor,savePost } from "./content.server";
import { canEditContent,canPublish } from "./domain";
import { allow } from "./crm.server";
import { ActionError,Back,PageHeading,Submit } from "./ui";
export async function loader({request,params}:LoaderFunctionArgs){const staff=await requireStaff(request);allow(canEditContent(staff));const post=params.id?await postFor(staff,params.id):null;return {name:staff.name,publisher:canPublish(staff),post:post?{...post,metadata:undefined}:null,imageAlt:featureImageAlt(post)};}
export async function action({request,params}:ActionFunctionArgs){const staff=await requireStaff(request);sameOrigin(request);try{const p=await savePost(staff,params.id??"new",await request.formData());return redirect(`/admin/blogs/${p.$id}/edit?saved=1`);}catch(e){if(e instanceof Response){if([400,409].includes(e.status))return data({error:await e.text()},{status:e.status});throw e;}return data({error:"The article could not be saved. Check its latest state before retrying."},{status:503});}}
export default function BlogEditor() {
  const article = useLoaderData<typeof loader>();
  return <EditorForm key={`${article.post?.$id??"new"}:${article.post?.version??0}`} {...article}/>;
}

function EditorForm({name,publisher,post,imageAlt:initialAlt}:Awaited<ReturnType<typeof loader>>) {
  const result=useActionData<typeof action>(), [query]=useSearchParams();
  const [dirty,setDirty]=useState(false);
  const [title,setTitle]=useState(post?.title??""), [slug,setSlug]=useState(post?.slug??"");
  const [customSlug,setCustomSlug]=useState(Boolean(post));
  const [section,setSection]=useState(post?.section??"education"), [status,setStatus]=useState(post?.status??"draft");
  const [author,setAuthor]=useState(post?.author??name), [excerpt,setExcerpt]=useState(post?.excerpt??"");
  const [image,setImage]=useState(post?.image??""), [imageAlt,setImageAlt]=useState(initialAlt);
  const [metaTitle,setMetaTitle]=useState(post?.metaTitle??""), [metaDescription,setMetaDescription]=useState(post?.metaDescription??"");
  const readOnly=Boolean(post && ["published","scheduled"].includes(post.status) && !publisher);
  const markEdited=()=>setDirty(true);
  const snippetTitle=metaTitle.trim()||title.trim(), snippetDescription=metaDescription.trim()||excerpt.trim();
  return <>
    <Back to="/admin/blogs">Content library</Back>
    <PageHeading eyebrow="BLOG STUDIO" title={post?"Edit article":"New article"} description={post?`Version ${post.version} · ${post.status}`:"Draft an article for the ProConsulting blog."}/>
    <ActionError error={result?.error}/>
    {dirty?<p className="crm-muted" role="status">Unsaved changes</p>:query.has("saved")?<p className="crm-success" role="status">Article saved.</p>:null}
    {readOnly&&<p className="crm-alert">A publisher must edit this live or scheduled article.</p>}
    <Form method="post" className="crm-editor-grid" onSubmit={e=>{if(readOnly)e.preventDefault();}}>
      <input type="hidden" name="version" value={post?.version??0}/>
      <section className="crm-panel crm-padded crm-form crm-writing">
        <label>Article title<input name="title" required maxLength={300} value={title} readOnly={readOnly} onChange={e=>{
          const next=e.target.value;setTitle(next);markEdited();
          if(!customSlug)setSlug(next.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,200).replace(/^-|-$/g,""));
        }}/></label>
        <label>Excerpt<textarea name="excerpt" rows={3} maxLength={2000} value={excerpt} readOnly={readOnly} onChange={e=>{setExcerpt(e.target.value);markEdited();}}/></label>
        <RichEditor initial={post?.body??""} {...{readOnly,title,author,excerpt,image,imageAlt}} onEdit={markEdited}/>
      </section>
      <aside className="crm-blog-settings">
        <fieldset disabled={readOnly} className="crm-panel crm-padded crm-form" onChange={markEdited}>
          <h2>Publication</h2>
          <label>Section<select name="section" value={section} onChange={e=>setSection(e.target.value)}>{["education","immigration","general"].filter(s=>!post||s===post.section).map(s=><option key={s}>{s}</option>)}</select></label>
          <label>URL slug<input required name="slug" value={slug} readOnly={Boolean(post)} pattern="([a-z0-9]+-)*[a-z0-9]+" maxLength={200} onChange={e=>{setCustomSlug(true);setSlug(e.target.value);}}/></label>
          <label>Author<input name="author" value={author} maxLength={200} onChange={e=>setAuthor(e.target.value)}/></label>
          <label>Status<select name="status" value={status} onChange={e=>setStatus(e.target.value)}>{["draft","review",...(publisher||readOnly?["published","scheduled"]:[]),"archived"].map(s=><option key={s}>{s}</option>)}</select></label>
          <label hidden={status!=="scheduled"}>Scheduled publish date (with timezone)<input disabled={status!=="scheduled"} required={status==="scheduled"} name="publishedAt" defaultValue={post?.publishedAt} placeholder="2030-11-02T09:00:00+05:00"/></label>
          {!readOnly&&<Submit>Save article</Submit>}
        </fieldset>
        {post&&<Link to={`/admin/blogs/${post.$id}/history`}>Revision history →</Link>}
        <fieldset disabled={readOnly} className="crm-panel crm-padded crm-form" onChange={markEdited}>
          <h2>Feature image</h2>
          {!readOnly&&<ArticleMediaPicker onPick={(src,item)=>{setImage(src);setImageAlt(item.alt);markEdited();}}/>}
          <label>Feature image URL<input type="url" name="image" value={image} placeholder="https://…" maxLength={2000} onChange={e=>setImage(e.target.value)}/></label>
          <label>Feature image alternative text<input name="imageAlt" value={imageAlt} maxLength={300} onChange={e=>setImageAlt(e.target.value)}/></label>
        </fieldset>
        <fieldset disabled={readOnly} className="crm-panel crm-padded crm-form" onChange={markEdited}>
          <h2>Search &amp; sharing</h2>
          <label>SEO title<input name="metaTitle" value={metaTitle} maxLength={300} onChange={e=>setMetaTitle(e.target.value)}/></label>
          <label>SEO description<textarea name="metaDescription" rows={3} value={metaDescription} maxLength={1000} onChange={e=>setMetaDescription(e.target.value)}/></label>
          <section className="crm-snippet" aria-label="Search result preview">
            <small>Search result preview</small>
            {section!=="general"&&<span>proconsulting.uk/{section}/blog/{slug||"…"}</span>}
            <strong>{snippetTitle||"Article title"} | ProConsulting{section==="immigration"?" Immigration":""}</strong>
            <p>{snippetDescription||"Add an excerpt or SEO description."}</p>
          </section>
        </fieldset>
      </aside>
    </Form>
  </>;
}
