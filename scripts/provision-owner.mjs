import {randomUUID,randomBytes} from 'node:crypto';
import {api,loadEnvironment,q} from './appwrite-client.mjs';
loadEnvironment();
const email=process.argv[2];
if(!email||!email.includes('@'))throw new Error('Usage: node scripts/provision-owner.mjs owner@example.com');
const params=new URLSearchParams();params.append('queries[]',q('equal','email',[email]));
const users=await api(`/users?${params}`);
let user=users.users[0];
if(!user){user=await api('/users','POST',{userId:randomUUID(),email,password:randomBytes(48).toString('base64url'),name:'ProConsulting Administrator'});console.log('Created the owner identity with a random, undisclosed password. Set a chosen password in the Appwrite Console before sign-in. No email has been sent.');}
const base=`/databases/${process.env.APPWRITE_DATABASE_ID}/collections/staff/documents`;
try{const current=await api(`${base}/${user.$id}`);if(current.role!=='owner')throw new Error('An existing non-owner staff profile needs explicit review before promotion');console.log('Existing owner profile preserved.');}
catch(e){if(e.status!==404)throw e;await api(base,'POST',{documentId:user.$id,data:{name:user.name||'Administrator',role:'owner',active:true,teamId:''},permissions:[]});console.log('Owner staff profile created.');}
