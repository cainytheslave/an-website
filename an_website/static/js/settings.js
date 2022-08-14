// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt GNU-AGPL-3.0-or-later
"use strict";function createBumpscositySlider(){const select=elById("bumpscosity-select");if(!select)return;select.classList.add("hidden");const possibleLevels=[];for(let node of select.options)
possibleLevels.push(parseInt(node.value));const startLevel=parseInt(select.value);const currentValueDiv=document.createElement("div");currentValueDiv.setAttribute("tooltip",startLevel);currentValueDiv.style.position="absolute";currentValueDiv.style.transform="translateX(-50%)";const rangeSlider=document.createElement("input");rangeSlider.setAttribute("type","range");rangeSlider.setAttribute("min",0);rangeSlider.setAttribute("value",possibleLevels.indexOf(startLevel));rangeSlider.setAttribute("max",select.options.length-1);rangeSlider.onpointermove=()=>{const value=possibleLevels[rangeSlider.value];select.value=value;currentValueDiv.setAttribute("tooltip",value);currentValueDiv.classList.add("show-tooltip");currentValueDiv.style.left=(1+(98*rangeSlider.value/(select.options.length-1)))+"%";};rangeSlider.onpointerleave=()=>currentValueDiv.classList.remove("show-tooltip");rangeSlider.onchange=(e)=>{let sliderVal=parseInt(rangeSlider.value);let promptStart=`Willst du die Bumpscosity wirklich auf ${possibleLevels[sliderVal]} setzen? `;if(sliderVal===select.options.length-1){if(!confirm(promptStart+"Ein so hoher Wert kann katastrophale Folgen haben."))
sliderVal--;}else if(sliderVal===0){if(!confirm(promptStart+"Fehlende Bumpscosity kann großes Unbehagen verursachen."))
sliderVal++;}else return;if(sliderVal!==parseInt(rangeSlider.value)){rangeSlider.value=sliderVal;select.value=possibleLevels[rangeSlider.value];}};select.parentElement.style.position="relative";select.parentElement.append(currentValueDiv);select.parentElement.append(rangeSlider);}
createBumpscositySlider();
// @license-end
