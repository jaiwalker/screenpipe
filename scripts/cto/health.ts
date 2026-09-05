// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com
export type Check = { id: string; outcome: 'pass'|'fail'|'not_run'; detail: string };

export type Report = {
  status: 'healthy'|'degraded'|'paused'|'unknown';
  checks: Check[];
  engineVersion: string|null;
  sampleCount?: number;
  sampleIds?: number[];
};

function freshness(id: string, timestamp: unknown, now: number, maxAge: number): Check {
  if (typeof timestamp !== 'string' || !Number.isFinite(Date.parse(timestamp))) {
    return {id, outcome:'not_run', detail:'No valid capture timestamp supplied'};
  }
  const age = (now - Date.parse(timestamp))/1000;
  return {id, outcome: age >= -5 && age <= maxAge ? 'pass':'fail',
    detail: age < -5 ? 'Capture timestamp is in the future' : `Capture age ${Math.round(age)} seconds; threshold ${maxAge} seconds`};
}

export function evaluateHealth(body: any, now = Date.now(), requireAudio = false): Report {
  const checks: Check[] = [];
  const valid = body && typeof body === 'object' && !Array.isArray(body);
  const paused = valid && ['disabled','paused'].includes(body.frame_status);
  checks.push({id:'api_health', outcome:valid && body.status === 'healthy' ? 'pass':'fail',
    detail:valid && body.status === 'healthy' ? 'API reports healthy':'API does not report healthy'});
  checks.push(paused ? {id:'screen_freshness', outcome:'not_run', detail:'Screen stream is explicitly paused or disabled'}
    : freshness('screen_freshness',body?.last_frame_timestamp,now,60));
  checks.push({id:'screen_state', outcome:paused ? 'not_run':body?.frame_status==='ok' ? 'pass':'fail',
    detail:paused ? 'Screen stream disabled':body?.frame_status==='ok' ? 'Screen stream reports ok':'Screen stream does not report ok'});
  checks.push(requireAudio ? freshness('audio_freshness',body?.last_audio_timestamp,now,120)
    : {id:'audio_freshness',outcome:'not_run',detail:'Audio correctness/freshness not requested; requires a controlled call test'});
  if (requireAudio) checks.push({id:'audio_state',outcome:body?.audio_status==='ok'?'pass':'fail',detail:'Required audio stream status'});
  const failed=checks.some(c=>c.outcome==='fail');
  const missing=checks.some(c=>c.outcome==='not_run' && (c.id==='screen_freshness'||requireAudio&&c.id==='audio_freshness'));
  const version=typeof body?.version==='string' && /^[0-9][0-9A-Za-z.+-]{0,63}$/.test(body.version) ? body.version:null;
  return {status:failed?'degraded':paused?'paused':missing?'unknown':'healthy',checks,engineVersion:version};
}

export async function inspect(base:string,key?:string, requireAudio=false): Promise<Report> {
  const url=new URL(base);
  if (url.protocol!=='http:' || !['127.0.0.1','localhost','[::1]'].includes(url.hostname) || url.username || url.password || url.pathname!=='/' || url.search || url.hash) {
    throw new Error('Only a loopback HTTP origin is accepted');
  }
  const headers:Record<string,string>={'X-Screenpipe-Client':'api'};
  if (key) headers.Authorization=`Bearer ${key}`;
  const request=async(path:string)=>{
    const response=await fetch(new URL(path,url),{headers,redirect:'error',signal:AbortSignal.timeout(5000)});
    if (!response.ok) throw new Error(`http_${response.status}`);
    const declared=Number(response.headers.get('content-length'));
    if (declared>65536) throw new Error('response_too_large');
    const reader=response.body?.getReader();
    if (!reader) throw new Error('empty_response');
    let bytes=0;const chunks:Uint8Array[]=[];
    try { for (;;) {const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>65536)throw new Error('response_too_large');chunks.push(value);} }
    finally {await reader.cancel().catch(()=>{});}
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  };
  let report:Report;
  try {report=evaluateHealth(await request('/health'),Date.now(),requireAudio);}
  catch {return {status:'degraded',engineVersion:null,checks:[{id:'api_health',outcome:'fail',detail:'Health endpoint unavailable, invalid, redirected or oversized'}]};}
  try {
    const sample=await request('/search?content_type=all&limit=3&max_content_length=1&fields=type,content.frame_id,content.chunk_id,content.timestamp');
    if (!Array.isArray(sample.data)) throw new Error('invalid_sample');
    report.sampleCount=sample.data.length;
    if (!sample.data.length && report.status==='healthy') report.status='unknown';
    report.sampleIds=sample.data.map((row:any)=>row?.content?.frame_id??row?.content?.chunk_id).filter((id:unknown)=>Number.isSafeInteger(id));
    report.checks.push({id:'retrieval',outcome:sample.data.length?'pass':'not_run',detail:sample.data.length?'Bounded sample is retrievable; semantic correctness not tested':'No sample returned; correctness not tested'});
  } catch {
    report.checks.push({id:'retrieval',outcome:'fail',detail:'Search unavailable or unauthorized; configure local API key if required'});
    report.status='degraded';
  }
  return report;
}
