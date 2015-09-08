
module.exports = function(req, res, next) {

  if (req.session.authenticated && !sails.config.cache.user_money[req.session.User.id]) {
    Transaction.getTransactionsWithTally(req.session.User.id, function(err, transactionsWithTally) {
      if (err) {
        console.log("Unable to get transactions for user");
      }
      sails.config.cache.user_money[req.session.User.id] = transactionsWithTally.total;
      return next();
    })
  }
  else {
    return next();
  }

};
