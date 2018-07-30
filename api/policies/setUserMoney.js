
module.exports = function(req, res, next) {

  if (req.session.authenticated && req.session.Gambler && !req.session.gambler_money) {
    Transaction.getTransactionsWithTally(req.session.Gambler.id, function(err, transactionsWithTally) {
      if (err) {
        console.error("Unable to get transactions for user");
        return next();
      }
      req.session.gambler_money = transactionsWithTally.total;
      return next();
    })
  }
  else {
    return next();
  }

};
