String.prototype.hashCode = function() {
  for(var ret = 0, i = 0, len = this.length; i < len; i++) {
    ret = (31 * ret + this.charCodeAt(i)) << 0;
  }
  return ret;
};

module.exports = {

  urls: {
    CFB: "https://www.sportsbook.ag/sbk/sportsbook4/ncaa-football-betting/game-lines.sbk",
    NFL: "https://www.sportsbook.ag/sbk/sportsbook4/nfl-betting/game-lines.sbk",
    NBA: "https://www.sportsbook.ag/sbk/sportsbook4/nba-betting/game-lines.sbk"
  },

  createBettable: function (bet_is_off, over_under_bet_is_off, gameKey, gameTime, team1, team2, sideId1, sideId2, spread1, spread2, over_under, sportKey) {
    var bettable = {};
    bettable.off = bet_is_off;
    bettable.ouoff = over_under_bet_is_off;
    bettable.gameKey = gameKey;
    bettable.gameTime = gameTime;
    bettable.team1 = team1;
    bettable.team2 = team2;
    bettable.sideId1 = sideId1;
    bettable.sideId2 = sideId2;
    bettable.team1Spread = spread1;
    bettable.team2Spread = spread2;
    bettable.overunder = over_under;
    bettable.sport = sportKey;
    return bettable;
  },

  bettableIsValid: function (bettable) {
    return parseFloat(bettable.team1Spread) + parseFloat(bettable.team2Spread) == 0;
  },

  removeMoneyLine: function (spreadWithMoneyLine) {
    return spreadWithMoneyLine.slice(0, spreadWithMoneyLine.indexOf("("));
  },

  getTeamIdFromId: function (selectionId) {
    return selectionId.slice(selectionId.indexOf("[")+1,selectionId.indexOf("]"));
  },

  removeMoneyLineFromOverUnder: function (overUnderWithMoneyLine) {
    return overUnderWithMoneyLine.slice(2, overUnderWithMoneyLine.indexOf("("));
  },

  createBettable: function (bet_is_off, over_under_bet_is_off, gameKey, gameTime, team1, team2, sideId1, sideId2, spread1, spread2, over_under, sportKey) {
    var bettable = {};
    bettable.off = bet_is_off;
    bettable.ouoff = over_under_bet_is_off;
    bettable.gameKey = gameKey;
    bettable.gameTime = gameTime;
    bettable.team1 = team1;
    bettable.team2 = team2;
    bettable.sideId1 = sideId1;
    bettable.sideId2 = sideId2;
    bettable.team1Spread = spread1;
    bettable.team2Spread = spread2;
    bettable.overunder = over_under;
    bettable.sport = sportKey;
    return bettable;
  },

  getBettables: function (sportKey, callback) {
    var bettables = [];
    var url = SportsBookGateway.urls[sportKey];
    if (url == null || url == "") {
      callback("SportsBookGateway has no URL for " + sportKey);
      return;
    }
    var request = require('request');
    var cheerio = require('cheerio');

    request(url, function (error, response, html) {
      if (!error) {
        if (html.indexOf("463 Restricted Client") != -1) {
          console.log("463 Restricted Client. Skipping update...");
          callback("Client has been restricted");
          return;
        }
        var $ = cheerio.load(html);

        $('.eventbox').each(function(index, element) {
          var data = $(element);
          var team1 = data.find("#firstTeamName").contents().text().trim();
          var team2 = data.find("#secondTeamName").contents().text().trim();
          var date = data.prevAll(".date").first().contents().text().trim();
          var dateHour = data.find(".daterow .hour").contents().last().text().trim();
          var gameTime = date + " " + dateHour;
          var spread1 = SportsBookGateway.removeMoneyLine(data.find(".spread").first().text().trim());
          var spread2 = SportsBookGateway.removeMoneyLine(data.find(".spread").last().text().trim());
          var sideId1 = SportsBookGateway.getTeamIdFromId(data.find(".spread a").first().attr().id).hashCode();
          var sideId2 = SportsBookGateway.getTeamIdFromId(data.find(".spread a").last().attr().id).hashCode();
          var over_under = SportsBookGateway.removeMoneyLineFromOverUnder(data.find(".money a").last().text().trim());
          var bet_is_off = isNaN(spread1) || isNaN(spread2);
          var over_under_bet_is_off = isNaN(over_under);
          var gameKey = data.attr().id;
          var bettable = SportsBookGateway.createBettable(bet_is_off, over_under_bet_is_off, gameKey, gameTime, team1, team2, sideId1, sideId2, spread1, spread2, over_under, sportKey, bettables);

          bettables.push(bettable);
        });

        callback(null, bettables);
      }
    });
  }
}


