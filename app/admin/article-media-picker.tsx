import { useFetcher } from "react-router";
import type { loader } from "./media";
import type { Media } from "./media.server";

export function ArticleMediaPicker({onPick}:{onPick:(url:string, item:Media)=>void}) {
  const library = useFetcher<typeof loader>();
  const images = library.data?.items.filter(item => item.published);
  return <div className="crm-form crm-media-picker">
    <div className="crm-editor-toolbar">
      <button type="button" disabled={library.state !== "idle"} onClick={() => library.load("/admin/media?picker=1")}>
        {library.state !== "idle" ? "Loading images…" : images ? "Refresh images" : "Choose from media library"}
      </button>
      <a href="/admin/media" target="_blank" rel="noreferrer">Manage uploads ↗</a>
    </div>
    {library.data?.error && <p role="alert">{library.data.error}</p>}
    {images && !library.data?.error && (images.length ? <label>Public library image<select aria-label="Public library image" value="" onChange={event => {
      const item = images.find(image => image.$id === event.target.value);
      if (item && library.data) onPick(new URL(`/media/${item.$id}`,library.data.origin).href,item);
    }}>
      <option value="">Select an image</option>
      {images.map(item => <option key={item.$id} value={item.$id}>{item.name}</option>)}
    </select></label> : <p className="crm-muted">No public images are available.</p>)}
  </div>;
}
