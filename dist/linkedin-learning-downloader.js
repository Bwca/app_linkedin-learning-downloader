"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var a=(t,e,o)=>new Promise((r,i)=>{var s=d=>{try{l(o.next(d))}catch(p){i(p)}},c=d=>{try{l(o.throw(d))}catch(p){i(p)}},l=d=>d.done?r(d.value):Promise.resolve(d.value).then(s,c);l((o=o.apply(t,e)).next())});var _fs = require('fs');var _readline = require('readline'); var _readline2 = _interopRequireDefault(_readline);var _chalk = require('chalk'); var _chalk2 = _interopRequireDefault(_chalk);var I=class{out(e){let o=this.messageToColoredString(e);console.log(o)}promptUserInput(e){return new Promise(o=>{let r=this.messageToColoredString(e),i=this.readlineInterface;i.question(r,s=>{o(s.trim()),i.close()})})}promtUserUntilValidInput(e,o,r){return a(this,null,function*(){let i,s=!1;do i=yield this.promptUserInput(e),s=o(i),!s&&r&&this.out(r);while(!s);return i})}get readlineInterface(){return _readline2.default.createInterface({input:process.stdin,output:process.stdout})}messageToColoredString({text:e,type:o}){switch(o){case"success":return _chalk2.default.green.bold(e);case"info":return _chalk2.default.whiteBright(e);case"error":return _chalk2.default.red.bold(e);case"prompt":return _chalk2.default.cyan.bold(e);default:return e}}},n=new I;var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);var U=class{constructor(){this.httpClient=_axios2.default}get(e,o,r){return this.httpClient.get(e,{params:o,headers:r})}downloadVideoFile(e){return this.httpClient.get(e,{responseType:"stream"})}},f=new U;function v(t,e,o){return a(this,null,function*(){let r=_fs.createWriteStream.call(void 0, e);n.out({text:`Downloading ${o} from 
${t.slice(0,20)}...`,type:"info"});let{data:i}=yield f.downloadVideoFile(t);return new Promise((s,c)=>{i.pipe(r);let l=null;r.on("error",d=>{l=d,r.close(),c(d)}),r.on("close",()=>{l||s()})})})}var _jsdom = require('jsdom');function y(e){return a(this,arguments,function*({data:t}){let{window:{document:o}}=new (0, _jsdom.JSDOM)(t);return o})}function x(t,e){return`${++t} ${W(e)}`}function W(t){return t.replace(/[/:*?"<>|~#%&+{}\-\\]/g,"")}var R=class{getAuthHeaders(){return a(this,null,function*(){return this.authHeaders||(this.authHeaders=(yield this.loadTokensFromFile())||(yield this.promptUserForTokens())),this.authHeaders})}loadTokensFromFile(){return a(this,null,function*(){let e=`${__dirname}/cookie.token`,o=`${__dirname}/csrf.token`;if(!_fs.existsSync.call(void 0, e)||!_fs.existsSync.call(void 0, o))return;try{let r=yield _fs.promises.readFile(e),i=yield _fs.promises.readFile(o),s={"csrf-token":i.toString(),cookie:r.toString()};if(!s.cookie||!s["csrf-token"])throw"Invalid tokens!";return s}catch(r){n.out({text:r.toString(),type:"error"})}})}promptUserForTokens(){return a(this,null,function*(){let e=yield n.promtUserUntilValidInput({text:"Please enter CSRF token:",type:"prompt"},Boolean),o=yield n.promtUserUntilValidInput({text:"Please enter the cookie:",type:"prompt"},Boolean);return{"csrf-token":e,cookie:o}})}},w=new R;function P(t,e){return a(this,null,function*(){var c;let o=Array.from(t.querySelectorAll('code[style="display: none"]')).find(l=>{var d;return(d=l.textContent)==null?void 0:d.includes("exerciseFiles")});o||n.out({text:"No exercises found for the course.",type:"info"});let r=JSON.parse(o.textContent),i=r.included.find(l=>Boolean(l.exerciseFiles));!i||!((c=i.exerciseFiles)==null?void 0:c.length)?n.out({text:`
No exercises found for the course.`,type:"info"}):n.out({text:`
Found ${i.exerciseFiles.length} exercises, downloading...`,type:"info"});let s=0;yield Promise.all(i.exerciseFiles.map((l,d)=>J(l,e,d).then(p=>{n.out({text:`${p} has been downloaded.`,type:"success"}),n.out({text:`Download progress: ${++s} / ${i.exerciseFiles.length}`,type:"info"})}).catch(p=>n.out({text:p,type:"error"}))))})}function J(t,e,o){return a(this,null,function*(){let r=x(o,t.name),i=t.url;return yield v(i,`${e}/${r}`,r),r})}function H(t,e,o){return a(this,null,function*(){let{data:r}=yield f.get("https://www.linkedin.com/learning-api/videos",e,o),i={title:t.title,progressiveStreams:r.elements.map(s=>s.presentation.videoPlay.videoPlayMetadata.progressiveStreams).reduce((s,c)=>[...s,...c],[])};return i})}function L(t){return a(this,null,function*(){var d;let{parentSlug:e}=t,o="slugs",r=yield w.getAuthHeaders(),i=15e3,s=15e3,c=[],l=[];do{let p=l.length?l:t.videos;for(let m of p){n.out({text:`Requesting video options for ${m.title}...`,type:"info"});try{let u=yield H(m,{parentSlug:e,q:o,slug:m.slug},r);c.push(u),l=l.filter(({slug:g})=>g!==m.slug),n.out({text:"Success!",type:"success"})}catch(u){let g=((d=u==null?void 0:u.response)==null?void 0:d.status)===429;if(g)n.out({text:"Encountered error 429: too many requests",type:"error"});else throw u;l.push(m),yield new Promise(h=>{n.out({text:`
Sleeping for ${s/1e3} seconds before continuing to prevent 429 error
Videos resolved: ${c.length} / ${t.videos.length}`,type:"info"}),s+=i,setTimeout(()=>h(!0),s)})}}l.length&&n.out({text:`Retrying requests for ${l.length} videos...`,type:"info"})}while(l.length);return c})}function M(t,e){return a(this,null,function*(){var s;let o;o=(s=t.match(/\/([^/]+)$/))==null?void 0:s[1];let r=e.title,i=Array.from(e.querySelectorAll(".video__link")).map(c=>{var l,d,p,m;return{title:(d=(l=c.querySelector(".video__title"))==null?void 0:l.textContent)==null?void 0:d.trim(),slug:(m=(p=c.getAttribute("href"))==null?void 0:p.match(/\/([^/]+)\?/))==null?void 0:m[1].trim()}});return{listName:r,parentSlug:o,videos:i}})}function E(t){return/^https?:\/\/(www\.)?linkedin\.com\/learning\/[a-z\-_\d]+$/.test(t)}function $(){return a(this,null,function*(){return n.promtUserUntilValidInput({text:`
Please enter url to a linkedin course you would like to download?
      i.e. https://www.linkedin.com/learning/critical-thinking-for-better-judgment-and-decision-making
