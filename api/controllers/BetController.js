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
			bet.bettableId = bet.bettable.id;
			bet.userId = req.session.User.id;
			bet.time = new Date();
			Bet.create( bet, function betCreated(err, user) {
				if (err) {
					console.log(err);
					req.session.flash = {
						err: err
					}
					return res.redirect('/bettable');
				}
				console.log("Bet Created!");
				createdBets++;
				if (createdBets == req.session.cart.length) {
					res.redirect('/bettable');
				}
			});
		}
	},

	_config: {}
	
};

