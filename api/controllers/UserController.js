/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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

	'new': function(req, res) {
		res.view();
	},

	create: async function(req, res, next) {
		var user = req.allParams();
		user.league = req.session.League;
		
		var encryptedPassword = await sails.helpers.passwords.hashPassword(user.password);
		//var encryptedPassword = require('password-hash').generate(values.password);
		user.encryptedPassword = encryptedPassword;

		//TODO: This should go away, but for now...
		User.create( user, function userCreated (err, user) {
			if (err) {
				console.log(err);
        req.session.flash = {
          err: err
        };
				return res.redirect('/user/new');
			}
			var newGambler = {
        user: user.id,
        league: req.session.League.id
      };
			Gambler.create(newGambler, function (err, gambler) {
				if (err) {
					console.log(err);
					req.session.flash = {
						err: err
					};
					return res.redirect('/user/new');
				}
				var newAccountTransaction = {
					user: user.id,
					amount: req.session.League.startingAccount,
					bet: null
				};
				Transaction.create(newAccountTransaction, function transactionCreated(err, transaction) {
					if (err) {
						console.log(err);
						req.session.flash = {
							err: err
						};
						return res.redirect('/user/new');
					}
					Transaction.updateUserMoney(req.session, transaction.amount, function() {
						NotificationService.sendWelcomeNotification(user, req.session.User);
						res.redirect('/league/settings');
					});
				});
			});
		});
	},

	show: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},

	edit: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},

	password: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},

	destroy: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next('User doesn\'t exist');
			User.destroy(req.param('id'), function deleteUser(err) {
				if (err) return next(err);
			});
			res.redirect('/user');
		});
	},

	update: function(req, res, next) {
	  user = req.allParams();
    user.notifyprocessedbets = user.notifyprocessedbets == "on";
		User.update(req.param('id'), user, function userUpdated(err, updatedUsers) {
			if (err) {
        req.session.flash = {
          err: err
        };
			  return res.redirect('/user/edit/' + req.param('id'));
      }
      if (updatedUsers[0].id == req.session.User.id) {
        res.redirect('/user/show/' + req.param('id'));
      }
      else {
        res.redirect('/league/settings/');
      }
		});
	},

  updatepass: function(req, res, next) {
    var user = req.allParams();
    user.password_update = true;
    User.update(req.param('id'), user, function updatedPassword(err) {
      if (err) {
        req.session.flash = {
          err: err
        };
        return res.redirect('/user/password/' + req.param('id'));
      }
      res.redirect('/user/show/' + req.param('id'));
    });
  },

  index: function(req, res, next) {
	  var league = req.session.League;
		Gambler.find().where({league: league.id}).populate('user').populate('bets', {where: {archived: false}}).exec(function foundGamblers(err, gamblers) {
			if (err) return next(err);
			var totalMoney = 0;
			var totalWins = 0;
			var totalLosses = 0;
			var totalPushes = 0;
			var totalVigLoss = 0;
			for (var i=0; i<gamblers.length; i++) {
				var tallies = BetService.getBetTallies(gamblers[i].bets, league.startingAccount);
				for (var prop in tallies) {
					gamblers[i][prop]=tallies[prop];
				}
				totalVigLoss += gamblers[i].vigLoss;
				totalMoney += gamblers[i].money;
				totalWins += gamblers[i].wins;
				totalLosses += gamblers[i].losses;
				totalPushes += gamblers[i].pushes;
			}
			gamblers.sort(function(gambler1, gambler2){return (gambler2.money-gambler1.money==0) ? (gambler2.wins-gambler1.wins) : (gambler2.money-gambler1.money)});
			var totalVigLoss = Math.round(totalVigLoss);
			var startingLeagueMoney = req.session.League.startingAccount * gamblers.length;
			var houseMoney = startingLeagueMoney - totalMoney;
			var houseMoneyWithVig = houseMoney + totalVigLoss;
			res.view({
				gamblers: gamblers,
				totalMoney: totalMoney,
				totalRecord: totalWins+"-"+totalLosses+"-"+totalPushes,
				houseMoney: houseMoney,
				totalVigLoss: totalVigLoss,
				houseMoneyWithVig: houseMoneyWithVig
			});
		});
	},

  _config: {}


};
