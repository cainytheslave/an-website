// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
(()=>{const quoteInput=document.getElementById("quote-input");const quoteList=document.getElementById("quote-list");const realAuthorInput=document.getElementById("real-author-input");const realAuthors={};for(let child of quoteList.children){realAuthors[child.value.toLowerCase()]=child.attributes.getNamedItem("data-author").value;}
quoteInput.oninput=()=>{const author=realAuthors[quoteInput.value.toLowerCase()];realAuthorInput.disabled=!!author;if(author)realAuthorInput.value=author;}})();
// @license-end
