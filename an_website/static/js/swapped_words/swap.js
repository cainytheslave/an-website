"use strict";// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt GNU-AGPL-3.0-or-later
(()=>{const r=elById("text"),o=elById("config-textarea"),l=elById("output"),t=elById("error-msg");t.innerHTML.trim()&&alert(t.innerHTML.trim());function n(e){console.error(e),e.error?(alert(e.error),t.innerText=`${e.error} In line ${e.line_num}: "${e.line}"`):(alert(e),t.innerText=JSON.stringify(e))}function i(e,s=!1){if(!e){console.log("data is falsy!");return}if(e.error)return n(e);s||(e.stateType="swappedWords",window.history.pushState(e,"Vertauschte Wörter",window.location.href)),r.value=e.text||"",o.value=e.config||"",l.innerText=e.replaced_text||"",t.innerText=""}elById("form").onsubmit=e=>{e.preventDefault()},elById("reset").onclick=()=>post("/api/vertauschte-woerter",{text:r.value,minify_config:!1,return_config:!0},i,n),elById("submit").onclick=()=>post("/api/vertauschte-woerter",{text:r.value||"",config:o.value||"",minify_config:!1,return_config:!0},i,n),PopStateHandlers.swappedWords=e=>e.state&&i(e.state,!0)})();// @license-end
//# sourceMappingURL=swap.js.map
