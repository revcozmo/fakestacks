/**
 * Allow a logged-in user, and nobody else, to update their password
 */

module.exports = function(req, res, ok) {

	if (req.session.User == null) {
		res.redirect('/login');
    	return;
  }

  User.findOne(req.param('id')).exec(function foundUser(err, user) {
    
    var sessionUserMatchesId = (req.session.User.id == req.param('id'));
    
      // The requested id does not match the user's id,
      // and this is not an admin
      if (!sessionUserMatchesId) {
        var noRightsError = [{name: 'noRights', message: 'You cannot change the password for another user'}]
        req.session.flash = {
          err: noRightsError
        }
        res.redirect('/login');
        return;
      }
      ok();
  });

};
