/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
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
			bet.amount = 0; //Make this an inputtable value later
			req.session.potentialBets.push(bet);
		});
		return;
	},	

	index: function(req, res, next) {
		res.view({
			potentialBets: req.session.potentialBets
		});
	}

};

