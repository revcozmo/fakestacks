/**
 * ValidationService
 */

module.exports = {

  validateBets: function (req, bets, cb) {
    var errors = [];

    //Validate the entered bet amounts
    for (var i = 0; i < bets.length; i++) {
      var amount = bets[i].amount;
      if (isNaN(amount)) {
        errors.push(amount + " is not a valid number");
      }
      if (amount < 1) {
        errors.push("You must bet $1 or more on each bet. You bet $" + amount);
      }
      if (errors.length > 0) {
        cb(errors);
        return;
      }
    }

    Bet.find().where({gambler: req.session.Gambler.id, complete: false}).exec(function (err, pendingBets) {
      Transaction.getTransactionsWithTally(req.session.Gambler.id, function (err, transactionsWithTotal) {
        //Validate the number of bets
        var numPendingBets = pendingBets.length;
        var league = req.session.League;
        if ((bets.length + pendingBets.length) > parseInt(league.weeklyBetCountMax)) {
          var errorString = "You cannot exceed " + league.weeklyBetCountMax + " bets for the week.";
          if (numPendingBets != 0) {
            errorString += " You already have " + numPendingBets + " pending bets and are about to add " + bets.length + " more.";
          }
          else {
            errorString += " You are adding " + bets.length + ".";
          }
          errors.push(errorString);
        }

        //Validate the total amount of the bets
        var totalFunds = transactionsWithTotal.total;
        var alreadyPendingBetAmount = 0;
        var totalBetAmount = 0;
        for (var i = 0; i < pendingBets.length; i++) {
          console.log("Pending Bet: " + pendingBets[i].id);
          alreadyPendingBetAmount += parseInt(pendingBets[i].amount);
        }
        totalBetAmount += alreadyPendingBetAmount;
        for (var i = 0; i < bets.length; i++) {
          totalBetAmount += parseInt(bets[i].amount);
        }
        var weeklyAllowedBetAmount = (league.weeklyBetAccountRatio * (totalFunds + alreadyPendingBetAmount));
        if (totalBetAmount > weeklyAllowedBetAmount) {
          errors.push("You cannot exceed your bet limit of $" + weeklyAllowedBetAmount + ". This would put you at $" + totalBetAmount + " for the week");
        }

        var rightnow = new Date();
        for (var i = 0; i < bets.length; i++) {
          var gametime = bets[i].bettable.gameTime.replace(/\n/g, " ");
          if (Date.parse(rightnow) > Date.parse(gametime)) {
            errors.push("The bet " + bets[i].bettable.team1 + " vs " + bets[i].bettable.team2 + " has already started");
          }
        }
        cb(errors);
      });
    });

  }

};

