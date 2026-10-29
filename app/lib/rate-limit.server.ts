import { createHash } from "node:crypto";
const buckets=new Map<string,{count:number;until:number}>();
export function rateLimit(request:Request,namespace:string,limit:number,windowMs:number,identity="") {
 const now=Date.now();
 if(buckets.size>10000)for(const [key,bucket] of buckets)if(bucket.until<now)buckets.delete(key);
 const address=process.env.NODE_ENV==="production"?(request.headers.get("X-Real-IP")??"unknown"):"development";
 const key=createHash('sha256').update(`${namespace}:${address}:${identity}`).digest('hex');
 let bucket=buckets.get(key);if(!bucket||bucket.until<now){bucket={count:0,until:now+windowMs};buckets.set(key,bucket);}
 if(++bucket.count>limit)throw new Response("Too many attempts. Please try again later.",{status:429,headers:{"Retry-After":String(Math.ceil((bucket.until-now)/1000))}});
}
