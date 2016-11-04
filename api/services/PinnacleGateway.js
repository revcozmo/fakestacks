module.exports = {

  urls: {
    CFB: "http://xml.pinnaclesports.com/?sporttype=Football&sportsubtype=ncaa",
    NFL: "http://xml.pinnaclesports.com/?sporttype=Football&sportsubtype=nfl",
    NBA: "http://xml.pinnaclesports.com/?sportType=Basketball&sportSubType=nba"
  },

  createBettable: function (bet_is_off, over_under_bet_is_off, gameKey, gameTime, team1, team2, sideId1, sideId2, spread1, spread2, over_under, sportKey){
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

  getBettables: function(sportKey, callback) {
    var bettables = [];
    var url = PinnacleGateway.urls[sportKey];
    if (url == null || url == "") {
      callback("PinnacleGateway has no URL for " + sportKey);
      return;
    }
    var request = require('request');
    var cheerio = require('cheerio');

    request(url, function (error, response, xml) {
      if (!error) {
        if (xml.indexOf("463 Restricted Client") > -1) {
          console.log("463 Restricted Client. Skipping update...");
          callback("PinnacleGateway has been restricted. Use another source.");
          return;
        }
        var parseString = require('xml2js').parseString;
        parseString(xml, function (err, result) {
          var games = result.pinnacle_line_feed.events[0].event;
          var gamesCount = games.length;

          function prefixSpread(spread) {
            if (spread && spread != "" && spread.charAt(0) <= '9' && spread.charAt(0) >= '0') {
              return "+" + spread;
            }
            return spread;
          }

          for (var i = 0; i < gamesCount; i++) {
            var game = games[i];
            var gameKey = game.gamenumber[0];
            var sideId1 = game.participants[0].participant[0].contestantnum[0];
            var sideId2 = game.participants[0].participant[1].contestantnum[0];
            var gameTime = game.event_datetimeGMT[0] + " GMT";
            //var daylightSavingsEndsDate = "2016-11-06";
            // var isBeforeDaylightSavingsEnd = Date.parse(gameTime) < Date.parse(daylightSavingsEndsDate);
            // gameTime += (isBeforeDaylightSavingsEnd ? " GMT-0400" : " GMT-0500");
            var team1 = game.participants[0].participant[0].participant_name[0];
            var team2 = game.participants[0].participant[1].participant_name[0];
            if (game.participants[0].participant[0].visiting_home_draw[0] == "Home") {
              callback("Bad assumption about home teams. Exiting...");
            }
            var spread1 = game.periods[0].period && game.periods[0].period[0].spread ? game.periods[0].period[0].spread[0].spread_visiting[0] : "";
            var spread2 = game.periods[0].period && game.periods[0].period[0].spread ? game.periods[0].period[0].spread[0].spread_home[0] : "";
            spread1 = prefixSpread(spread1);
            spread2 = prefixSpread(spread2);
            var over_under = game.periods[0].period && game.periods[0].period[0].total ? game.periods[0].period[0].total[0].total_points[0] : "";
            var bet_is_off = (spread1 == "" || spread2 == "") ? true : false;
            var over_under_bet_is_off = (over_under == "") ? true : false;
            var bettable = PinnacleGateway.createBettable(bet_is_off, over_under_bet_is_off, gameKey, gameTime, team1, team2, sideId1, sideId2, spread1, spread2, over_under, sportKey);
            if (PinnacleGateway.bettableIsValid(bettable)) {
              bettables.push(bettable);
            }
          }

          callback(null, bettables);
        });
      }
    });
  }
}

