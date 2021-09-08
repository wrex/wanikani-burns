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
      box-sizing: border-box;
      margin: 0 0 30px;
      padding: 12px;
      text-align: right;
    }
    .bp-bar {
      height: 36px;
      position: relative;
      background: #e0e0e0;
      border-radius: 25px;
      box-shadow: inset 0px 2px 0 0 rgb(0 0 0 / 10%);
      /* padding: 10px; */
      vertical-align: middle;
    }
    .bp-bar > span {
      display: block;
      float: left;
      line-height: 36px;
      color: white;
      height: 100%;
      position: relative;
      overflow: hidden;
      text-align: center;
    }
    span.bp-bar-burns {
      width: ${burnedPercent}%;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-top-left-radius: 25px;
      border-bottom-left-radius: 25px;
      background-color: hsla(41,96%,56%,1);
    }
    span.bp-bar-seen {
      width: ${inProgressPercent}%;
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      background-color: hsla(41,90%,70%,1);
    }
  `;

  // Append our CSS
  const bpStyle = document.createElement("style");
  bpStyle.id = "burnProgress";
  bpStyle.innerHTML = progressBarCSS;
  document.querySelector("head").append(bpStyle);

  const progressBarHTML = `
  <div class="bp-bar" value="${totalItems}">
    <span class="bp-bar-burns" value="${burnedItems}">${burnedPercent}% burned</span>
    <span class="bp-bar-seen" value="${seenItems}">${seenPercent}% seen</span>
  </div>
  <p>${totalItems} total items: ${seenItems} seen (${burnedItems} burned)</p>
  `;

  //   Create a DIV to hold the progressbar
  const burnsBar = document.createElement("div");
  burnsBar.classList.add("burn-progress-container");
  burnsBar.innerHTML = progressBarHTML;

  // Now add our new div at the top of the page before the progress and forecast section
  document.querySelector(".progress-and-forecast").before(burnsBar);
})();