`,type:"prompt"},t=>E(t),{text:"Invalid course url entered, enter a valid one.",type:"error"})})}function q(t){return a(this,null,function*(){let e="";do{let o=yield n.promptUserInput({text:`
Please enter the path to the download folder:
`,type:"prompt"});if(/^\..+$/.test(o)&&(o=`${t}/${/[\\/]/.test(o[1])?o.slice(2):o}`),!_fs.existsSync.call(void 0, o)){n.out({text:`
Folder does not exist, trying to create it...`,type:"info"});try{_fs.mkdirSync.call(void 0, o),n.out({text:"Folder created!",type:"success"})}catch(r){n.out({text:`Error while trying to create folder: ${r.toString()}`,type:"error"});continue}}e=o}while(!e);return e})}function V(t){return a(this,null,function*(){let e=t.reduce((r,i)=>[...r,i.progressiveStreams.map(({width:s})=>s)],[]),o=t[0].progressiveStreams.map(({width:r})=>r).filter(r=>e.every(i=>i.includes(r)));return Number.parseInt(yield n.promtUserUntilValidInput({text:`
Please, select desired video width: ${o.join(", ")}: `,type:"prompt"},r=>o.map(String).includes(r)))})}function O(t){return t.reduce((e,o,r)=>{let i=N(o.transcriptStartAt),s=r===t.length-1;if(s)i+=`
`;else{let l=N(t[r+1].transcriptStartAt);i+=` --> ${l}
`}let c=`${++r}
${i}${o.caption}

