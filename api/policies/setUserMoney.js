
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
  	var userId = req.session.User.id
  	if (!sails.config.cache.user_money[userId]) {
      Transaction.getTransactionsWithTally(userId, function(err, transactionsWithTally) {
        if (err) {
          //TODO: handle error
        }
        sails.config.cache.user_money[userId] = transactionsWithTally.total;
        next();
      })
    }
  }
  else {
      return next();
  }

};
