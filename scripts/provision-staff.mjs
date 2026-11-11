import {api,loadEnvironment} from './appwrite-client.mjs';
loadEnvironment();
const [userId,name,role='counselor']=process.argv.slice(2);
if(!userId||!name||!['owner','admin','manager','counselor','editor','publisher'].includes(role))throw new Error('Usage: node scripts/provision-staff.mjs EXISTING_AUTH_USER_ID "Name" ROLE');
// This command links an existing identity; passwords are never passed on the command line.
const identity=await api(`/users/${encodeURIComponent(userId)}`);
if(identity.$id!==userId||!identity.status)throw new Error("Link an enabled Auth user.");
const path=`/databases/${process.env.APPWRITE_DATABASE_ID}/collections/staff/documents`;
const data={name,role,active:true,teamId:''};
try {
 const existing=await api(`${path}/${encodeURIComponent(userId)}`);
 if(existing.name!==name||existing.role!==role||!existing.active||existing.revocationPending)throw new Error('Existing staff profile is protected. Use Team & access to change it.');
}
catch(e){if(e.status!==404)throw e;await api(path,'POST',{documentId:userId,data,permissions:[]});}
console.log(`Staff profile configured with role: ${role}`);
