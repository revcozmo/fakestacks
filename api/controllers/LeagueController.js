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

  create: async function (req, res, next) {
    var league = req.allParams();
    league.weeklyBetAccountRatio = league.weeklyBetAccountRatio / 100;
    League.create(league, function leagueCreated(err, league) {
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }

        return res.redirect('/league/new');
      }
      req.session.League = league;
      User.visitLeague(req.session.User.id, league.id);
      let gambler = {
        user: req.session.User.id,
        league: league.id,
        admin: true
      };
      Gambler.create(gambler, function (err, createdGambler) {
        req.session.Gambler = createdGambler;
        var newAccountTransaction = {
          gambler: createdGambler.id,
          amount: league.startingAccount,
          bet: null
        };
        Transaction.create(newAccountTransaction, function transactionCreate(err, transaction) {
          if (err) {
            console.log(err);
            req.session.flash = {
              err: err
            }
            return res.redirect('/league/new');
          }
          Transaction.updateUserMoney(req.session, transaction.amount, function() {
            return res.redirect('/league/settings');
          });
        });
      });
    });
  },

  edit: function(req, res, next) {
    League.findOne(req.param('id'), function foundLeague(err, league) {
      if (err) return next(err);
      if (!league) return next();
      res.view({
        league: league,
        currentuser: req.session.User
      });
    });
  },

  update: function(req, res, next) {
    League.update(req.param('id'), req.allParams(), function leagueUpdated(err, updated) {
      if (err) return res.redirect('/league/edit/' + req.param('id'));
      req.session.League = updated[0];
      res.redirect('/league/settings/');
    });
  },

  join: function(req, res, next) {
    res.redirect('/');
  },

  'settings': function (req, res) {
    var league = req.session.League;
    Gambler.find().where({league: league.id}).populate('user').exec(function foundGamblers(err, gamblers) {
      if (err) return next(err);
      gamblers.sort(function(gambler1, gambler2) {
        return (gambler1.user.lastName == gambler2.user.lastName) ? (gambler1.user.firstName > gambler2.user.firstName) : (gambler1.user.lastName > gambler2.user.lastName);
      });
      res.view({
        league: league,
        users: gamblers.map(gambler => gambler.user)
      });
    });
  }


};

