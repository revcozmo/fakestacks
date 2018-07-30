/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function (req, res, next) {
		var bet = req.allParams();
		if (CartHelper.indexOfBetInCart(bet, req.session.cart) > -1) {
			return res.status(204);
		}
		Bettable.findOne(bet.bettableId, function foundBettable(err, bettable) {
			if (err) return next(err);
			if (!bettable) return res.badRequest('Game with ID ' + bet.bettableId + ' doesn\'t exist');
			var potentialBet = {};
			potentialBet.bettable = bettable;
			if (bet.sideId == bettable.sideId1) {
				potentialBet.line = bettable.team1Spread;
			}
			else if (bet.sideId == bettable.sideId2) {
				potentialBet.line = bettable.team2Spread;
			}
			else {
				potentialBet.line = bettable.overunder;
			}
			potentialBet.sideId = bet.sideId;
			potentialBet.overunder = bet.overunder;
			if (bettable.sideId1 != bet.sideId && bettable.sideId2 != bet.sideId && bet.overunder==null) {
				return res.badRequest(bet.sideId + ' is not a valid sideId for this game');
			}
			potentialBet.amount = 0; //Make this an inputtable value later
			if (!req.session.cart) {
				req.session.cart = [];
			}
			req.session.cart.push(potentialBet);
			res.status(201);
			return res.json(potentialBet);
		});
	},

	edit: function(req, res, next) {
		var bet = req.allParams();
		var index = CartHelper.indexOfBetInCart(bet, req.session.cart);
		if (index > -1) {
			potentialBet = req.session.cart[index];
			potentialBet.amount = req.param('amount');
		}
		return res.ok();
	},

	destroy: function(req, res, next) {
		var bet = req.allParams();
		var index = CartHelper.indexOfBetInCart(bet, req.session.cart);
		if (index > -1) {
			req.session.cart.splice(index, 1);
		}
		return res.ok()
	},

	index: function(req, res, next) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
		res.view({
			confirmation: false,
			potentialBets: req.session.cart
		});
	},

};

