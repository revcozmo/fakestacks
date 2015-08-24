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
		if (req.session.User == null) {
			res.redirect('/session/new');
		}
		//TODO: Should validate one more time
		for (var i=0; i<confirmedBets.length; i++) {
			var bet = confirmedBets[i];
			bet.bettable = bet.bettable;
			bet.user = req.session.User;
			bet.time = new Date();
			Bet.create( bet, function betCreated(err, createdBet) {
				if (err) {
					console.log(err);
					req.session.flash = {
						err: err
					}
					return res.redirect('/bettable');
				}
				transaction = {
					user: req.session.User,
					amount: 0-parseInt(createdBet.amount),
					bet: createdBet,
					bettable: createdBet.bettable
				};
				Transaction.create(transaction, function transactionCreated(err, createdTransaction) {
					if (err) {
						console.log(err);
						req.session.flash = {
							err: err
						}
						return res.redirect('/bettable');
					}
					console.log("Bet Created!");
					createdBets++;
					req.session.User.money += createdTransaction.amount;
					if (createdBets == req.session.cart.length) {
						req.session.cart = [];
						res.redirect('/bettable');
					}
				});
			});
		}
	},

	index: function(req, res, next) {
		Bet.find().where({win:null}).populate('bettable').populate('user').sort('user DESC').exec(function(err,bets) {
			console.log("Bets: " + bets.length);
			var users = {};
			for (var i=0; i<bets.length; i++) {
				if (!users[bets[i].user.id]) {
					users[bets[i].user.id] = [];
				}
				users[bets[i].user.id].push(bets[i]);
			}
			for (var id in users) {
				console.log('User: ' + id + ": " + users[id].length);
			}
			//TODO: Do something with this view later
			res.view({
				bets: bets
			});
		});
	},

	_config: {}
	
};

