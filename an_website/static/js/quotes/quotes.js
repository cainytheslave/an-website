// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0-or-later
import{d as g,e as n,get as x,PopStateHandlers as y,post as _,setLastLocation as k}from"/static/js/utils/utils.js?v=b4ed019200cc7b4b";function z(){let o=n("next"),a=n("upvote"),u=n("downvote"),l=n("report"),A=[n("top").getAttribute("quote-id")],T=[o.getAttribute("quote-id")],i=location.search,s=(()=>{let e=new URLSearchParams(i).get("keys");return e!=null&&e.length?e.length===4?e.toUpperCase():(alert("Invalid keys given, using default."),"WASD"):"WASD"})();n("wasd").innerText="".concat(s[0]," (Witzig), ").concat(s[2]," (Nicht Witzig), ")+"".concat(s[1]," (Vorheriges) und ").concat(s[3]," (Nächstes)"),g.onkeydown=e=>{switch(e.code){case"Key".concat(s[0]):a.click();break;case"Key".concat(s[1]):history.back();break;case"Key".concat(s[2]):u.click();break;case"Key".concat(s[3]):o.click()}};let b=n("share"),p=n("download"),d=n("author"),c=n("quote"),h=n("real-author-name"),v=n("rating-text"),$=n("rating-img-container");o.removeAttribute("href");function L(e){b.href="/zitate/share/".concat(e).concat(i),p.href="/zitate/".concat(e,".gif").concat(i);let[t,r]=e.split("-",2);c.href="/zitate/info/z/".concat(t).concat(i),d.href="/zitate/info/a/".concat(r).concat(i),A[0]=e}function E(e){if(e=e.toString(),v.innerText=e,["---","???","0"].includes(e)){$.innerHTML="";return}let t=Number.parseInt(e),r=g.createElement("div");r.className="rating-img"+(t>0?" witzig":" nicht-witzig"),$.innerHTML=(r.outerHTML+" ").repeat(Math.min(4,Math.abs(t))).trim()}function H(e){function t(r,P,f){r.disabled=!1,e===P||e===f?(r.setAttribute("voted",f),r.value="0"):(r.removeAttribute("voted"),r.value=f)}t(a,1,"1"),t(u,-1,"-1")}function m(e){if(e.status)return console.error(e),e.status in[429,420]&&alert(e.reason),!1;if(e.id){if(L(e.id),T[0]=e.next,c.innerText="»".concat(e.quote,"«"),d.innerText="- ".concat(e.author),h.innerText=e.real_author,h.href="/zitate/info/a/".concat(e.real_author_id).concat(i),l!=null&&l.href){let t=new URLSearchParams(i);t.set("subject","Das falsche Zitat ".concat(e.id," hat ein Problem")),t.set("message","".concat(c.innerText," ").concat(h.innerText)),l.href="/kontakt?".concat(t.toString())}return E(e.rating),H(e.vote),!0}return!1}y.quotes=e=>{e.state&&m(e.state)},o.onclick=()=>x("/api/zitate/".concat(T[0]),i,e=>{m(e)&&(e.stateType="quotes",e.url="/zitate/".concat(e.id).concat(i),history.pushState(e,"Falsche Zitate",e.url),k(e.url))});let M=e=>_("/api/zitate/".concat(A[0]),{vote:e},t=>void m(t));for(let e of[a,u])e.type="button",e.onclick=()=>{a.disabled=!0,u.disabled=!0,M(e.value).then(()=>{a.disabled=!1,u.disabled=!1}).catch(()=>{a.disabled=!1,u.disabled=!1})}}for(let o of g.getElementsByClassName("auto-submit-element"))o.onchange=()=>{o.form.submit()};z();
// @license-end
//# sourceMappingURL=quotes.js.map
