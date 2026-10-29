// Additive, repeatable setup. Never drops existing records or changes existing attribute definitions.
export const schema = {
 staff: { fields: {name:200,role:30,active:'boolean',teamId:36}, indexes: {active:['active']} },
 leads: { fields: {name:200,email:254,phone:80,service:100,source:500,country:150,stage:50,owner:36,priority:20,nextFollowUp:40,details:65536,version:'integer'}, indexes: {owner:['owner'],stage:['stage'],name_search:{type:'fulltext',attributes:['name']},email:['email']} },
 tasks: {fields:{leadId:36,title:300,owner:36,dueAt:40,status:30,outcome:2000,version:'integer'},indexes:{lead:['leadId'],owner:['owner'],status_due:['status','dueAt']}},
 activities: {fields:{actor:36,entityId:36,entityType:30,event:100,details:65536},indexes:{entity:['entityId']}},
 posts: {fields:{title:300,slug:200,section:30,status:30,body:1000000,excerpt:2000,image:2000,publishedAt:40,metaTitle:300,metaDescription:1000,author:200,legacyId:36,metadata:65536,version:'integer'},indexes:{public:['section','status','publishedAt'],schedule:['status','publishedAt'],url:{type:'unique',attributes:['section','slug']},legacy:['legacyId']}},
 content_sources: {fields:{kind:30,checksum:64,payload:1000000},indexes:{kind:["kind"]}},
 notifications: {fields:{recipient:36,entityId:36,title:300,body:2000,kind:30,read:'boolean'},indexes:{recipient:['recipient']}},
 cases: {fields:{leadId:36,owner:36,kind:30,institution:300,course:300,country:150,intake:100,stage:80,deadline:40,notes:65536,version:'integer'},indexes:{lead:['leadId'],owner:['owner'],deadline:['deadline']}},
 appointments: {fields:{leadId:36,owner:36,title:300,startsAt:40,endsAt:40,status:30,location:1000,notes:65536,version:'integer'},indexes:{lead:['leadId'],owner_start:['owner','startsAt']}},
 locks: {fields:{key:256,owner:100,acquiredAt:40},indexes:{}},
 revisions: {fields:{postId:36,actor:36,payload:1000000,version:'integer'},indexes:{post:['postId']}},
 documents: {fields:{leadId:36,fileId:36,name:200,mime:100,category:100,status:30,expiresAt:40,checksum:64,uploadedBy:36},indexes:{lead:["leadId"],expiry:["expiresAt"]}},
 media: {fields:{fileId:36,name:200,alt:300,caption:1000,mime:100,published:"boolean",checksum:64},indexes:{published:["published"]}},
};
