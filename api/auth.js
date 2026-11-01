const S=require('../lib/security.cjs');
const {atomicJSON}=require('../lib/store.cjs');
module.exports=async(req,res)=>{try{
  if(req.method==='GET')return S.json(res,200,{configured:S.configured(),authenticated:Boolean(S.session(req)),user:process.env.LIGHTSHIP_ADMIN_USER||'nicolas'});
  if(req.method!=='POST')return S.json(res,405,{error:'Método no permitido.'});
  S.sameOrigin(req);const body=S.objectBody(req);
  if(body.action==='logout'){res.setHeader('Set-Cookie',S.cookie('',0));return S.json(res,200,{ok:true})}
  if(!S.configured())throw S.fail(503,'El panel está pendiente de activación.');
  if(typeof body.username!=='string'||typeof body.password!=='string'||body.password.length>256||body.username.length>100)throw S.fail(400,'Revisá los datos de acceso.');
  // Durable attempts counter; independent of serverless instance lifetime.
  await atomicJSON('system/login-attempts.json',previous=>{const now=Date.now();const state=previous&&previous.until>now?previous:{count:0,until:now+15*60*1000};if(state.count>=8)throw S.fail(429,'Se alcanzó el límite de intentos. Volvé a intentar en 15 minutos.');return {...state,count:state.count+1}});
  const matches=await S.passwordMatches(body.password);
  if(!matches||!S.equal(body.username.trim(),process.env.LIGHTSHIP_ADMIN_USER||'nicolas'))throw S.fail(401,'Usuario o contraseña incorrectos.');
  await atomicJSON('system/login-attempts.json',()=>({count:0,until:0}));
  res.setHeader('Set-Cookie',S.cookie(S.createSession()));return S.json(res,200,{ok:true,user:process.env.LIGHTSHIP_ADMIN_USER||'nicolas'});
}catch(error){return S.errorResponse(res,error)}};
