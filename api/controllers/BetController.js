/**
 * BetController
 *
 * @description :: Server-side logic for managing bets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function (req, res, next) {
		var bet = req.params.all();
		if (req.session.User == null) {
			res.redirect('/session/new');
		}
		bet.userId = req.session.User.id;
		bet.time = new Date();
		console.log("Original: " + bet);
		Bettable.findOne(bet.bettableId, function foundBettable(err, bettable) {
			if (err) return next(err);
			if (!bettable) return next('Game with ID ' + bet.bettableId + ' doesn\'t exist');
			bet.bettableId = bettable.id;
			if (bettable.team1 != bet.team && bettable.team2 != bet.team) {
				return next(bet.team + ' is not a valid team for this game');
			}
			else if (bettable.team1 == bet.team) {
				bet.spread = bettable.team1Spread;
			}
			else if (bettable.team2 == bet.team) {
				bet.spread = bettable.team2Spread;
			}
			bet.amount = 10; //Make this an inputtable value later
			Bet.create( bet, function betCreated (err, user) {
				if (err) {
					console.log(err);
					req.session.flash = {
						err: err
					}

					return res.redirect('/bettable');
				}
				console.log("Bet Created!");
				res.redirect('/bettable');
			});
		});
	},

	_config: {}
	
};

