/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller
  if (req.session.emptyLeague || (req.session.User && req.session.User.admin)) {
    return ok();
  }

  // User is not allowed
  else {
    User.find(function(err, users) {
      if (users == null || users.length == 0) {
        req.session.emptyLeague = true;
        return ok();
      }
      else {
        var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin.'}]
        req.session.flash = {
          err: requireAdminError
        }
        res.redirect('/session/new');
        return;
      }
    });
  }
};