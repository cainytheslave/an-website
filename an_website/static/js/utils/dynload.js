// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0-or-later
import{d as o,e as a,get as g,hideSitePane as c,PopStateHandlers as p,setLastLocation as y}from"/static/js/utils/utils.js?v=28e0afd522a7348b";var i=a("main"),d={},f=[];function u(t,e){if(!t){console.error("No data received");return}if(t.redirect){location.href=t.redirect;return}let n=t.url;if(!n){console.error("No URL in data ",t);return}if(!e){if(f.length===1&&f[0]===n)return;history.pushState({data:t,url:n,stateType:"dynLoad"},t.title,n),y(n)}if(!t.body){location.reload();return}if(o.onkeydown=()=>{},i.innerHTML=t.body,t.css){let r=o.createElement("style");r.innerHTML=t.css,i.appendChild(r)}for(let r of t.stylesheets){let s=o.createElement("link");s.rel="stylesheet",s.type="text/css",s.href=r,i.appendChild(s)}for(let r of t.scripts)if(r.src){let s=o.createElement("script");s.type=r.type,s.src=r.src,i.appendChild(s)}else console.error("Script without src",r);c(),o.title=t.title;let l=a("title");return l&&(l.setAttribute("short_title",t.short_title||t.title),l.innerText=t.title),d=t,!0}function L(t){return history.replaceState({data:d,url:location.href,scrollPos:[o.documentElement.scrollLeft||o.body.scrollLeft,o.documentElement.scrollTop||o.body.scrollTop],stateType:"dynLoad"},o.title,location.href),h(t)}async function h(t,e=!1){if(!e&&t===location.href){c();return}i.prepend("Laden... Wenn dies zu lange (über ein paar Sekunden) dauert, lade bitte die Seite neu."),await g(t,"",n=>u(n,!1),n=>{t===location.href?location.reload():location.href=t},"application/vnd.asozial.dynload+json")}async function m(t){if(t.state){let e=t.state;if(t.state.data&&u(e,!0)||await h(e.url||location.href,!0),e.scrollPos){scrollTo(e.scrollPos[0],e.scrollPos[1]);return}}console.error("Couldn't handle state.",t.state),location.reload()}p.dynLoad=m,o.addEventListener("click",t=>{let e=t.target.closest("a");if(t.target,!e||e.target==="_blank")return;let n=(e.href.startsWith("/")?location.origin+e.href:e.href).trim(),l=n.split("?")[0];!n.startsWith(location.origin)||e.hasAttribute("no-dynload")||n.startsWith("#")||n.startsWith("".concat(location.href.split("#")[0],"#"))||(t.preventDefault(),L(n).then(()=>{e.blur()}))});
// @license-end
//# sourceMappingURL=dynload.js.map
