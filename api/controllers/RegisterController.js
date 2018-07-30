/**
 * RegisterController
 *
 * @description :: Server-side logic for managing registers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res) {
    res.view('register/index');
  },

  create: async function (req, res, next) {
    var user = req.allParams();

    //TODO: Throw these into helper (like UserHelper)
    var encryptedPassword = await sails.helpers.passwords.hashPassword(user.password);
    //var encryptedPassword = require('password-hash').generate(values.password);
    user.encryptedPassword = encryptedPassword;

    User.create( user, function userCreated(err, user) {
      if (err) {
        //TODO: Fix this
        console.log(err);
        req.session.flash = {
          err: err.message
        }
        res.redirect('/register/index');
      }
      req.session.authenticated = true;
      req.session.User = user;
      res.redirect('/');
    });
  }

};

