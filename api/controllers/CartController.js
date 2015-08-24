/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	create: function (req, res, next) {
		var bet = req.params.all();
		var cartBet = this.getBetFromCart(bet.sideId, req.session.cart);
		if (cartBet) {
			return res.status(204);
		}
		Bettable.findOne(bet.bettableId, function foundBettable(err, bettable) { 
			if (err) return next(err);
			if (!bettable) return res.badRequest('Game with ID ' + bet.bettableId + ' doesn\'t exist');
			var potentialBet = {};
			potentialBet.bettable = bettable;
			potentialBet.sideId = bet.sideId;
			if (bettable.sideId1 != bet.sideId && bettable.sideId2 != bet.sideId) {
				return res.badRequest(bet.sideId + ' is not a valid sideId for this game');
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

	getBetFromCart: function(sideId, cart) {
		for (var i=0; i<cart.length; i++) {
			var potentialBet = cart[i];
			if (potentialBet.sideId == sideId) {
				return potentialBet;
			}
		}
	},

	removeBetFromCart: function(sideId, cart) {
		console.log("Cart size before: " + cart.length);
		for (var i=0; i<cart.length; i++) {
			var potentialBet = cart[i];
			if (potentialBet.sideId == sideId) {
				cart.splice(i, 1);
				console.log("removing");
			}
		}
		console.log("Cart size: " + cart.length);
	}

};

