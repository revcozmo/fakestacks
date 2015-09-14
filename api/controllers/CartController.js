/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	create: function (req, res, next) {
		var bet = req.params.all();
		if (this.indexOfBetInCart(bet, req.session.cart) > -1) {
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
			potentialBet.over = bet.over;
			if (bettable.sideId1 != bet.sideId && bettable.sideId2 != bet.sideId && bet.over==null) {
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
		var bet = req.params.all();
		var index = this.indexOfBetInCart(bet, req.session.cart);
		if (index > -1) {
			potentialBet = req.session.cart[index];
			potentialBet.amount = req.param('amount');
			req.session.save();
		}
		return res.ok();
	},

	destroy: function(req, res, next) {
		var bet = req.params.all();
		var index = this.indexOfBetInCart(bet, req.session.cart);
		if (index > -1) {
			req.session.cart.splice(index, 1);
		}
		req.session.save();
		return res.ok()
	},	

	index: function(req, res, next) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
		console.log("Cart size: " + req.session.cart.length);
		res.view({
			confirmation: false,
			potentialBets: req.session.cart
		});
	},

	indexOfBetInCart: function(bet, cart) {
		for (var i=0; i<cart.length; i++) {
			var existing = cart[i];
			if (this.betMatches(bet, existing)) {
				return i;
			}
		}
		return -1;
	},

	betMatches: function(bet, existing) {
		var bettableIdMatches = existing.bettable.id == bet.bettableId;
		var sideIdMatches = existing.sideId!=null && existing.sideId == bet.sideId;
		var overPickMatches = existing.over!=null && existing.over == bet.over;
		return bettableIdMatches && (sideIdMatches || overPickMatches);
	}

};

