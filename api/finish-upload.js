const fs=require('node:fs');
const fsp=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {randomUUID}=require('node:crypto');
const {pipeline}=require('node:stream/promises');
const {Readable}=require('node:stream');
const {get,put,head,del}=require('@vercel/blob');
const S=require('../lib/security.cjs');
const Store=require('../lib/store.cjs');
const {transformMedia,poster}=require('../lib/process-media.cjs');
module.exports=async(req,res)=>{let temp;try{S.requireSession(req);if(req.method!=='POST')return S.json(res,405,{error:'Método no permitido.'});S.sameOrigin(req);const body=S.objectBody(req);if(!/^incoming\/[a-f0-9-]{36}\.(jpg|jpeg|png|webp|mp4|mov|webm)$/.test(body.pathname||''))throw S.fail(400,'Archivo inválido.');const title=S.text(body.title,100),description=S.text(body.description||'',200);if(!title)throw S.fail(400,'Escribí un título.');const metadata=await head(body.pathname);if(metadata.size>60*1024*1024)throw S.fail(400,'El archivo supera los 60 MB.');const type=metadata.contentType.startsWith('video/')?'video':'image';if(!['image/jpeg','image/png','image/webp','video/mp4','video/quicktime','video/webm'].includes(metadata.contentType))throw S.fail(400,'Formato de archivo no compatible.');
temp=await fsp.mkdtemp(path.join(os.tmpdir(),'lightship-'));const input=path.join(temp,'input'+path.extname(body.pathname)),output=path.join(temp,type==='video'?'clean.mp4':'clean.webp');const raw=await get(body.pathname,{access:'private',useCache:false});if(!raw)throw S.fail(404,'No encontramos el archivo. Volvé a subirlo.');await pipeline(Readable.fromWeb(raw.stream),fs.createWriteStream(input));
// The original is private. Only a processed file is added to the public gallery.
await transformMedia(input,output,type);const id=randomUUID(),mediaPath='media/'+id+(type==='video'?'.mp4':'.webp');await put(mediaPath,fs.createReadStream(output),{access:'private',contentType:type==='video'?'video/mp4':'image/webp',addRandomSuffix:false});let posterPath;
if(type==='video'){const posterFile=path.join(temp,'poster.jpg');await poster(output,posterFile);posterPath='media/'+id+'-poster.jpg';await put(posterPath,fs.createReadStream(posterFile),{access:'private',contentType:'image/jpeg',addRandomSuffix:false})}
const record={id,type,title,description,path:mediaPath,poster:posterPath,published:true,createdAt:new Date().toISOString(),silent:type==='video'};await Store.writeJSON(Store.recordPath(id),record);await del(body.pathname).catch(()=>{});return S.json(res,200,{ok:true,item:Store.publicItem(record)});
}catch(error){return S.errorResponse(res,error)}finally{if(temp)await fsp.rm(temp,{recursive:true,force:true})}};
