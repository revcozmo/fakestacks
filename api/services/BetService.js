/**
 * BetService
 */

module.exports = {

	getBetTallies: function(bets) {
		var runningTally = sails.config.league.startingAccount;
		var pendingTally = 0;
		var winTally = 0;
		var lossTally = 0;
		var pushTally = 0;
		for (var j=0; j<bets.length; j++) {
			var bet = bets[j];
			if (bet.win === true) {
				winTally++;
				runningTally += bet.amount;
			}
			else if (bet.win === false) {
				lossTally++;
				runningTally -= bet.amount;
			}
			else if (bet.complete === false) {
				pendingTally += bet.amount;
			}
			else {
				pushTally++;
			}
		}
		return {
			money: runningTally,
			pending: pendingTally,
			wins: winTally,
			losses: lossTally,
			pushes: pushTally,
			record: winTally+"-"+lossTally+"-"+pushTally
		};
	}

}