/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	show: function(req, res, next) {
		console.log("show");
		Account.find()
			.where({'userId':req.session.User.id})
			.sort('createdAt desc')
			.exec(function foundAccounts(err, accounts) {
				if (err) return next(err);
				if (!accounts) return next();
				res.view({
					accounts: accounts
				});
			});
	}
};

