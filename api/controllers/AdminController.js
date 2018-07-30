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
        var league = req.session.Gambler.league;
        Gambler.find().where({ league: league.id }).populate('user').exec(function foundUsers(err, gamblersInLeague) {
            let gamblersIdsInLeague = gamblersInLeague.map(g => g.id);
            Bet.find().where({gambler: gamblersIdsInLeague, archived: false, complete: true}).sort({time: 'asc'}).populate('bettable').populate('gambler').exec(function foundBets(err, bets) {
                if (err) return next(err);
                if (!bets) return next();
                res.view({bets: bets, moment: moment});
            });
        });
    },

    undoTransaction: function(req, res, next) {
        var data = {complete: false, outcome: null};
        Bet.update(req.param('id'), data, function updatedBet(err, bet) {
            Transaction.find({
                where: { bet: req.param('id') },
                limit: 2,
                sort: 'createdAt DESC'
            }).exec(async function foundTransactions(err, transactions) {
                if (err) return next(err);
                if (transactions.length == 2) {
                    var destroyedTransactions = await Transaction.destroy({id: transactions[0].id}).fetch();
                    Transaction.updateUserMoney(req.session, destroyedTransactions[0].amount, function() {
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

