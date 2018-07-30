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

  create: function (req, res, next) {
    let interval = 0;
    for (const sportKey in sails.config.sports) {
      setTimeout(() => {
        BettablesBuilder.buildBettablesForSport(sportKey)
      }, interval);
      interval += 60000;
    }

    res.redirect('/games');
  },

  index: function (req, res, next) {
    const rightnow = new Date();
    Bettable.find().where({gameTime: {'>=': rightnow}, sport: req.session.League.sport}).sort('gameTime asc').exec(function foundBettables(err, bettables) {
      if (err) return next(err);
      if (!req.session.cart) {
        req.session.cart = [];
      }
      let total = 0;
      let disabledButtons = [];
      for (let i = 0; i < req.session.cart.length; i++) {
        const bet = req.session.cart[i];
        disabledButtons[i] = bet.bettable.id + "-" + (bet.overunder != null ? bet.overunder : bet.sideId);
        total += parseInt(req.session.cart[i].amount);
      }
      res.view({
        confirmation: false,
        bettables: bettables,
        potentialBets: req.session.cart,
        disabledButtons: disabledButtons,
        totalAmount: total,
        buttonIsDisabled: function (button, disabledButtons) {
          return (disabledButtons.indexOf(button) !== -1);
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
