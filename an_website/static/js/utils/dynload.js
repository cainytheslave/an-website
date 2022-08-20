"use strict";// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt GNU-AGPL-3.0-or-later
const bodyDiv=elById("body"),lastLoaded=[];function dynLoadOnData(t,o){if(!t){error("No data received");return}if(t.redirect){w.location.href=t.redirect;return}const e=t.url;if(!e){error("No URL in data ",t);return}if(log("Handling data",t),!o){if(lastLoaded.length===1&&lastLoaded[0]===e){log("URL is the same as last loaded, ignoring");return}history.pushState({data:t,url:e,stateType:"dynLoad"},t.title,e),w.lastLocation=e}if(!t.body){w.location.reload();return}if(d.onkeydown=()=>{},bodyDiv.innerHTML=t.body,t.css){const r=d.createElement("style");r.innerHTML=t.css,bodyDiv.appendChild(r)}if(t.stylesheets)for(const r of t.stylesheets){const i=d.createElement("link");i.rel="stylesheet",i.type="text/css",i.href=r,bodyDiv.appendChild(i)}if(t.scripts)for(const r of t.scripts)if(r.src){const i=d.createElement("script");i.src=r.src,bodyDiv.appendChild(i)}else error("Script without src",r);w.hideSitePane&&hideSitePane(),d.title=t.title;const n=elById("title");return n.setAttribute("short_title",t.short_title||t.title),n.innerText=t.title,dynLoadReplaceAnchors(),w.urlData=t,!0}function dynLoadReplaceAnchors(){for(const t of d.getElementsByTagName("A"))dynLoadReplaceHrefOnAnchor(t)}function dynLoadReplaceHrefOnAnchor(t){t.hasAttribute("no-dynload")||dynLoadFixHref(t)}function dynLoadFixHref(t){if(t.target==="_blank")return;const o=(t.href.startsWith("/")?w.location.origin+t.href:t.href).trim(),e=o.split("?")[0];!o.startsWith(w.location.origin)||e.split("/").pop().includes(".")&&e!==w.location.origin+"/redirect"||e===w.location.origin+"/chat"||o.startsWith("#")||o.startsWith(w.location.href.split("#")[0]+"#")||(t.onclick=n=>{dynLoad(o),n.preventDefault()})}function dynLoad(t){log("Loading URL",t),history.replaceState({data:w.urlData,url:w.location.href,scrollPos:[d.documentElement.scrollLeft||d.body.scrollLeft,d.documentElement.scrollTop||d.body.scrollTop],stateType:"dynLoad"},d.title,w.location.href),dynLoadSwitchToURL(t)}function dynLoadSwitchToURL(t,o=!1){if(!o&&t===w.location.href){log("URL is the same as current, just hide site pane"),w.hideSitePane&&hideSitePane();return}bodyDiv.prepend("Laden... Wenn dies zu lange (über ein paar Sekunden) dauert, lade bitte die Seite neu."),get(t,"",e=>dynLoadOnData(e,!1),e=>{log(e),t===w.location.href?w.location.reload():w.location.href=t})}function dynLoadOnPopState(t){if(t.state&&(log("Popstate",t.state),t.state.data&&dynLoadOnData(t.state,!0)||dynLoadSwitchToURL(t.state.url||w.location.href,!0),t.state.scrollPos)){w.scrollTo(t.state.scrollPos[0],t.state.scrollPos[1]);return}error("Couldn't handle state. ",t.state),w.location.reload()}w.PopStateHandlers.dynLoad=dynLoadOnPopState,dynLoadReplaceAnchors();// @license-end
//# sourceMappingURL=dynload.js.map
