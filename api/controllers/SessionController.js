/**
 * SessionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
	'new': function(req, res) {
    if (req.session.authenticated) {
      res.redirect('/');
    }
    else {
      res.view('session/new');
    }
	},

	create: async function(req, res, next) {

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
		
		User.findOne({email: req.param('email').toLowerCase()}).exec(async function foundUser(err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user) {
				var noAccountError = [{
					name: 'noAccount',
					message: 'The email address ' + req.param('email') + ' not found.'
				}];
				req.session.flash = {
					err: noAccountError
				};
				res.redirect('/login');
				return;
			}

			// Compare password from the form params to the encrypted password of the user found.

			await sails.helpers.passwords.checkPassword(req.param('password'), user.encryptedPassword)
				.intercept(()=>{
					var usernamePasswordMismatchError = [{
						name: 'usernamePasswordMismatch',
						message: 'Invalid username and password combination.'
					}];
					req.session.flash = {
						err: usernamePasswordMismatchError
					};
					return res.redirect('/login');
				});

			// Log user in
			req.session.authenticated = true;
			req.session.User = user;

			if (user.lastVisitedLeague) {
        req.session.League = await League.findOne({id: user.lastVisitedLeague});
        req.session.Gambler = await Gambler.getForUserAndLeague(user.id, req.session.League.id);
      }

      // If the user is also an admin redirect to the user list (e.g. /views/user/rules.ejs)
      // This is used in conjunction with config/policies.js file
      Transaction.getTransactionsWithTally(req.session.Gambler.id, function(err, transactionsWithTally) {
        if (err) {
          console.log(err);
          req.session.flash = {
            err: err
          }
          return res.redirect('/');
        }
        req.session.gambler_money = transactionsWithTally.total;

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
