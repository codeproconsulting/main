import test from 'node:test';
import assert from 'node:assert/strict';
import {checkFinance} from '../scripts/check-finance.mjs';
import {schema} from '../scripts/appwrite-schema.mjs';
test('finance readiness rejects unsafe storage and unavailable schema or scanner',async()=>{
 let unsafe=false,missing=false,failScan=false;
 const request=async path=>{
  if(path.startsWith('/storage/'))return {enabled:true,fileSecurity:true,encryption:true,antivirus:!unsafe,$permissions:[],maximumFileSize:20*1024*1024,allowedFileExtensions:['pdf','png','jpg','jpeg']};
  const name=path.split('/')[4],definition=schema[name];
  if(path.endsWith('/attributes'))return {attributes:Object.entries(definition.fields).filter(([key])=>!missing||key!=='receiptFileId').map(([key,value])=>({key,status:'available',type:typeof value==='number'?'string':value,size:value}))};
  if(path.endsWith('/indexes'))return {indexes:Object.entries(definition.indexes).map(([key,attributes])=>({key,status:'available',type:'key',attributes}))};
  return {enabled:true,documentSecurity:true,$permissions:[]};
 };
 const run=()=>checkFinance({request,database:'synthetic',bucket:'synthetic',scan:async bytes=>{assert.ok(bytes.length);if(failScan)throw Error();}});
 assert.ok((await run()).every(row=>row.passed));
 unsafe=true;
 assert.equal((await run()).find(row=>row.check==='receipt bucket').passed,false);
 unsafe=false;missing=true;
 assert.equal((await run()).find(row=>row.check==='expenses').passed,false);
 missing=false;failScan=true;
 assert.equal((await run()).find(row=>row.check==='scanner clean-file response').passed,false);
});
