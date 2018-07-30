/**
 * BetController
 *
 * @description :: Server-side logic for managing bets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function (req, res, next) {
		var confirmedBets = req.session.cart;
		var createdBets = 0;
		if (req.session.Gambler == null) {
			res.redirect('/login');
		}

		ValidationService.validateBets(req, confirmedBets, function(errors) {
			if (errors.length > 0) {
        req.session.flash = {
					err: errors
				};
				return res.redirect('/confirmation');
      }

			for (var i=0; i<confirmedBets.length; i++) {
				var bet = confirmedBets[i];
				bet.bettable = bet.bettable.id;
				bet.gambler = req.session.Gambler.id;
				bet.time = new Date();
				Bet.create( bet, function betCreated(err, createdBet) {
					if (err) {
						console.log(err);
						req.session.flash = {
							err: err
						};
						return res.redirect('/games');
					}
					var transaction = {
						gambler: req.session.Gambler.id,
						amount: 0-parseInt(createdBet.amount),
						bet: createdBet.id,
						bettable: createdBet.bettable
					};
					Transaction.create(transaction, function transactionCreated(err, createdTransaction) {
						if (err) {
							console.log(err);
							req.session.flash = {
								err: err
							};
							return res.redirect('/games');
						}
						//TODO: Move all these updateUserMoney things into a helper method
						Transaction.updateUserMoney(req.session, createdTransaction.amount, function() {
							createdBets++;
							if (createdBets == req.session.cart.length) {
								req.session.cart = [];
								res.redirect('/games');
							}
						});
					});
				});
	    	}
		});
	},

	update: function(req, res, next) {
		Bet.update(req.param('id'), req.allParams(), function betUpdated(err, updatedBets) {
			if (err) {
				console.log("BET UPDATE FAILED: " + err);
				return res.badRequest();
			}
			var bet = updatedBets[0];
			if (bet.outcome === 'WIN' || bet.outcome === 'PUSH') {
				console.log("Logging " + bet.outcome + " transaction");
        let amount = parseInt(bet.amount);
        if (bet.outcome === 'WIN') {
          amount = amount*2;
        }
				let transaction = {
					gambler: bet.gambler,
					amount: amount,
					bet: bet.id,
					bettable: bet.bettable
				};
				Transaction.create(transaction, function transactionCreated(err, createdTransaction) {
					if (err) {
						console.log(err);
						req.session.flash = {
							err: err
						}
						console.log("TRANSACTION UPDATE FAILED: " + err);
						return res.badRequest();
					}
					Transaction.updateUserMoney(req.session, createdTransaction.amount, function() {
            NotificationService.sendBetNotification(bet);
						return res.ok();
          });
				});
			}
			else {
				console.log("Logging losing transaction");
        NotificationService.sendBetNotification(bet);
				return res.ok();
			}
		});
	},

	index: function(req, res, next) {
		var leagueId = req.session.League.id;
    	Bet.find().where({complete:false, archived:false}).populate('bettable').populate('gambler').exec(function(err,bets) {
      //TODO: Sort by gambler programatically
      bets = bets.filter(function(bet) {
			  return bet.gambler.league == leagueId;
      });
      var betsByUser = {};
			for (let i=0; i<bets.length; i++) {
				if (!betsByUser[bets[i].gambler.id]) {
					betsByUser[bets[i].gambler.id] = [];
				}
				betsByUser[bets[i].gambler.id].push(bets[i]);
			}
			res.view({
				betsByUser: betsByUser
			});
		});
	},

	_config: {}

};

