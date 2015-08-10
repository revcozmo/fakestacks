/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	create: function (req, res, next) {
		var bet = req.params.all();
		Bettable.findOne(bet.bettableId, function foundBettable(err, bettable) { 
			if (err) return next(err);
			if (!bettable) return res.badRequest('Game with ID ' + bet.bettableId + ' doesn\'t exist');
			var potentialBet = {};
			potentialBet.bettable = bettable;
			potentialBet.betId = bet.betId;
			if (bettable.betId1 != bet.betId && bettable.betId2 != bet.betId) {
				return res.badRequest(bet.betId + ' is not a valid betId for this game');
			}
			potentialBet.amount = 0; //Make this an inputtable value later
			if (!req.session.cart) {
				req.session.cart = [];
			}
			req.session.cart.push(potentialBet);
			req.session.save()
			console.log("Cart size: " + req.session.cart.length);
		});
	},	

	index: function(req, res, next) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
		console.log("Cart size: " + req.session.cart.length);
		res.view({
			potentialBets: req.session.cart
		});
	}

};

