/**
 * SessionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var passwordHash = require('password-hash');

module.exports = {

	'new': function(req, res) {
		res.view('session/new');
	},

	create: function(req, res, next) {

		// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if (!req.param('email') || !req.param('password')) {
			// return next({err: ["Password doesn't match password confirmation."]});

			var usernamePasswordRequiredError = [{
				name: 'usernamePasswordRequired',
				message: 'You must enter both a username and password.'
			}]

			// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
			// the key of usernamePasswordRequiredError
			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect('/login');
			return;
		}

		// Try to find the user by their email address.
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
		// User.findOneByEmail(req.param('email')).done(function(err, user) {
    User.findOneByEmail(req.param('email').toLowerCase()).populate('league').exec(function foundUser(err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user) {
				var noAccountError = [{
					name: 'noAccount',
					message: 'The email address ' + req.param('email') + ' not found.'
				}]
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('/login');
				return;
			}

			// Compare password from the form params to the encrypted password of the user found.

			var passwordVerified = passwordHash.verify(req.param('password'), user.encryptedPassword);
			if (!passwordVerified) {
				var usernamePasswordMismatchError = [{
					name: 'usernamePasswordMismatch',
					message: 'Invalid username and password combination.'
				}]
				req.session.flash = {
					err: usernamePasswordMismatchError
				}
				res.redirect('/login');
				return;
			}

			// Log user in
			req.session.authenticated = true;
			req.session.User = user;

      if (err) return next(err);

      // If the user is also an admin redirect to the user list (e.g. /views/user/index.ejs)
      // This is used in conjunction with config/policies.js file
      Transaction.getTransactionsWithTally(user.id, function(err, transactionsWithTally) {
        if (err) {
          console.log(err);
          req.session.flash = {
            err: err
          }
          return res.redirect('/');
        }
        sails.config.cache.user_money[req.session.User.id] = transactionsWithTally.total;
        if (req.session.User.admin) {
          if (req.session.returnTo) {
             res.redirect(req.session.returnTo);
          } else {
             res.redirect('/');
          }
          return;
        }

        //Redirect to their profile page (e.g. /views/user/show.ejs)
        if (req.session.returnTo) {
           res.redirect(req.session.returnTo);
        } else {
           res.redirect('/');
        }
      });
    });
	},

	destroy: function(req, res, next) {
    req.session.destroy();
    res.redirect('/login');
	}
};
