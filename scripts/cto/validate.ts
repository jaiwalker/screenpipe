// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com
import {parseArgs} from 'node:util';
import {resolve,join} from 'node:path';
import {readFileSync} from 'node:fs';
import {inspect} from './health';
import {saveRun,saveFeedback} from './artifacts';

const repo=resolve(import.meta.dir,'../..');
const {values}=parseArgs({args:Bun.argv.slice(2),options:{api:{type:'string'},out:{type:'string'},'require-audio':{type:'boolean'},feedback:{type:'string'},run:{type:'string'}}});
const root=resolve(values.out??join(repo,'.cto-runtime'));
try {
  if (values.feedback) {
    if (!values.run) throw new Error('--run is required when recording feedback');
    console.log(JSON.stringify({feedbackId:saveFeedback(root,values.run,values.feedback),directory:join(root,'feedback')}));
  } else {
    const release=JSON.parse(readFileSync(join(repo,'cto-release.json'),'utf8'));
    const commit=Bun.spawnSync(['git','rev-parse','HEAD'],{cwd:repo});
    release.sourceCommit=commit.exitCode===0?commit.stdout.toString().trim():'unknown';
    release.sourceDirty=Bun.spawnSync(['git','status','--porcelain'],{cwd:repo}).stdout.toString().trim().length>0;
    // The development port is intentionally different from the everyday recorder.
    const api=values.api??process.env.SCREENPIPE_LOCAL_API_URL??'http://127.0.0.1:3040';
    const report=await inspect(api,process.env.SCREENPIPE_LOCAL_API_KEY,values['require-audio']);
    const id=saveRun(root,report,release);
    console.log(JSON.stringify({runId:id,status:report.status,report:join(root,'runs',id+'.md'),checks:report.checks},null,2));
    if (report.status!=='healthy')process.exitCode=2;
  }
}catch(error){console.error(error instanceof Error?error.message:'Validation failed');process.exitCode=1;}
