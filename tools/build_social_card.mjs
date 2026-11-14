import fs from 'node:fs';
import {site} from '../website/src/content.mjs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../website');
const sharp=createRequire(path.join(root,'package.json'))('sharp');
const assets=path.join(root,'assets');
const output=process.argv[2]||path.join(root,'dist/assets/clinic-social-card.png');
const text=async(label,size,color,width)=>sharp({text:{text:`<span foreground="${color}">${label}</span>`,font:`IBM Plex Sans Arabic ${size}`,fontfile:path.join(assets,'fonts/ibm-plex-sans-arabic-700.woff2'),rgba:true,dpi:72,width,align:'right'}}).png().toBuffer();
const photo=await sharp(path.join(assets,'clinic-about-hero.webp')).resize(430,420,{fit:'inside'}).png().toBuffer();
const photoSize=await sharp(photo).metadata();
const logo=await sharp(path.join(assets,'logo-horizontal-primary.png')).resize(580,230,{fit:'inside'}).png().toBuffer();
const bg=Buffer.from('<svg width="1200" height="630"><rect width="1200" height="630" fill="#F3F1EC"/><rect width="1200" height="14" fill="#45A18E"/><rect x="40" y="60" width="454" height="426" rx="22" fill="white"/><rect y="530" width="1200" height="100" fill="#0C495C"/></svg>');
const overlays=[{input:photo,left:52,top:60+Math.round((426-photoSize.height)/2)},{input:logo,left:555,top:92}];
for(const [label,size,color,width,left,top]of[
 ['رعاية متخصصة لصحة المرأة',38,'#0C495C',620,535,335],
 ['متابعة الحمل · صحة المرأة · الخصوبة',26,'#256E63',620,535,407],
 ['ذمار · شارع صنعاء تعز · أمام بنك الكريمي',26,'#FFFFFF',820,328,565],
 [site.phone,32,'#FFFFFF',230,48,560]
]) overlays.push({input:await text(label,size,color,width),left,top});
fs.mkdirSync(path.dirname(output),{recursive:true});
await sharp(bg).composite(overlays).png({compressionLevel:9}).toFile(output);
console.log('Social card: '+output);
