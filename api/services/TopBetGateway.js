module.exports = {

  urls: {
    CFB: "http://topbet.eu/tbadmin43/sportsbook/show/football/ncaa",
    NFL: "http://topbet.eu/tbadmin43/sportsbook/show/football/nfl",
    NBA: "http://topbet.eu/tbadmin43/sportsbook/show/basketball/nba"
  },

  getBettables: function(sportKey, callback) {
    var bettables = [];
    var url = TopBetGateway.urls[sportKey];
    var request = require('request');
    var cheerio = require('cheerio');

    request(url, function (error, response, html) {
      if (!error) {
        if (html.indexOf("463 Restricted Client")) {
          console.log("463 Restricted Client. Skipping update...");
          callback("Client has been restricted");
          return;
        }
        var $ = cheerio.load(eval(html)[0].content);

        $('#events').filter(function () {

          var data = $(this);

          var games = data.find(".event");
          var gamesCount = games.length;

          for (var i = 0; i < gamesCount; i++) {
            var gameKey = games.eq(i).attr("id");
            var sideId1 = games.eq(i).find(".row0 .rotation_number").contents().last().text().trim();
            var sideId2 = games.eq(i).find(".row1 .rotation_number").contents().last().text().trim();
            var gameTime = games.eq(i).find("h3 span").text();
            gameTime = gameTime.replace(/\n/g, " ");
            var daylightSavingsEndsDate = "2016-11-06";
            var isBeforeDaylightSavingsEnd = Date.parse(gameTime) < Date.parse(daylightSavingsEndsDate);
            gameTime += (isBeforeDaylightSavingsEnd ? " GMT-0400" : " GMT-0500");
            var team1 = games.eq(i).find(".row0 .name").text().trim();
            var team2 = games.eq(i).find(".row1 .name").text().trim();
            var spread1 = games.eq(i).find(".row0 .spread").text();
            var spread2 = games.eq(i).find(".row1 .spread").text();
            var over_under = games.eq(i).find(".row0 .over_under").eq(1).text();
            var over_under_bet = games.eq(i).find(".row0 .over_under_bet").eq(0).text();
            var spread_bet1 = games.eq(i).find(".row0 .spread_bet").text();
            var bet_is_off = (spread_bet1.indexOf("Off") > -1) || (spread_bet1.indexOf("Off") > -1);
            var over_under_bet_is_off = over_under_bet.indexOf("Off") > -1;
            if (spread1 != null && spread1.trim().length !== 0) {
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
              bettables.push(bettable);
            }
          }

          callback(null, bettables);
        })
      }
    });
  }
}

