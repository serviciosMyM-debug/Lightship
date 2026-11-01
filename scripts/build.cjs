const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'public');
// Only the generated build directory is replaced, never the source or user media.
if(path.dirname(out)!==root||path.basename(out)!=='public')throw Error('Invalid build directory');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','styles.css','app.js','content.js','editor.html','editor.css','editor.js','admin.html','admin.css','robots.txt','files.json','GUIA-PUBLICACION.md'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
require('esbuild').buildSync({entryPoints:[path.join(root,'admin-src.js')],outfile:path.join(out,'admin.js'),bundle:true,minify:true,format:'esm',platform:'browser',target:['es2020'],legalComments:'eof'});
console.log('Lightship: public/ preparado.');
