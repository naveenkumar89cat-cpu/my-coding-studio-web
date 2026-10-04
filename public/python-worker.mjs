import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";
let ready=loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v314.0.7/full/"});
self.onmessage=async(e)=>{
  const {id,python}=e.data; let stdout=[];
  try{
    const py=await ready;
    py.setStdout({batched:s=>stdout.push(s)});
    py.setStderr({batched:s=>stdout.push(s)});
    const result=await py.runPythonAsync(python);
    self.postMessage({id,stdout:stdout.join("\n"),result:result==null?"":String(result)});
  }catch(err){self.postMessage({id,stdout:stdout.join("\n"),error:String(err)});}
};
