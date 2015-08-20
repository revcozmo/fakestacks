/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	create: function (req, res, next) {
		var bet = req.params.all();
		var cartBet = this.getBetFromCart(bet.betId, req.session.cart);
		if (cartBet) {
			return res.status(204);
		}
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
			res.status(201);
			return res.json(potentialBet);
		});
	},

	edit: function(req, res, next) {
		var id = req.param('id');
		var potentialBet = this.getBetFromCart(id, req.session.cart);
		if (potentialBet) {
			potentialBet.amount = req.param('amount');
			req.session.save();
		}
		return res.ok();
	},

	destroy: function(req, res, next) {
		var id = req.param('id');
		var potentialBet = this.removeBetFromCart(id, req.session.cart);
		req.session.save();
		console.log("here we go");
		return res.ok()
	},	

	index: function(req, res, next) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
		console.log("Cart size: " + req.session.cart.length);
		res.view({
			potentialBets: req.session.cart
		});
	},

	getBetFromCart: function(betId, cart) {
		for (var i=0; i<cart.length; i++) {
			var potentialBet = cart[i];
			if (potentialBet.betId == betId) {
				return potentialBet;
			}
		}
	},

	removeBetFromCart: function(betId, cart) {
		console.log("Cart size before: " + cart.length);
		for (var i=0; i<cart.length; i++) {
			var potentialBet = cart[i];
			if (potentialBet.betId == betId) {
				cart.splice(i, 1);
				console.log("removing");
			}
		}
		console.log("Cart size: " + cart.length);
	}

};

