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
		if (!req.session.User) {
			req.session.flash = {
				err: ["You must login to place bets"]
			}
			return res.redirect("/bettable");
		}
		if (req.session.cart.length == 0) {
			req.session.flash = {
				err: ["You have no bets to confirm"]
			}
			return res.redirect("/bettable");
		}
		ValidationService.validateBets(req, req.session.cart, function(errors) {
			console.log("Confirmation validation errors: " + errors);
			if (errors.length > 0) {
        req.session.flash = {
					err: errors
				}
				return res.redirect('/bettable');
		    }
			var totalAmount = 0;
			for (var i=0; i<req.session.cart.length; i++) {
				totalAmount += parseInt(req.session.cart[i].amount);
			}
			console.log("Cart size: " + req.session.cart.length);
			return res.view({
				confirmation: true,
				potentialBets: req.session.cart,
				totalAmount: totalAmount
			});
		});
	}

};

