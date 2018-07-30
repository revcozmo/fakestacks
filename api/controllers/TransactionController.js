/**
 * TransactionController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  show: async function (req, res, next) {
    var moment = require('moment');
    var gamblerId = req.param('id');
    var league = req.session.League;
    var gambler = gamblerId ? gamblerId : req.session.Gambler.id;
    Bet.find().where({gambler: gamblerId, archived: false}).sort('time asc').populate('bettable').populate('gambler').exec(async function foundBets(err, bets) {
      if (err) return next(err);
      if (!bets) return next();
      var runningTally = league.startingAccount;
      for (var i = 0; i < bets.length; i++) {
        var bet = bets[i];
        if (bet.outcome === 'WIN') {
          runningTally += bet.amount;
        }
        else if (bet.outcome === 'LOSS') {
          runningTally -= bet.amount;
        }
        bet.tally = runningTally;
      }
      var tallies = BetService.getBetTallies(bets, league.startingAccount);
      tallies.bets = bets;
      if (bets.length == 0) {
        var gamblers = await Gambler.find().limit(1).where({id: gamblerId}).populate('user');
        tallies.gambler = gamblers[0];
        tallies.moment = moment;
        res.view(tallies);
      }
      else {
        tallies.gambler = bets[0].gambler;
        tallies.moment = moment;
        res.view(tallies);
      }
    });
  }
};

