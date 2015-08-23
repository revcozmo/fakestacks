/**
 * ConfirmationController
 *
 * @description :: Server-side logic for managing confirmations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res, next) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
		if (req.session.cart.length == 0) {
			res.notFound("You have no bets to confirm");
		}
		var totalAmount = 0;
		for (var i=0; i<req.session.cart.length; i++) {
			totalAmount += parseInt(req.session.cart[i].amount);
		}
		console.log("Cart size: " + req.session.cart.length);
		res.view({
			potentialBets: req.session.cart,
			totalAmount: totalAmount
		});
	},
	
};

