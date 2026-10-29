export function loadEnvironment() { try { process.loadEnvFile('.env'); } catch(e) { if(e.code!=='ENOENT')throw e; } }
export async function api(path, method='GET', body) {
 const {APPWRITE_ENDPOINT:endpoint,APPWRITE_PROJECT_ID:project,APPWRITE_API_KEY:key}=process.env;
 if(!endpoint||!project||!key)throw new Error('Appwrite environment is incomplete');
 const response=await fetch(endpoint.replace(/\/$/,'')+path,{method,headers:{'X-Appwrite-Project':project,'X-Appwrite-Key':key,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
 if(!response.ok){const detail=await response.json().catch(()=>({}));const error=new Error(`Appwrite ${method} ${path.split('?')[0]}: HTTP ${response.status} (${detail.type??'unknown'})`);error.status=response.status;throw error;}
 return response.status===204?undefined:response.json();
}
export const q=(method,attribute,values)=>JSON.stringify({method,...(attribute?{attribute}:{}),...(values?{values}:{})});
export async function allDocuments(collection,queries=[]) {
 const result=[];let cursor;
 do {const search=new URLSearchParams();for(const query of [...queries,q('limit',undefined,[100]),...(cursor?[q('cursorAfter',undefined,[cursor])]:[])])search.append('queries[]',query);
 const page=await api(`/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${collection}/documents?${search}`);result.push(...page.documents);cursor=page.documents.length===100?page.documents.at(-1).$id:null;
 }while(cursor);return result;
}
