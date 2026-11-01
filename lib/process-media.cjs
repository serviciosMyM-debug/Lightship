const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const ffmpeg=require('@ffmpeg-installer/ffmpeg').path;
const run=promisify(execFile);
async function transformMedia(input,output,type){const common=['-hide_banner','-nostdin','-y','-protocol_whitelist','file,pipe','-i',input];const args=type==='video'?['-map','0:v:0','-an','-sn','-dn','-c:v','libx264','-preset','veryfast','-crf','23','-vf','scale=min(1280\\,iw):-2','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',output]:['-map','0:v:0','-frames:v','1','-vf','scale=min(1800\\,iw):-2','-c:v','libwebp','-quality','84',output];await run(ffmpeg,[...common,...args],{timeout:100000,maxBuffer:2*1024*1024,windowsHide:true})}
async function poster(input,output){await run(ffmpeg,['-hide_banner','-nostdin','-y','-i',input,'-frames:v','1','-vf','scale=480:-2',output],{timeout:15000,maxBuffer:1024*1024,windowsHide:true})}
module.exports={transformMedia,poster,ffmpeg};
