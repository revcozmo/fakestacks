/**
 * BettableController
 *
 * @module      :: Controller
 * @description  :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  buildBettablesForUrl: function (sportKey) {
    var sport = sails.config.sports[sportKey];
    var request = require('request');
    var cheerio = require('cheerio');

    request(sport.url, function (error, response, html) {
      if (!error) {
        var $ = cheerio.load(html);

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
            var beforeDaylightSavingsEnd = Date.parse(gameTime) < Date.parse("2015-11-01")
            gameTime += (beforeDaylightSavingsEnd ? " GMT-0400" : " GMT-0500");
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
              Bettable.updateOrCreate(gameKey, bettable);
            }
          }
        })
      }
    });
  },

  create: function (req, res, next) {
    for (var sportKey in sails.config.sports) {
      this.buildBettablesForUrl(sportKey)
    }

    res.redirect('/bettable');
  },

  index: function (req, res, next) {
    var rightnow = new Date();
    Bettable.find().where({gameTime: {'>=': rightnow}, sport: req.session.User.league.sport}).sort({gameTime: 'asc'}).exec(function foundBettables(err, bettables) {
      if (err) return next(err);
      if (!req.session.cart) {
        req.session.cart = [];
      }
      var total = 0;
      var disabledButtons = [];
      for (var i = 0; i < req.session.cart.length; i++) {
        var bet = req.session.cart[i];
        disabledButtons[i] = bet.bettable.id + "-" + (bet.over != null ? bet.over : bet.sideId);
        total += parseInt(req.session.cart[i].amount);
      }
      res.view({
        confirmation: false,
        bettables: bettables,
        potentialBets: req.session.cart,
        disabledButtons: disabledButtons,
        totalAmount: total,
        buttonIsDisabled: function (button, disabledButtons) {
          return (disabledButtons.indexOf(button) != -1);
        }
      });
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BettableController)
   */
  _config: {}


};
