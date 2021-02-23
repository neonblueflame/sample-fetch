"use strict";

const fetch = require("node-fetch");

/**
 * Class used to calculate chat info per site
 */
class SiteChatCalc {
  
  /**
   * Constructor for SiteChatCalc
   *
   * @param String url
   */
  constructor(url) {
    this.url = url;
  }
  
  /**
   * Function for calculating chat info per site based on the 
   * inclusive dates provided
   *
   * @param Date dateStart
   * @param Date dateEnd
   * 
   * @return Object objResult
   */
  async processStat(dateStart, dateEnd) {
    
    let objResult = {
      status: "",
      msg: ""
    };
    
    try {      
      if (dateStart === undefined || dateEnd === undefined) {
        throw new Error("Dates should be specified");
      }
      
      if (dateEnd < dateStart) {
        throw new Error("Start date can't be greater than end date");
      }
      
      let res = await fetch(this.url);
      let arrChatInfo = JSON.parse(await res.text());
      
      let objChatInfoResult = {
        dateStart,
        dateEnd,
        arrChatsPerSite: [
          {
            websiteId: "",
            totalChats: 0,
            totalMissedChats: 0
          }
        ]
      };
      
      let {
        arrChatInfoParsed, 
        arrWebsiteIDs
      } = this.parseChatInfo(arrChatInfo, dateStart, dateEnd);
      
      objChatInfoResult.arrChatsPerSite 
        = this.computeChatStat(arrWebsiteIDs, arrChatInfoParsed);
      
      objResult.status = `${res.status} - ${res.statusText}`;
      objResult.msg = objChatInfoResult;
      
    } catch(e) {
      objResult.status = "error";
      objResult.msg = e.message;
      objResult.stackTrace = e;
    }
    
    return objResult;
  }
  
  /**
   * Function for parsing chat information based on the 
   * inclusive dates provided
   *
   * @param Array arrChatInfo
   * @param Date dateStart
   * @param Date dateEnd
   * 
   * @return Object {arrWebsiteIDs, arrChatInfoParsed}
   */
  parseChatInfo(arrChatInfo, dateStart, dateEnd) {
    let arrChatInfoParsed = [];
    let arrWebsiteIDs = [];
    
    for (let chatInfo of arrChatInfo) {
      chatInfo.date = new Date(chatInfo.date);
      
      if (!arrWebsiteIDs.includes(chatInfo.websiteId)) {
        arrWebsiteIDs.push(chatInfo.websiteId);
      }
      
      if (chatInfo.date >= dateStart && chatInfo.date <= dateEnd) {
        arrChatInfoParsed.push(chatInfo);
      }
    }
    
    return {
      arrChatInfoParsed,
      arrWebsiteIDs
    }
  }
  
  /**
   * Function for computing chat totals per website
   *
   * @param Array arrWebsiteIDs
   * @param Array arrChatInfo
   * 
   * @return Array arrChatsPerSite
   */
  computeChatStat(arrWebsiteIDs, arrChatInfo) {
    let arrChatsPerSite = [];
    
    for (let websiteId of arrWebsiteIDs) {
      let chatsPerSite = {
        websiteId: websiteId,
        totalChats: 0,
        totalMissedChats: 0
      };
      
      for (let chatInfo of arrChatInfo) {
        if (chatInfo.websiteId === websiteId) {
          chatsPerSite.totalChats += chatInfo.chats;
          chatsPerSite.totalMissedChats += chatInfo.missedChats;
        }
      }
      
      arrChatsPerSite.push(chatsPerSite);
    }
    
    return arrChatsPerSite;
  }
 
}

module.exports = SiteChatCalc;
