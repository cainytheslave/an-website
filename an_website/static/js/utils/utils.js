// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0-or-later
let i=String(window.location);export function getLastLocation(){return i}export function setLastLocation(t){i=t}export function post(t,o={},e=console.log,r=console.error,a="application/json"){return fetch(t,{method:"POST",body:JSON.stringify(o),headers:{Accept:a,"Content-Type":"application/json"}}).then(n=>n.json()).catch(r).then(e).catch(r)}export function get(t,o={},e=console.log,r=console.error,a="application/json"){const n=new URLSearchParams(o).toString();return fetch(n?"".concat(t,"?").concat(n):t,{method:"GET",headers:{Accept:a}}).then(c=>c.json()).catch(r).then(e).catch(r)}export const PopStateHandlers={URLParamChange:()=>{window.location.reload()}};export function setURLParam(t,o,e,r="URLParamChange",a=!0){return setMultipleURLParams([[t,o]],e,r,a)}export function setMultipleURLParams(t,o,e="URLParamChange",r=!0){const a=new URLSearchParams(window.location.search);for(const[c,l]of t)a.set(c,l);const n="".concat(window.location.origin).concat(window.location.pathname,"?").concat(a.toString());return o.stateType=e,r&&n!==window.location.href?history.pushState(o,n,n):history.replaceState(o,n,n),i=window.location.href,n}function s(){if(window.location.hash==="")return;const t=document.getElementById("header");if(!t)return;const o=document.querySelector(window.location.hash);o&&window.scrollBy(0,o.getBoundingClientRect().top-Math.floor(parseFloat(getComputedStyle(t).height)))}setTimeout(s,4);window.onhashchange=s;window.onpopstate=t=>{if(i.split("#")[0]===window.location.href.split("#")[0]){i=window.location.href,s();return}if(t.state){const o=t.state,e=PopStateHandlers[o.stateType];if(e){t.preventDefault(),e(t),i=window.location.href,s();return}else console.error("Couldn't find state handler for state",o)}console.error("Couldn't handle state. ",t.state),i=window.location.href,window.location.reload()};// @license-end
//# sourceMappingURL=utils.js.map
