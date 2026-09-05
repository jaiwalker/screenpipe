// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com
import {test, expect} from 'bun:test';
import {evaluateHealth,inspect} from './health';
const now=Date.parse('2026-09-05T05:45:00Z');
const healthy={status:'healthy',version:'0.4.46',frame_status:'ok',audio_status:'ok',last_frame_timestamp:'2026-09-05T15:44:50+10:00',last_audio_timestamp:'2026-09-05T05:44:55Z'};
test('healthy API with old screen timestamps is degraded, not a pass',()=>{
 const result=evaluateHealth({...healthy,last_frame_timestamp:'2026-09-04T05:00:00Z'},now);
 expect(result.status).toBe('degraded');
 expect(result.checks.find(c=>c.id==='screen_freshness')?.outcome).toBe('fail');
});
test('valid timezone-offset timestamps prove screen freshness',()=>{
 expect(evaluateHealth(healthy,now,true).status).toBe('healthy');
 expect(evaluateHealth(healthy,now,true).engineVersion).toBe('0.4.46');
});
test('no timestamps never counts as verified capture',()=>{
 expect(evaluateHealth({status:'healthy',frame_status:'ok'},now).status).toBe('unknown');
});
test('meeting audio not requested is not tested, while required stale audio fails',()=>{
 const value={...healthy,last_audio_timestamp:'2026-09-04T05:00:00Z'};
 expect(evaluateHealth(value,now).checks.find(c=>c.id==='audio_freshness')?.outcome).toBe('not_run');
 expect(evaluateHealth(value,now,true).status).toBe('degraded');
});
test('future timestamp cannot fake a fresh capture',()=>{
 expect(evaluateHealth({...healthy,last_frame_timestamp:'2026-09-06T05:00:00Z'},now).status).toBe('degraded');
});
test('remote addresses rejected before contacting them',async()=>{
 await expect(inspect('https://example.com')).rejects.toThrow('loopback');
});
test('read-only probe fetches health and a bounded sample without returning evidence text or key',async()=>{
 const requests:string[]=[];
 const server=Bun.serve({hostname:'127.0.0.1',port:0,fetch(req){
  const u=new URL(req.url);requests.push(req.method+' '+u.pathname);
  if(u.pathname==='/health') return Response.json(healthy);
  if(req.headers.get('Authorization')!=='Bearer test-key')return new Response('',{status:403});
  return Response.json({data:[{type:'OCR',content:{frame_id:42,text:'private evidence must not enter diagnostic report',timestamp:healthy.last_frame_timestamp}}],pagination:{total:1}});
 }});
 try{
  const report=await inspect(`http://127.0.0.1:${server.port}`,'test-key');
  expect(report.sampleCount).toBe(1);expect(report.sampleIds).toEqual([42]);
  expect(JSON.stringify(report)).not.toContain('private evidence');expect(JSON.stringify(report)).not.toContain('test-key');
  expect(requests).toEqual(['GET /health','GET /search']);
 }finally{server.stop(true)}
});
test('API failure reports failed transport and no invented capture result',async()=>{
 const server=Bun.serve({hostname:'127.0.0.1',port:0,fetch(){return new Response('secret exception',{status:500})}});
 try{
  const report=await inspect(`http://127.0.0.1:${server.port}`);
  expect(report.status).toBe('degraded');expect(JSON.stringify(report)).not.toContain('secret exception');
  expect(report.checks.find((c:any)=>c.id==='api_health')?.outcome).toBe('fail');
 }finally{server.stop(true)}
});

test('fresh health with no retrievable samples is unverified, not healthy', async()=>{
 const server=Bun.serve({port:0,fetch(request){
  return Response.json(new URL(request.url).pathname==='/health'
   ? {status:'healthy',frame_status:'ok',last_frame_timestamp:new Date().toISOString()}
   : {data:[]});
 }});
 try{
  const result=await inspect(`http://127.0.0.1:${server.port}`);
  expect(result.status).toBe('unknown');
  expect(result.checks.find(check=>check.id==='retrieval')?.outcome).toBe('not_run');
 }finally{server.stop(true)}
});
