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
			return res.redirect("/games");
		}
		if (req.session.cart.length == 0) {
			req.session.flash = {
				err: ["You have no bets to confirm"]
			}
			return res.redirect("/games");
		}
		ValidationService.validateBets(req, req.session.cart, function(errors) {
			if (errors.length > 0) {
        req.session.flash = {
					err: errors
				}
				return res.redirect('/games');
		    }
			var totalAmount = 0;
			for (var i=0; i<req.session.cart.length; i++) {
				totalAmount += parseInt(req.session.cart[i].amount);
			}
			return res.view({
				confirmation: true,
				potentialBets: req.session.cart,
				totalAmount: totalAmount
			});
		});
	}

};

