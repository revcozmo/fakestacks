/**
 * TransactionController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	show: function(req, res, next) {
		Bet.find().where({user: req.session.User.id}).populate('bettable').exec(function foundBets(err, bets) {
			if (err) return next(err);
			if (!bets) return next();
			var runningTally = sails.config.league.startingAccount;
			for (var i=0; i<bets.length; i++) {
				var bet = bets[i];
				if (bet.win === true) {
					runningTally += bet.amount;
				}
				else if (bet.win === false) {
					runningTally -= bet.amount;
				}
				bet.tally = runningTally;
			}
			res.view({
				bets: bets,
				total: bets[bets.length-1].tally,
				start: sails.config.league.startingAccount
			});
		});
	}
};

