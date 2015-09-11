/**
 * ValidationService
 */

module.exports = {

	validateBets: function(req, bets, cb) {
		var errors = [];
		
		//Validate the entered bet amounts
		console.log("Validating bets...");
		for (var i=0; i<bets.length; i++) {
			var amount = bets[i].amount;
			if (isNaN(amount)) {
				errors.push(amount + " is not a valid number");
			}
			if (amount < 1) {
				errors.push("You must bet $1 or more on each bet. You bet $" + amount);
			}
			if (errors.length > 0) {
				cb(errors);
			}
		}

		Bet.find().where({user: req.session.User.id, win: null}).exec(function(err, pendingBets) {
			Transaction.getTransactionsWithTally(req.session.User.id, function(err, transactionsWithTotal) {
				//Validate the number of bets
				var numPendingBets = pendingBets.length;
				if ((bets.length + pendingBets.length) > parseInt(sails.config.league.weeklyBetCountMax)) {
					var errorString = "You cannot exceed " + sails.config.league.weeklyBetCountMax + " bets for the week.";
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
				for (var i=0; i<pendingBets.length; i++) {
					console.log("Pending Bet: " + pendingBets[i].id);
					alreadyPendingBetAmount += parseInt(pendingBets[i].amount);
				}
				totalBetAmount += alreadyPendingBetAmount;
				for (var i=0; i<bets.length; i++) {
					console.log("New Bet: " + bets[i].id);
					totalBetAmount += parseInt(bets[i].amount);
				}
				var weeklyAllowedBetAmount = (sails.config.league.weeklyBetAccountRatio * (totalFunds + alreadyPendingBetAmount));
				if (totalBetAmount > weeklyAllowedBetAmount) {
					errors.push("You cannot exceed your bet limit of $" + weeklyAllowedBetAmount + ". This would put you at $" + totalBetAmount + " for the week");
				}

				var rightnow = new Date();
				for (var i=0; i<bets.length; i++) {
					var gametime = bets[i].bettable.gameTime.replace(/\n/g, " ");
					console.log("Now: " + rightnow + ", Game: " + gametime);
					console.log("Now: " + Date.parse(rightnow) + ", Game: " + Date.parse(gametime));
					if (Date.parse(rightnow) > Date.parse(gametime)) {
						errors.push("The bet " + bets[i].bettable.team1 + " vs " + bets[i].bettable.team2 + " has already started");
					}
				}
				//TODO: Make sure none of these bets have been updated
	    		console.log("errors: " + errors);
	    		cb(errors);
			});
		});

	} 
	
};

