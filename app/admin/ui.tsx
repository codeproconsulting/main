import type { ReactNode } from "react";
import { Link, useNavigation } from "react-router";
export function PageHeading({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return <div className="crm-heading"><div><p className="crm-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="crm-muted">{description}</p></div>{children}</div>;
}
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) { return <span className={`crm-badge ${tone}`}>{children}</span>; }
export function Empty({ title, children }: { title: string; children: ReactNode }) { return <div className="crm-empty"><h3>{title}</h3><p>{children}</p></div>; }
export function Submit({ children = "Save changes" }: { children?: ReactNode }) { const nav = useNavigation(); return <button className="crm-button" disabled={nav.state !== "idle"}>{nav.state !== "idle" ? "Saving…" : children}</button>; }
export function ActionError({ error }: { error?: string }) { return error ? <p role="alert" className="crm-alert">{error}</p> : null; }
export function Back({ to, children }: { to: string; children: ReactNode }) { return <Link className="crm-back" to={to}>← {children}</Link>; }
export function localToISO(form: HTMLFormElement, fields: string[]) { for (const name of fields) { const input = form.elements.namedItem(name) as HTMLInputElement | null; if (input?.value) input.value = new Date(input.value).toISOString(); } }

export function WorkspaceBrand() {
  return <span><img className="crm-brand-logo" src="/Logo_main.png" alt="Pro Consulting" width={400} height={79}/><span className="crm-brand-caption">TEAM WORKSPACE</span></span>;
}
