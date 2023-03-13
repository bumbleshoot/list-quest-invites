/**
 * List Quest Invites v0.2.5 (beta) by @bumbleshoot
 *
 * See GitHub page for info & setup instructions:
 * https://github.com/bumbleshoot/list-quest-invites
 */

const USER_ID = "";
const API_TOKEN = "";

const LABEL_NAME = ""; // required
const START_DATE = ""; // yyyy-mm-dd, leave blank for no start date
const END_DATE = ""; // yyyy-mm-dd, leave blank for no end date
const QUEST_INVITES_SPREADSHEET_URL = "";
const QUEST_INVITES_SPREADSHEET_TAB_NAME = "Sheet1";

/*************************************\
 *  DO NOT EDIT ANYTHING BELOW HERE  *
\*************************************/

const PARAMS = {
  "headers": {
    "x-api-user": USER_ID, 
    "x-api-key": API_TOKEN,
    "x-client": "35c3fb6f-fb98-4bc3-b57a-ac01137d0847-ListQuestInvites"
  },
  "muteHttpExceptions": true
};
const GET_PARAMS = Object.assign({ "method": "get" }, PARAMS);

const scriptProperties = PropertiesService.getScriptProperties();

function listQuestInvites() {

  let startDate = 0;
  if (typeof START_DATE == "string" && START_DATE !== "") {
    startDate = new Date(START_DATE).getTime();
  }

  let endDate = new Date().getTime();
  if (typeof END_DATE == "string" && END_DATE !== "") {
    endDate = new Date(END_DATE).getTime() + 86400000;
  }

  // open spreadsheet & sheet
  try {
    var spreadsheet = SpreadsheetApp.openById(QUEST_INVITES_SPREADSHEET_URL.match(/[^\/]{44}/)[0]);
    var sheet = spreadsheet.getSheetByName(QUEST_INVITES_SPREADSHEET_TAB_NAME);

    // if sheet doesn't exist, print error & exit
    if (sheet === null) {
      console.log("ERROR: QUEST_INVITES_SPREADSHEET_TAB_NAME \"" + QUEST_INVITES_SPREADSHEET_TAB_NAME + "\" doesn't exit.");
      return;
    }

  // if spreadsheet doesn't exist, print error & exit
  } catch (e) {
    if (e.stack.includes("Unexpected error while getting the method or property openById on object SpreadsheetApp")) {
      console.log("ERROR: QUEST_INVITES_SPREADSHEET_URL not found: " + QUEST_INVITES_SPREADSHEET_URL);
      return;
    } else {
      throw e;
    }
  }

  // clear sheet
  sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), Math.max(sheet.getLastColumn(), 1)).clearContent();

  // print headings
  let headings = ["#", "Quest", "Date", "Username", "Type", "Subject"];
  sheet.getRange(1, 1, 1, headings.length).setValues([headings]).setWrap(true).setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold");
  sheet.setFrozenRows(1);

  // get quest data
  let quests = getQuestData();

  console.log("Getting emails & printing to spreadsheet");

  // get first batch of email threads
  let label = GmailApp.getUserLabelByName(LABEL_NAME);
  let marker = 0;
  let batch = label.getThreads(marker, 250);
  let rowCounter = 2;
  while (batch.length > 0) {

    // for each thread in batch
    for (let thread of batch) {

      // for each message in thread
      for (let message of thread.getMessages()) {

        // if message received after START_DATE & before END_DATE & is quest invite
        if (message.getDate().getTime() >= startDate && message.getDate().getTime() < endDate && (message.getSubject().match(/Help [^ ]+ battle the Boss of ".+" \(and Bad Habits\)!/) !== null || message.getSubject().match(/Help [^ ]+ Complete the .+ Quest!/) !== null)) {

          // get quest name
          let questName = message.getSubject().match(/"(.+)"/);
          if (questName === null) {
            questName = message.getSubject().match(/Complete the (.+) Quest!/);
          }
          if (questName === null) {
            throw new Error("Invalid email subject: " + message.getSubject());
          }
          questName = questName[1];
          questName = questName.replace("Nudibranches", "Nudibranchs");

          // get date
          let month = message.getDate().getMonth() + 1;
          if (month < 10) {
            month = "0" + month;
          }
          let date = message.getDate().getDate();
          if (date < 10) {
            date = "0" + date;
          }
          let timestamp = message.getDate().getFullYear() + "/" + month + "/" + date + " " + message.getDate().getHours() + ":" + message.getDate().getMinutes() + ":" + message.getDate().getSeconds();

          // get username
          let username = message.getSubject().match(/Help ([^\s]+)/)[1];

          // print to spreadsheet
          sheet.getRange(rowCounter, 1, 1, headings.length).setValues([[rowCounter-1, questName, timestamp, username, quests[questName].type, message.getSubject()]]);
          rowCounter++;
        }

      }
    }

    // get next batch of email threads
    marker += 250;
    batch = label.getThreads(marker, 250);
  }

  // formatting
  sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()-1).setWrap(true).setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.getRange(2, sheet.getLastColumn(), sheet.getLastRow(), 1).setWrap(true).setHorizontalAlignment("left").setVerticalAlignment("middle");

  console.log("Success!");
}

/**
 * getQuestData()
 * 
 * Gathers relevant quest data from Habitica's API, arranges it
 * in a JavaScript Object, and returns the object.
 */
