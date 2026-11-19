import test from 'node:test';
import assert from 'node:assert/strict';
import {filterExpenses} from '../app/lib/expense-search.ts';
test('expense filters combine criteria and never count voided entries as spend',()=>{
 const rows=[
 {description:'Synthetic rent',payee:'Fixture supplier',reference:'REF-01',paymentMethod:'Bank transfer',category:'Rent',amountMinor:'1230'},
 {description:'Synthetic correction',category:'Rent',amountMinor:'500',voidedAt:'2030-01-01'},
 {description:'Other fixture',category:'Other',amountMinor:'100'},
 ];
 const all={search:'',category:'',paymentMethod:'',status:'all'};
 assert.equal(filterExpenses(rows,all).activeTotalMinor,1330);
 assert.deepEqual(filterExpenses(rows,{...all,search:'SUPPLIER ref-01',paymentMethod:'Bank transfer',category:'Rent'}).rows,[rows[0]]);
 assert.equal(filterExpenses(rows,{...all,status:'voided'}).activeTotalMinor,0);
 assert.deepEqual(filterExpenses(rows,{...all,paymentMethod:'Cash'}).rows,[]);
 assert.equal(rows.length,3);
});

test('copying an expense preserves payment setup and clears evidence tied to the original payment',async()=>{
 const {copyExpenseDraft}=await import('../app/lib/expense-search.ts');
 const source={id:'original',description:'Synthetic rent',category:'Rent',payee:'Synthetic landlord',paymentMethod:'Bank transfer',
  amountMinor:'12345',spentOn:'2030-01-01',reference:'OLD-PAYMENT',receiptFileId:'original-file',voidedAt:'2030-01-02'};
 assert.deepEqual(copyExpenseDraft(source),{description:'Synthetic rent',category:'Rent',payee:'Synthetic landlord',
  paymentMethod:'Bank transfer',amount:'123.45',spentOn:'',reference:''});
 assert.equal(source.reference,'OLD-PAYMENT');
});
