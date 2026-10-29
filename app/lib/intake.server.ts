import { AppwriteError,createDocument,getDocument } from "./appwrite.server";
import { rateLimit } from "./rate-limit.server";
import type { Lead } from "~/admin/domain";
const allowed = ['city','currentEducation','majorSubject','gradeScore','passingYear','targetDegree','targetIntake','budgetRange','needScholarship','englishTest','hasRefusal','studyGap','notes','message','countryOfResidence','serviceType','blogSlug','blogTitle','enquiringAs','destination','originPath','serviceContext'];
export async function captureLead(request:Request,input:Record<string,unknown>) {
 const origin=request.headers.get('Origin');
 if(!origin||origin!==new URL(request.url).origin)throw new Response('Request origin rejected',{status:403});
 if(process.env.APP_SURFACE==='dashboard')throw new Response('Public intake is not available on this host',{status:404});
 rateLimit(request,'intake',20,15*60*1000);
 const read=(name:string,max=1000)=>{const value=input[name];if(value!==undefined&&typeof value!=='string')throw new Response('Invalid form data',{status:400});const text=(value??'').trim();if(text.length>max)throw new Response('Form field is too long',{status:400});return text;};
 if(read('website'))throw new Response('Submission rejected',{status:400});
 const name=(read('fullName',200)||read('name',200)),email=read('email',254).toLowerCase(),phone=read('phone',80);
 if(!name||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!phone||phone.replace(/\D/g,'').length<7)throw new Response('Please enter your name, valid email, and phone number.',{status:400});
 const id=read('submissionId',36);
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))throw new Response('Refresh the form and try again.',{status:400});
 const source=read('source',100)||new URL(request.url).pathname;
 const service=read('service',100)|| (source.includes('immigration')?'Immigration':'Education');
 if(!['Education','Immigration','Study Abroad','Visit Visa','General Enquiry'].includes(service))throw new Response('Choose a valid service.',{status:400});
 const details=Object.fromEntries(allowed.map(key=>[key,read(key,key==='notes'||key==='message'?4000:1000)]).filter(([,value])=>value));
 const payload={name,email,phone,service,source,country:read('targetCountry',150)||read('destinationCountry',150)||read('interestedCountry',150),stage:'New',owner:'',priority:'Normal',nextFollowUp:'',details:JSON.stringify(details),version:1};
 if(payload.details.length>16000)throw new Response('Submission is too large',{status:413});
 try {return await createDocument('leads',payload,id);}
 catch(e){if(e instanceof AppwriteError&&e.status===409){const previous=await getDocument<Lead>('leads',id);if(previous.email===email&&previous.name===name&&previous.phone===phone)return previous;throw new Response('This submission reference was already used. Refresh and try again.',{status:409});}throw e;}
}