function getQuestData() {

  console.log("Getting quest data");

  // get lists of premium eggs, premium hatching potions & wacky hatching potions
  let premiumEggs = [];
  for (let egg of Object.values(getContent().questEggs)) {
    premiumEggs.push(egg.key);
  }
  let premiumHatchingPotions = [];
  for (let potion of Object.values(content.premiumHatchingPotions)) {
    premiumHatchingPotions.push(potion.key);
  }
  let wackyHatchingPotions = [];
  for (let potion of Object.values(content.wackyHatchingPotions)) {
    wackyHatchingPotions.push(potion.key);
  }

  // create quest lists
  let eggQuests = {};
  let otherQuests = {};

  // for each quest
  for (let quest of Object.values(content.quests)) {

    // if world boss, skip it
    if (quest.category == "world") {
      continue;
    }

    // get rewards
    let rewards = [];
    if (typeof quest.drop.items !== "undefined") {

      for (let drop of quest.drop.items) {

        let rewardName = drop.text;
        let rewardType = "";

        if (drop.type == "eggs" && premiumEggs.includes(drop.key)) {
          rewardName = content.eggs[drop.key].text + " Egg";
          rewardType = "egg";
        } else if (drop.type == "hatchingPotions" && premiumHatchingPotions.includes(drop.key)) {
          rewardType = "hatchingPotion";
        } else if (drop.type == "hatchingPotions" && wackyHatchingPotions.includes(drop.key)) {
          rewardType = "wackyPotion";
        } else if (drop.type == "mounts") {
          rewardType = "mount";
        } else if (drop.type == "pets") {
          rewardType = "pet";
        } else if (drop.type == "gear") {
          rewardType = "gear";
        }

        if (rewardType != "") {
          let index = rewards.findIndex(reward => reward.name == rewardName);
          if (index == -1) {
            rewards.push({
              key: drop.key,
              name: rewardName,
              type: rewardType,
              qty: 1
            });
          } else {
            rewards[index].qty++;
          }
        }
      }
    }

    // create quest object
    let questInfo = {
      rewards
    };

    // add quest to corresponding quest list
    let rewardType = rewards.length > 0 ? rewards[0].type : null;
    if (quest.group == "questGroupDilatoryDistress" || quest.group == "questGroupTaskwoodsTerror" || quest.group == "questGroupStoikalmCalamity" || quest.group == "questGroupMayhemMistiflying" || quest.group == "questGroupLostMasterclasser") {
      questInfo.type = "Masterclasser";
      otherQuests[quest.text] = questInfo;
    } else if (quest.text == "The Basi-List" || quest.text == "The Feral Dust Bunnies") {
      questInfo.type = "Achievement";
      otherQuests[quest.text] = questInfo;
    } else if (quest.category == "unlockable") {
      questInfo.type = "Unlockable";
      otherQuests[quest.text] = questInfo;
    } else if (rewardType == "egg") {
      questInfo.type = "Egg";
      eggQuests[quest.text] = questInfo;
    } else if (["hatchingPotion", "wackyPotion"].includes(rewardType)) {
      questInfo.type = "Hatching Potion";
      otherQuests[quest.text] = questInfo;
    } else if (rewardType == "pet" || rewardType == "mount") {
      questInfo.type = "Pet";
      otherQuests[quest.text] = questInfo;
    }
  }

  // return quest lists
  return Object.assign(eggQuests, otherQuests);
}

/**
 * fetch(url, params)
 * 
 * Wrapper for Google Apps Script's UrlFetchApp.fetch(url, params):
 * https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params
 * 
 * Retries failed API calls up to 2 times, retries for up to 1 min if 
 * Habitica's servers are down, & handles Habitica's rate limiting.
 */
let rateLimitRemaining;
let rateLimitReset;
function fetch(url, params) {

  // try up to 3 times
  for (let i=0; i<3; i++) {

    // if rate limit reached
    if (rateLimitRemaining != null && Number(rateLimitRemaining) < 1) {

      // wait until rate limit reset
      let waitUntil = new Date(rateLimitReset);
      waitUntil.setSeconds(waitUntil.getSeconds() + 1);
      let now = new Date();
      Utilities.sleep(Math.max(waitUntil.getTime() - now.getTime(), 0));
    }

    // call API
    let response;
    while (true) {
      try {
        response = UrlFetchApp.fetch(url, params);
        break;

      // if address unavailable, wait 5 seconds & try again
      } catch (e) {
        if (e.stack.includes("Address unavailable")) {
          Utilities.sleep(5000);
        } else {
          throw e;
        }
      }
    }

    // store rate limiting data
    rateLimitRemaining = response.getHeaders()["x-ratelimit-remaining"];
    rateLimitReset = response.getHeaders()["x-ratelimit-reset"];

    // if success, return response
    if (response.getResponseCode() < 300 || (response.getResponseCode() === 404 && (url === "https://habitica.com/api/v3/groups/party" || url.startsWith("https://habitica.com/api/v3/groups/party/members")))) {
      return response;

    // if rate limited due to running multiple scripts, try again
    } else if (response.getResponseCode() === 429) {
      i--;

    // if 3xx or 4xx or failed 3 times, throw exception
    } else if (response.getResponseCode() < 500 || i >= 2) {
      throw new Error("Request failed for https://habitica.com returned code " + response.getResponseCode() + ". Truncated server response: " + response.getContentText());
    }
  }
}

/**
 * getContent()
 * 
 * Fetches content data from the Habitica API if it hasn't already 
 * been fetched during this execution.
 */
let content;
function getContent() {
  if (typeof content === "undefined") {
    for (let i=0; i<3; i++) {
      content = fetch("https://habitica.com/api/v3/content", GET_PARAMS);
      try {
        content = JSON.parse(content).data;
        break;
      } catch (e) {
        if (i < 2 && e.stack.includes("Unterminated string in JSON")) {
          continue;
        } else {
          throw e;
        }
      }
    }
  }
  return content;
}