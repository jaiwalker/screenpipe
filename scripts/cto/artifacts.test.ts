// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com
import {test,expect} from 'bun:test';
import {mkdtempSync,readFileSync,rmSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {saveRun,saveFeedback} from './artifacts';
import type {Report} from './health';
const report:Report={status:'healthy',engineVersion:'0.4.46',checks:[{id:'audio_freshness',outcome:'not_run',detail:'Controlled call not performed'}]};
test('each run keeps unique JSON and readable report with explicit unrun checks',()=>{
 const root=mkdtempSync(join(tmpdir(),'cto-artifacts-'));
 try{
  const one=saveRun(root,report,{companionVersion:'0.1.0',build:1});
  const two=saveRun(root,report,{companionVersion:'0.1.1',build:2});
  expect(one).not.toBe(two);
  const json=JSON.parse(readFileSync(join(root,'runs',one+'.json'),'utf8'));
  expect(json.release.build).toBe(1);
  expect(readFileSync(join(root,'runs',one+'.md'),'utf8')).toContain('not_run');
  expect(statSync(join(root,'runs',one+'.json')).mode & 0o777).toBe(0o600);
 }finally{rmSync(root,{recursive:true,force:true})}
});
test('feedback is linked to a real run and retains that build identity',()=>{
 const root=mkdtempSync(join(tmpdir(),'cto-feedback-'));
 try{
  const run=saveRun(root,report,{companionVersion:'0.1.0',build:1});
  const feedback=saveFeedback(root,run,'Missed the changed date in the synthetic fixture');
  expect(feedback.length).toBeGreaterThan(0);
  const file=JSON.parse(readFileSync(join(root,'feedback',feedback+'.json'),'utf8'));
  expect(file.runId).toBe(run);expect(file.release.build).toBe(1);expect(file.status).toBe('new');
  expect(()=>saveFeedback(root,'../../escape','bad')).toThrow();
  expect(()=>saveFeedback(root,'missing-run','bad')).toThrow();
 }finally{rmSync(root,{recursive:true,force:true})}
});
