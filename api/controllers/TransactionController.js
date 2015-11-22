/**
 * TransactionController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	show: function(req, res, next) {
		var userId = req.param('id');
		Bet.find().where({user: userId ? userId : req.session.User.id}).sort({ time: 'asc' }).populate('bettable').populate('user').exec(function foundBets(err, bets) {
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
			var tallies = BetService.getBetTallies(bets);
			tallies.bets = bets;
			tallies.user = bets[0].user;
			res.view(tallies);
		});
	}
};