`;return e+c},"")}function N(t){let e=(t%1e3).toLocaleString("en-US",{minimumIntegerDigits:3,useGrouping:!1}),o=Math.trunc(t/1e3).toLocaleString("en-US",{minimumIntegerDigits:2,useGrouping:!1}),r=Math.trunc(t/1e3/60).toLocaleString("en-US",{minimumIntegerDigits:2,useGrouping:!1}),i=Math.trunc(t/1e3/60/60).toLocaleString("en-US",{minimumIntegerDigits:2,useGrouping:!1});return`${i}:${r}:${o},${e}`}function _(t){let e=Array.from(t.querySelectorAll('code[style="display: none"]')).find(i=>{var s;return(s=i.textContent)==null?void 0:s.includes("transcriptStartAt")});if(!e)throw"Could not locate subtitles on the page, check if they are missing";let o=JSON.parse(e.textContent.replace(/&quot/g,'"')),{lines:r}=o.included.find(({lines:i})=>Boolean(i));return r||[]}function F(t){return a(this,null,function*(){let e=yield w.getAuthHeaders();return f.get(t,void 0,e).then(y).then(_).then(O)})}function S(t,e){return/\/$/.test(t)?`${t}${e}`:`${t}/${e}`}function B(t,e,o){return a(this,null,function*(){let r=yield n.promtUserUntilValidInput({text:`
Download subtitles? (y/n) `,type:"prompt"},i=>/^[yn]$/i.test(i));if(/^y$/i.test(r)){let i=0,s=t.videos.length;yield Promise.all(t.videos.map((p,m)=>a(this,[p,m],function*({title:c,slug:l},d){let u=`${x(d,c)}.srt`;try{let g=yield F(`${e}/${l}`);if(!g)throw"Could not find/parse subtitles";let h=S(o,u);yield _fs.promises.writeFile(h,g),++i,n.out({text:`File successfully downloaded: ${u}`,type:"success"}),n.out({text:`Subtitles downloaded: ${i} / ${s}`,type:"info"})}catch(g){n.out({text:`Could not get subtitles for ${u}: ${g.toString()}`,type:"error"})}}))),n.out({text:`
Finished downloading subtitles: ${i} / ${t.videos.length}.`,type:"success"})}})}function D(t,e,o){return a(this,null,function*(){let r=0,i=t.length,s=[],c=[];if(yield Promise.all(t.map((l,d)=>a(this,null,function*(){let p=l.progressiveStreams.find(({width:h})=>h===e),m=`${x(d,l.title)}.${p.mediaType.split("/")[1]}`,u=p==null?void 0:p.streamingLocations[0].url,g=S(o,m);try{yield v(u,g,m),++r,n.out({text:`File successfully downloaded: ${m}`,type:"success"}),n.out({text:`Downloads progress: ${r} / ${i}`,type:"info"})}catch(h){n.out({text:`Error saving video ${m}: ${h.toString()}`,type:"error"}),s.push(`${m}
${u}`),c.push(l)}}))),n.out({text:`
Finished downloading videos: ${r} / ${t.length}`,type:"success"}),s.length){n.out({text:`
Unfortunately, ${s.length} videos could not be downloaded: ${s.join(`
`)}`,type:"error"});let l=yield n.promtUserUntilValidInput({text:"Retry failed downloads?",type:"prompt"},d=>/^[yn]$/i.test(d));/y/i.test(l)&&(yield D(c,e,o))}})}function A(t){return a(this,null,function*(){let e=yield $(),o=yield f.get(e).then(y),r=yield M(e,o);n.out({text:Z(r.videos),type:"success"});let i=yield L(r),s=yield V(i);n.out({text:`Selected video width: ${s}`,type:"success"});let c=yield q(t);n.out({text:`Download path: ${c}
`,type:"info"}),yield D(i,s,c);let l=yield w.getAuthHeaders(),d=yield f.get(e,void 0,l).then(y);yield P(d,c),yield B(r,e,c)})}function Z(t){return`
Found ${t.length} videos:

${t.map(({title:e},o)=>`${++o}. ${e}.`).join(`
`)}`}function k(){return a(this,null,function*(){n.out({text:`
Welcome to the Linkedin learning videos downloade v1!`,type:"info"});let t=!1;do{yield A(__dirname);let e=yield n.promtUserUntilValidInput({text:`
Download another course? (y/n) `,type:"prompt"},o=>/^[yn]$/i.test(o));t=/^n$/i.test(e)}while(!t);n.out({text:`Bye bye!

`,type:"info"}),process.exit()})}k();
