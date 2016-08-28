/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller
  if (req.session.User && !req.session.User.league) {
    return ok();
  }
  else {
    var requireAdminError = [{name: 'User already has a league', message: 'You have already created a league'}]
    req.session.flash = {
      err: requireAdminError
    }
    res.redirect('/login');
  }
};
