const crypto = require('node:crypto');
const {promisify} = require('node:util');
const scrypt = promisify(crypto.scrypt);
const COOKIE = '__Host-lightship';
function configured(){return Boolean(process.env.BLOB_READ_WRITE_TOKEN&&process.env.LIGHTSHIP_ADMIN_PASSWORD_HASH&&process.env.LIGHTSHIP_SESSION_SECRET?.length>=32)}
function fail(status,message){const error=new Error(message);error.status=status;return error}
function sameOrigin(req){const origin=req.headers.origin;const host=req.headers.host;if(!origin||!host)throw fail(403,'Origen no permitido.');let url;try{url=new URL(origin)}catch{throw fail(403,'Origen no permitido.')}if(url.host!==host||(!['localhost','127.0.0.1'].includes(url.hostname)&&url.protocol!=='https:'))throw fail(403,'Origen no permitido.')}
function equal(a,b){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)}
async function passwordMatches(password,encoded=process.env.LIGHTSHIP_ADMIN_PASSWORD_HASH){const [scheme,salt,expected]=String(encoded||'').split('$');if(scheme!=='scrypt'||!/^[a-f0-9]{32}$/.test(salt||'')||!/^[a-f0-9]{128}$/.test(expected||''))return false;const hash=await scrypt(password,Buffer.from(salt,'hex'),64);return equal(hash.toString('hex'),expected)}
function sign(payload){const encoded=Buffer.from(JSON.stringify(payload)).toString('base64url');const mac=crypto.createHmac('sha256',process.env.LIGHTSHIP_SESSION_SECRET).update(encoded).digest('base64url');return encoded+'.'+mac}
function createSession(){return sign({user:process.env.LIGHTSHIP_ADMIN_USER||'nicolas',expires:Date.now()+8*60*60*1000,nonce:crypto.randomBytes(16).toString('hex')})}
function session(req){try{const cookie=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));if(!cookie)return null;const token=cookie.slice(COOKIE.length+1);if(token.length>1500)return null;const [data,mac]=token.split('.');if(!data||!mac||!process.env.LIGHTSHIP_SESSION_SECRET)return null;const expected=crypto.createHmac('sha256',process.env.LIGHTSHIP_SESSION_SECRET).update(data).digest('base64url');if(!equal(mac,expected))return null;const payload=JSON.parse(Buffer.from(data,'base64url').toString());return payload.expires>Date.now()&&payload.user===(process.env.LIGHTSHIP_ADMIN_USER||'nicolas')?payload:null}catch{return null}}
function requireSession(req){if(!configured())throw fail(503,'El panel está pendiente de activación.');const user=session(req);if(!user)throw fail(401,'Ingresá nuevamente para continuar.');return user}
function cookie(value,maxAge=28800){return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`}
function json(res,status,data){res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');return res.status(status).json(data)}
function errorResponse(res,error){if(!error.status)console.error('Lightship panel:',error.name);return json(res,error.status||500,{error:error.status?error.message:'No pudimos completar la operación. Intentá nuevamente.'})}
function objectBody(req){const body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!body||typeof body!=='object'||Array.isArray(body))throw fail(400,'Solicitud inválida.');return body}
function validId(id){return typeof id==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(id)}
function text(value,max){if(typeof value!=='string')throw fail(400,'Revisá los textos ingresados.');return value.trim().slice(0,max)}
module.exports={COOKIE,configured,fail,sameOrigin,equal,passwordMatches,createSession,session,requireSession,cookie,json,errorResponse,objectBody,validId,text,sign};
