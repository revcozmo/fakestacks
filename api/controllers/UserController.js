/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  
	'new': function (req, res) {
		res.view();
	},

	create: function (req, res, next) {
		var user = req.params.all();
		for (key in user) {
			console.log(key + ":" + user[key]);
		}
		user.admin = req.session.emptyLeague ? true : false;
		User.create( user, function userCreated (err, user) {
			req.session.emptyLeague = false;
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err
				}

				return res.redirect('/user/new');
			}
			newAccountTransaction = {
				user: user,
				amount: 500,
				bet: null
			};
			Transaction.create(newAccountTransaction, function accountCreated(err, account) {
				if (err) {
					console.log(err);
					req.session.flash = {
						err: err
					}

					return res.redirect('/user/new');
				}
				res.redirect('/user/show/'+user.id);
			});
		});
	},

	show: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},

	edit: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},

	password: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},

	updatepass: function(req, res, next) {
		console.log("i made it");
		var user = req.params.all();
		user.password_update = true;
		User.update(req.param('id'), req.params.all(), function updatedPassword(err) {
			console.log("hi");
			if (err) {
				console.log("ERROR");
				req.session.flash = {
					err: err
				}
				return res.redirect('/user/password/' + req.param('id'));
			}
			res.redirect('/user/show/' + req.param('id'));
		});
	},

	destroy: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) return next('User doesn\'t exist');
			User.destroy(req.param('id'), function deleteUser(err) {
				if (err) return next(err);
			});
			res.redirect('/user');
		});
	},

	update: function(req, res, next) {
		User.update(req.param('id'), req.params.all(), function userUpdated(err) {
			if (err) return res.redirect('/user/edit/' + req.param('id'));
			res.redirect('/user/show/' + req.param('id'));
		});
	},

	index: function(req, res, next) {
		User.find(function foundUsers(err, users) {
			if (err) return next(err);
			res.view({
				users: users
			});
		});
	},

  _config: {}

  
};
