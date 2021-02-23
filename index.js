"use strict";

const SiteChatCalc = require("./SiteChatCalc");

(async () => {
  let calc = new SiteChatCalc("https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json");
  
  let dateStart = new Date("2019-04-01T00:00:00.000Z");
  let dateEnd = new Date("2019-04-14T00:00:00.000Z");
  
  let chatsPerDay = await calc.processStat(dateStart, dateEnd);
  console.log(chatsPerDay);
  console.log(chatsPerDay.msg.arrChatsPerSite);
  
})();
