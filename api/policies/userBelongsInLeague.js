/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  var userId = req.param('id');
  if (!userId) {
    return ok();
  }
  var leagueId = req.session.League.id;
  User.findOne(userId).populate('gamblers').exec(function foundUser(err, user) {
    if (err) {
      return res.redirect('login')
    }
    if (!user || !user.gamblers || user.gamblers.find(function(gambler) { return gambler.league.id == leagueId })) {
      return res.redirect('login')
    }
    return ok();
  });
};

