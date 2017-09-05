/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    //List out admin functions
    index: function(req, res, next) {
        var moment = require('moment');
        var league = req.session.User.league;
        User.find().where({ league: league.id }).exec(function foundUsers(err, usersInLeague) {
            var userIdsInLeague = usersInLeague.map(u => u.id);
            Bet.find().where({user: userIdsInLeague, archived: false, complete: true}).sort({time: 'asc'}).populate('bettable').populate('user').exec(function foundBets(err, bets) {
                if (err) return next(err);
                if (!bets) return next();
                res.view({bets: bets, moment: moment});
            });
        });
    },

    undoTransaction: function(req, res, next) {
        var data = {complete: false, win: null};
        Bet.update(req.param('id'), data, function updatedBet(err, bet) {
            Transaction.find({
                where: { bet: req.param('id') },
                limit: 2,
                sort: 'createdAt DESC'
            }).exec(function foundTransactions(err, transactions) {
                if (err) return next(err);
                if (transactions.length == 2) {
                    Transaction.destroy(transactions[0].id, function destroyedTransaction(err) {
                        if (err) return next(err);
                        console.log("Transaction undone for bet with ID " + req.param('id'));
                        res.redirect('/admin');
                    })
                }
                else {
                    res.redirect('/admin');
                }
			});
        });
    }

};

