export class AppwriteError extends Error {
  constructor(public status: number, message = "Appwrite request failed") { super(message); }
}
export function appwriteConfigured() {
  return Boolean(process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY && process.env.APPWRITE_DATABASE_ID);
}
export function configurationIssues() {
  const issues = ["APPWRITE_ENDPOINT", "APPWRITE_PROJECT_ID", "APPWRITE_API_KEY", "APPWRITE_DATABASE_ID", "SESSION_SECRET"].filter(key => !process.env[key]);
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) issues.push("SESSION_SECRET_LENGTH");
  return issues;
}
export async function appwrite<T>(path: string, options: { method?: string; body?: unknown; session?: string } = {}): Promise<T> {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT_ID;
  if (!endpoint || !project || (!options.session && !process.env.APPWRITE_API_KEY)) throw new AppwriteError(503, "Appwrite is not configured");
  const url = new URL(endpoint);
  if (url.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) throw new AppwriteError(503, "Appwrite requires HTTPS");
  const response = await fetch(`${endpoint.replace(/\/$/, "")}${path}`, {
    method: options.method ?? "GET",
    headers: { "X-Appwrite-Project": project, "Content-Type": "application/json", ...(options.session ? { "X-Appwrite-Session": options.session } : { "X-Appwrite-Key": process.env.APPWRITE_API_KEY! }) },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new AppwriteError(response.status);
  return response.status === 204 ? undefined as T : response.json();
}
export type Document = { $id: string; $createdAt: string; $updatedAt: string };
export const query = (method: string, attribute?: string, values?: unknown[]) => JSON.stringify({ method, ...(attribute ? { attribute } : {}), ...(values ? { values } : {}) });
function collectionPath(collection: string) {
  const db = process.env.APPWRITE_DATABASE_ID;
  if (!db) throw new AppwriteError(503, "Database is not configured");
  return `/databases/${encodeURIComponent(db)}/collections/${encodeURIComponent(collection)}/documents`;
}
export function listDocuments<T>(collection: string, queries: string[] = []) {
  const search = new URLSearchParams();
  for (const q of queries) search.append("queries[]", q);
  return appwrite<{ documents: (T & Document)[]; total: number }>(`${collectionPath(collection)}?${search}`);
}
export function getDocument<T>(collection: string, id: string) { return appwrite<T & Document>(`${collectionPath(collection)}/${encodeURIComponent(id)}`); }
export function createDocument<T>(collection: string, data: T, id: string = crypto.randomUUID()) {
  return appwrite<T & Document>(collectionPath(collection), { method: "POST", body: { documentId: id, data, permissions: [] } });
}
export function updateDocument<T>(collection: string, id: string, data: Partial<T>) {
  return appwrite<T & Document>(`${collectionPath(collection)}/${encodeURIComponent(id)}`, { method: "PATCH", body: { data } });
}
