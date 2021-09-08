// ==UserScript==
// @name         Burn Progress
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wanikani dashboard extension to display progress toward burning all items
// @author       Rex Walters (Rrwrex)
// @include      /^https:\/\/(www|preview).wanikani.com\/(dashboard)?$/
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // First ensure the Wanikani Open Framework is installed
  if (!window.wkof) {
    let response = confirm(
      'The WaniKani Burn Progress script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.'
    );

    if (response) {
      window.location.href =
        "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
    }

    return;
  }

  // Configuration options for WKOF
  const config = {
    wk_items: {
      options: {
        assignments: true,
      },
    },
  };

  // Master flow: Collect the data and then process
  wkof.include("ItemData");
  wkof.ready("ItemData").then(getItems).then(determineRatio).then(createBar);

  // Retrieve the items from WKOF
  function getItems() {
    return wkof.ItemData.get_items(config);
  }

  // Retrieve the SRS stages per assignment
  function getSrsStage(assignments) {
    return assignments.srs_stage;
  }

  // Calculate the total counts at each stage
  function determineRatio(items) {
    let itemsBySrs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((result, srs) => {
      result[srs] = {
        total: 0,
      };

      return result;
    }, {});

    items.forEach(function (item) {
      let srsStage = item.assignments ? getSrsStage(item.assignments) : 0;
      itemsBySrs[srsStage].total++;
    });

    return itemsBySrs;
  }

  // Finally, generate the html
  function createBar(itemsBySrs) {
    let totalItems =
      itemsBySrs[0].total +
      itemsBySrs[1].total +
      itemsBySrs[2].total +
      itemsBySrs[3].total +
      itemsBySrs[4].total +
      itemsBySrs[5].total +
      itemsBySrs[6].total +
      itemsBySrs[7].total +
      itemsBySrs[8].total +
      itemsBySrs[9].total;

    let burnedItems = itemsBySrs[9].total;

    let inProgressItems =
      itemsBySrs[1].total +
      itemsBySrs[2].total +
      itemsBySrs[3].total +
      itemsBySrs[4].total +
      itemsBySrs[5].total +
      itemsBySrs[6].total +
      itemsBySrs[7].total +
      itemsBySrs[8].total;

    let seenItems = burnedItems + inProgressItems;

    let burnedPercent = ((burnedItems / totalItems) * 100).toFixed(0);
    let inProgressPercent = ((inProgressItems / totalItems) * 100).toFixed(0);
    let seenPercent = ((seenItems / totalItems) * 100).toFixed(0);

    const progressBarCSS = `
      .burn-progress-container {
        box-sizing: border-box;
        margin: 0;
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
        ${
          burnedItems == seenItems
            ? "border-top-right-radius: 25px; border-bottom-right-radius: 25px;"
            : "border-top-right-radius: 0px; border-bottom-right-radius: 0px;"
        }
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
        background-color: hsla(41,96%,56%,1);
      }
      span.bp-bar-seen {
        width: ${inProgressPercent}%;
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;
        ${
          burnedItems > 0
            ? "border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
            : "border-top-left-radius: 25px; border-bottom-left-radius: 25px;"
        }
        background-color: hsla(41,90%,70%,1);
      }
    `;

    // Append our CSS
    const bpStyle = document.createElement("style");
    bpStyle.id = "burnProgress";
    bpStyle.innerHTML = progressBarCSS;
    document.querySelector("head").append(bpStyle);

    //  Free users only have access to a subset of items, so the totalItems count
    //  will be much smaller for users without a subscription.
    //
    //  So display, e.g., "349 total free items" for free users
    //  and "8995 total items" for paid users (or whatever the current numbers are)
    let totalText = "";
    options["Subscription Status"] === "free"
      ? (totalText = `${totalItems} total free items`)
      : (totalText = `${totalItems} total items`);

    // Only show the burned item count if there are any
    let seenText = "";
    burnedItems > 0
      ? (seenText = `${seenItems} seen (${burnedItems} burned)`)
      : (seenText = `${seenItems} seen`);

    const progressBarHTML = `
    <div class="bp-bar" value="${totalItems}">
      <span class="bp-bar-burns" value="${burnedItems}">${burnedPercent}% burned</span>
      <span class="bp-bar-seen" value="${seenItems}">${seenPercent}% seen</span>
    </div>
    <p>${totalText}: ${seenText}</p>
    `;

    //   Create a DIV to hold the progressbar
    const burnsBar = document.createElement("div");
    burnsBar.classList.add("burn-progress-container");
    burnsBar.innerHTML = progressBarHTML;

    // Now add our new div at the top of the page before the progress and forecast section
    document.querySelector(".progress-and-forecast").before(burnsBar);
  }
})();
