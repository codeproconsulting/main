import { Link,useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Plus,ArrowUpRight } from "lucide-react";
import { requireStaff } from "./auth.server";
import { postsFor } from "./content.server";
import { displayDate } from "./domain";
import { Badge,Empty,PageHeading } from "./ui";
export async function loader({request}:LoaderFunctionArgs){return postsFor(await requireStaff(request));}
export default function Blogs(){const {documents:posts,total}=useLoaderData<typeof loader>();return <><PageHeading eyebrow="IDEAS WORTH SHARING" title="Blog studio" description="Helpful stories. Expert guidance. Your next great article starts here."><Link className="crm-button" to="/admin/blogs/new"><Plus size={17}/>New article</Link></PageHeading><section className="crm-panel"><div className="crm-panel-heading"><h2>Content library <span className="crm-muted">({total})</span></h2><span className="crm-muted">Showing up to 100 recent articles</span></div><div className="crm-table-wrap"><table className="crm-table"><thead><tr><th>Article</th><th>Section</th><th>Status</th><th>Published</th><th/></tr></thead><tbody>{posts.map(p=><tr key={p.$id}><td><Link to={`/admin/blogs/${p.$id}/edit`}><strong>{p.title}</strong><small>/{p.section}/blog/{p.slug}</small></Link></td><td>{p.section}</td><td><Badge tone={p.status==="published"?"green":"neutral"}>{p.status}</Badge></td><td>{p.publishedAt?displayDate(p.publishedAt):"Draft"}</td><td><Link to={`/admin/blogs/${p.$id}/edit`} aria-label={`Edit ${p.title}`}><ArrowUpRight size={18}/></Link></td></tr>)}</tbody></table></div>{!posts.length&&<Empty title="Your next story belongs here">Create an article, or import your existing Ghost content after the migration review.</Empty>}</section></>;}
