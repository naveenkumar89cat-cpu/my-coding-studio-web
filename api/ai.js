// Vercel serverless AI proxy. Configure AI_API_URL, AI_API_KEY and AI_MODEL.
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const {AI_API_URL,AI_API_KEY,AI_MODEL}=process.env;
  if(!AI_API_URL||!AI_API_KEY||!AI_MODEL) return res.status(503).json({error:'AI server environment is not configured'});
  const {prompt,files,current}=req.body||{};
  const system='You are the coding agent for My Coding Studio. Return ONLY valid JSON: {"message":"short summary","files":{"relative/path":"complete file content"}}. Never use absolute paths or .. paths. Return only files which should be created or replaced.';
  try{
    const r=await fetch(AI_API_URL,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+AI_API_KEY},body:JSON.stringify({model:AI_MODEL,messages:[{role:'system',content:system},{role:'user',content:JSON.stringify({request:prompt,current,files})}],temperature:0.2})});
    const x=await r.json(); if(!r.ok) return res.status(r.status).json({error:x?.error?.message||'AI provider failed'});
    const raw=x?.choices?.[0]?.message?.content; if(!raw) return res.status(502).json({error:'AI returned no content'});
    let y; try{y=JSON.parse(raw.replace(/^```json\s*|\s*```$/g,''))}catch{return res.status(502).json({error:'AI returned invalid JSON'})}
    const safe={}; for(const [k,v] of Object.entries(y.files||{})) if(!k.includes('..')&&!k.startsWith('/')) safe[k]=String(v);
    return res.status(200).json({message:y.message||'Changes ready',files:safe});
  }catch(e){return res.status(500).json({error:String(e)})}
}
