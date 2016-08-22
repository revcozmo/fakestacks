/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller
  if (req.session.User && req.session.User.admin) {
    return ok();
  }
  else {
    var requireAdminError = [{name: 'Administrator Required', message: 'You must be an administrator to access this page'}]
    req.session.flash = {
      err: requireAdminError
    }
    res.redirect('/session/new');
  }
};
