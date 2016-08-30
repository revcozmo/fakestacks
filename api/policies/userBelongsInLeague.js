/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  var userId = req.param('id');
  var leagueId = req.session.User.league.id;
  User.findOne(userId, function foundUser(err, user) {
    if (err) {
      return res.redirect('login')
    }
    if (!user || user.league != leagueId) {
      return res.redirect('login')
    }
    return ok();
  });
};

