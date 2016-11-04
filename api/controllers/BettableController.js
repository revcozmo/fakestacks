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

  buildBettablesForSport: function (sportKey) {
    PinnacleGateway.getBettables(sportKey, function(error, bettables) {
      if (error) {
        console.log(error);
        return;
      }
      else {
        bettables.forEach(function(bettable) {
          Bettable.updateOrCreate(bettable.gameKey, bettable);
        });
      }
    });
  },

  create: function (req, res, next) {
    for (var sportKey in sails.config.sports) {
      this.buildBettablesForSport(sportKey)
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
