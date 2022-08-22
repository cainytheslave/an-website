"use strict";// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt GNU-AGPL-3.0-or-later
(()=>{let r="bigint";try{BigInt(69)}catch{BigInt=Number,r="number"}const d=elById("output"),i=[elById("euro"),elById("mark"),elById("ost"),elById("schwarz")],c=[BigInt(1),BigInt(2),BigInt(4),BigInt(20)],b=/^(?:\d+|(?:\d+)?[,.]\d{1,2}|\d+[,.](?:\d{1,2})?)?$/,s=t=>/^0*$/.test(t);function a(t){if(typeof t=="string"&&(t=o(t)),typeof t!==r)return alert(`Ungültiger Wert ${t} mit type ${typeof t}`),null;typeof t=="number"&&(t=Math.floor(t));let n=t.toString();if(r==="number"&&n.includes("e")){const[l,p]=n.split("e");if(p.startsWith("-"))return"0";let[v,u]=l.split(".");u=u||"",n=v+u+"0".repeat(parseInt(p)-u.length)}if(s(n))return"0";const e=n.slice(-2);return(n.slice(0,-2)||"0")+(s(e)?"":","+(e.length===1?"0":"")+e)}function o(t){if(typeof t!="string")throw`${t} is not a String.`;if(s(t))return BigInt(0);let[n,e]=[t,"00"];return t.includes(",")?[n,e]=t.split(","):t.includes(".")&&([n,e]=t.split(".")),e.length!==2&&(e=(e+"00").slice(0,2)),BigInt(n+e)}PopStateHandlers.currencyConverter=t=>g(o(t.state.euro));const f=(t,n)=>setURLParam("euro",t,{euro:t},"currencyConverter",n);function g(t,n=null){f(a(t)||"null",!1);for(let e=0;e<4;e++){const l=a(t*c[e]);i[e].placeholder=l||"null",e!==n&&(i[e].value=l||"null")}}const m=()=>{d.value=i[0].value+" Euro, das sind ja "+i[1].value+" Mark; "+i[2].value+" Ostmark und "+i[3].value+" Ostmark auf dem Schwarzmarkt!"};function I(t){t.preventDefault();for(const n of i)n.value=a(n.value)||"null";f(i[0].value,!0),m()}for(let t=0;t<4;t++)i[t].oninput=()=>{for(const n of i)n.className="";if(!b.test(i[t].value)){i[t].className="invalid";return}g(o(i[t].value)/c[t],t),m()};for(const t of i)t.value=t.placeholder;elById("form").onsubmit=I})();// @license-end
//# sourceMappingURL=converter.js.map
