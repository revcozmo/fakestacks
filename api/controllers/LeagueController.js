/**
 * LeagueController
 *
 * @description :: Server-side logic for managing leagues
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  'new': function (req, res) {
    res.view({
      currentuser: req.session.User
    });
  },

  create: function (req, res, next) {
    var league = req.params.all();
    league.weeklyBetAccountRatio = league.weeklyBetAccountRatio / 100;
    League.create(league, function leagueCreated(err, league) {
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }

        return res.redirect('/league/new');
      }
      User.update(req.session.User.id, {league: league.id, admin: true}, function userUpdated() {
        req.session.User.league = league;
        var newAccountTransaction = {
          user: req.session.User,
          amount: league.startingAccount,
          bet: null
        };
        Transaction.create(newAccountTransaction, function accountCreated(err) {
          if (err) {
            console.log(err);
            req.session.flash = {
              err: err
            }
            return res.redirect('/league/new');
          }
          return res.redirect('/league');
        });
      });
    });
  },


};

