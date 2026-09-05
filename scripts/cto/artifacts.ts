// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {Report} from './health';

export type Release = {companionVersion:string;build:number;upstreamTag?:string;upstreamCommit?:string;sourceCommit?:string;sourceDirty?:boolean};
function folder(root:string,name:string):string {
  mkdirSync(root,{recursive:true,mode:0o700});
  const path=join(root,name);mkdirSync(path,{recursive:true,mode:0o700});return path;
}
function write(path:string,value:string):void { writeFileSync(path,value,{mode:0o600,flag:'wx'}); }

export function saveRun(root:string,report:Report,release:Release):string {
  const directory=folder(root,'runs');
  const id=new Date().toISOString().replaceAll(':','-')+'-'+randomUUID();
  const createdAt=new Date().toISOString();
  const record={id,createdAt,release,report};
  write(join(directory,id+'.json'),JSON.stringify(record,null,2)+'\n');
  const lines=[`# Capture validation — ${createdAt}`,'',`Run: ${id}`,`Status: **${report.status}**`,
    `Companion: ${release.companionVersion} (build ${release.build})`,
    `Upstream: ${release.upstreamTag??'not recorded'} / ${release.upstreamCommit??'not recorded'}`,
    `Source commit: ${release.sourceCommit??'not recorded'}`,
    `Uncommitted source changes: ${release.sourceDirty===undefined?'not recorded':release.sourceDirty?'yes':'no'}`,
    `API engine version: ${report.engineVersion??'unknown'} (not the desktop app version)`,'',
    '| Check | Result | Evidence |','|---|---|---|',
    ...report.checks.map(c=>`| ${c.id} | ${c.outcome} | ${c.detail.replaceAll('|','/').replaceAll('\n',' ')} |`),'',
    'This checks operational freshness and bounded retrieval. It does not establish transcription accuracy, decision ownership or all-day reliability.',''];
  write(join(directory,id+'.md'),lines.join('\n'));
  return id;
}

export function saveFeedback(root:string,runId:string,message:string):string {
  if (!/^[A-Za-z0-9.-]{1,120}$/.test(runId)) throw new Error('Invalid run ID');
  if (!message.trim()||message.length>10000) throw new Error('Feedback must contain 1–10000 characters');
  const run=JSON.parse(readFileSync(join(root,'runs',runId+'.json'),'utf8'));
  const id='FB-'+randomUUID();
  write(join(folder(root,'feedback'),id+'.json'),JSON.stringify({id,runId,createdAt:new Date().toISOString(),release:run.release,
    status:'new',message,regressionTest:null,fixedIn:null},null,2)+'\n');
  return id;
}
