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
        req.session.User.admin = true;
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
          return res.redirect('/league/settings');
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
    League.update(req.param('id'), req.params.all(), function leagueUpdated(err, updated) {
      if (err) return res.redirect('/league/edit/' + req.param('id'));
      req.session.User.league = updated[0];
      res.redirect('/league/settings/');
    });
  },

  join: function(req, res, next) {
    res.redirect('/');
  },

  'settings': function (req, res) {
    var league = req.session.User.league;
    User.find().where({league: league.id}).exec(function foundUsers(err, users) {
      if (err) return next(err);
      users.sort(function(user1, user2) {
        return (user1.lastName == user2.lastName) ? (user1.firstName > user2.firstName) : (user1.lastName > user2.lastName);
      });
      res.view({
        league: league,
        users: users
      });
    });
  }


};

