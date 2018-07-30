/**
 * BetService
 */

module.exports = {

	getBetTallies: function(bets, startingAccount) {
		var runningTally = startingAccount;

		var vigPct = 1/11;

		var pendingTally = 0;
		var winTally = 0;
		var lossTally = 0;
		var pushTally = 0;
		var vigTally = 0;
		for (var j=0; j<bets.length; j++) {
			var bet = bets[j];
			if (bet.outcome === 'WIN') {
				winTally++;
				runningTally += bet.amount;
				vigTally += vigPct * bet.amount;
			}
			else if (bet.outcome === 'LOSS') {
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
			vigLoss: vigTally,
			pending: pendingTally,
			wins: winTally,
			losses: lossTally,
			pushes: pushTally,
			record: winTally+"-"+lossTally+"-"+pushTally
		};
	}

}
