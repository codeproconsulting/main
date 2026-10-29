export async function submitLead(payload:Record<string,unknown>,submissionId:string){
 const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,submissionId})});
 const result=await response.json().catch(()=>({success:false,error:'The service is temporarily unavailable. Please retry.'}));
 if(!response.ok||!result.success)throw new Error(result.error||'Your enquiry could not be saved. Please retry.');
 return result as {success:true;reference:string};
}
