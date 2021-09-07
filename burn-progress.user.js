// ==UserScript==
// @name         Burn Progress
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display progress toward burning all items
// @author       Rex Walters (Rrwrex)
// @include      /^https:\/\/(www|preview).wanikani.com\/(dashboard)?$/
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let totalItems = 8995;
  let burnedItems = 3238;
  let inProgressItems = 2340;
  let seenItems = burnedItems + inProgressItems;

  let burnedPercent = ((burnedItems / totalItems) * 100).toFixed(0);
  let inProgressPercent = ((inProgressItems / totalItems) * 100).toFixed(0);
  let seenPercent = ((seenItems / totalItems) * 100).toFixed(0);

  const progressBarCSS = `
    .burn-progress-container {
      width: 80rem;
    }
    .bp-bar {
      height: 20px;
      position: relative;
      background: #e0e0e0;
      border-radius: 25px;
      padding: 10px;
      box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
    }
    .bp-bar > span {
      display: block;
      height: 100%;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      background-color: rgb(43, 194, 83);
      background-image: linear-gradient(
        center bottom,
        rgb(43, 194, 83) 37%,
        rgb(84, 240, 84) 69%
      );
      box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
        inset 0 -2px 6px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;
      width: ${burnedPercent}%;
    }
  `;

  // Append our CSS
  const bpStyle = document.createElement("style");
  bpStyle.id = "burnProgress";
  bpStyle.innerHTML = progressBarCSS;
  document.querySelector("head").append(bpStyle);

  const progressBarHTML = `
  <div class="bp-bar" value="${totalItems}">
    <span class="bp-bar-burns" value="${burnedItems}"></span>
    <!-- <span class="bp-bar-seen" value="${seenItems}"> 
      ${((seenItems / totalItems) * 100).toFixed(1)}%
    </span> -->
  </div>
  <p>${seenItems} of ${totalItems} items seen (${burnedItems} burned)</p>
  `;

  //   Create a DIV to hold the progressbar
  const burnsBar = document.createElement("div");
  burnsBar.classList.add("burn-progress-container");
  burnsBar.innerHTML = progressBarHTML;

  // Update the width of the burns
  burnsBar.querySelector(".bp-bar-burns").style.width = `${burnedPercent}`;

  // Now add our new div at the top of the page before the progress and forecast section
  document.querySelector(".progress-and-forecast").before(burnsBar);
})();
