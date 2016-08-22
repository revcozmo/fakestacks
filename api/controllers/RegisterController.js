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

  create: function (req, res, next) {
    var user = req.params.all();
    User.create( user, function userCreated(err, user) {
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }
        return res.redirect('/register/index');
      }
      req.session.authenticated = true;
      req.session.User = user;
      res.redirect('/');
    });
  }

};

