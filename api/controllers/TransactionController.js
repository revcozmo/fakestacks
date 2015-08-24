/**
 * TransactionController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	show: function(req, res, next) {
		Transaction.getTransactionsWithTally(req.session.User.id, function foundTransactions(err, transactionsWithTotal) {
			if (err) return next(err);
			if (!transactionsWithTotal) return next();
			res.view({
				transactions: transactionsWithTotal.transactions,
				total: transactionsWithTotal.total
			});
		});
	}
};

