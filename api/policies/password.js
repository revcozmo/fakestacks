/**
 * Allow a logged-in user, and nobody else, to update their password
 */

module.exports = function(req, res, ok) {

	console.log("Hello?");
	if (req.session.User == null) {
		res.redirect('/session/new');
    	return;
	}
	var sessionUserMatchesId = (req.session.User.id == req.param('id'));

	// The requested id does not match the user's id,
	// and this is not an admin
	if (!sessionUserMatchesId) {
		var noRightsError = [{name: 'noRights', message: 'You cannot change the password for another user'}]
		req.session.flash = {
			err: noRightsError
		}
    	res.redirect('/session/new');
    	return;
	}

	console.log("It's okay");
	ok();

};