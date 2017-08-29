/**
 * TransactionController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  show: function (req, res, next) {
    var moment = require('moment');
    var userId = req.param('id');
    var league = req.session.User.league;
    var userId = userId ? userId : req.session.User.id;
    Bet.find().where({user: userId, archived: false}).sort({time: 'asc'}).populate('bettable').populate('user').exec(function foundBets(err, bets) {
      if (err) return next(err);
      if (!bets) return next();
      var runningTally = league.startingAccount;
      for (var i = 0; i < bets.length; i++) {
        var bet = bets[i];
        if (bet.win === true) {
          runningTally += bet.amount;
        }
        else if (bet.win === false) {
          runningTally -= bet.amount;
        }
        bet.tally = runningTally;
      }
      var tallies = BetService.getBetTallies(bets, league.startingAccount);
      tallies.bets = bets;
      if (bets.length == 0) {
        User.findOne(userId, function foundUser(err, user) {
          tallies.user = user;
          tallies.moment = moment;
          res.view(tallies);
        });
      }
      else {
        tallies.user = bets[0].user;
        tallies.moment = moment;
        res.view(tallies);
      }
    });
  }
};

