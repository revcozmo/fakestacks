// /**
//  * AccountController
//  *
//  * @description :: Server-side logic for managing accounts
//  * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
//  */
//
// module.exports = {
//
// 	'new': function (req, res) {
// 		res.view();
// 	},
//
// 	create: function (req, res, next) {
// 		var account = req.params.all();
// 		Account.create( account, function userCreated (err, account) {
// 			if (err) {
// 				console.log(err);
// 				req.session.flash = {
// 					err: err
// 				}
//
// 				return res.redirect('/account/new');
// 			}
// 			res.redirect('/account/show/'+account.id);
// 		});
// 	},
//
// 	show: function(req, res, next) {
// 		Account.findOne(req.param('id'), function foundAccount(err, account) {
// 			if (err) return next(err);
// 			if (!account) return next();
// 			res.view({
// 				account: account
// 			});
// 		});
// 	},
//
// 	edit: function(req, res, next) {
// 		Account.findOne(req.param('id'), function foundAccount(err, account) {
// 			if (err) return next(err);
// 			if (!account) return next();
// 			res.view({
// 				account: account
// 			});
// 		});
// 	},
//
// 	password: function(req, res, next) {
// 		Account.findOne(req.param('id'), function foundUser(err, account) {
// 			if (err) return next(err);
// 			if (!account) return next();
// 			res.view({
// 				account: account
// 			});
// 		});
// 	},
//
// 	updatepass: function(req, res, next) {
// 		var account = req.params.all();
// 		account.password_update = true;
// 		Account.update(req.param('id'), req.params.all(), function updatedPassword(err) {
// 			if (err) {
// 				req.session.flash = {
// 					err: err
// 				}
// 				return res.redirect('/account/password/' + req.param('id'));
// 			}
// 			res.redirect('/account/show/' + req.param('id'));
// 		});
// 	},
//
// 	destroy: function(req, res, next) {
// 		Account.findOne(req.param('id'), function foundAccount(err, account) {
// 			if (err) return next(err);
// 			if (!account) return next('Account doesn\'t exist');
// 			Account.destroy(req.param('id'), function deleteAccount(err) {
// 				if (err) return next(err);
// 			});
// 			res.redirect('/account');
// 		});
// 	},
//
// 	update: function(req, res, next) {
// 		Account.update(req.param('id'), req.params.all(), function accountUpdated(err) {
// 			if (err) return res.redirect('/account/edit/' + req.param('id'));
// 			res.redirect('/account/show/' + req.param('id'));
// 		});
// 	},
//
// 	index: function(req, res, next) {
// 		Account.find().populate('user').exec(function foundAccounts(err, accounts) {
// 			if (err) return next(err);
// 			res.view({
// 				accounts: accounts
// 			});
// 		});
// 	},
//
//   _config: {}
//
// };
//
