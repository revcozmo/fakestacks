/**
 * Transaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'transactions',

  schema: true,

  attributes: {
    gambler: {
      model: 'Gambler',
      required: true
    },
    amount: {
      type: 'number',
      required: true
    },
    bet: {
      model: 'Bet'
    },
    bettable: {
      model: 'Bettable'
    },
    archived: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  beforeCreate: function (values, next) {
    delete values.id;
    next();
  },

  getTransactionsWithTally: function (gamblerId, cb) {
    Transaction.find()
      .where({gambler: gamblerId, archived: false})
      .sort('createdAt asc')
      .populate('bet')
      .populate('bettable')
      .exec(function foundTransactions(err, transactions) {
        if (err) cb(err);
        if (!transactions) return [];
        var totalTally = 0;
        for (var i = 0; i < transactions.length; i++) {
          var transaction = transactions[i];
          totalTally += parseInt(transaction.amount);
          transaction.tally = totalTally;
        }
        cb(null, {transactions: transactions, total: totalTally});
      });
  },

  updateUserMoney: function (session, amount, cb) {
    if (!session.gambler_money) {
      Transaction.getTransactionsWithTally(session.Gambler.id, function (err, transactionsWithTally) {
        if (err) {
          console.error("Bad stuff man. No transactions");
        }
        session.gambler_money = transactionsWithTally.total;
        cb();
      })
    }
    else {
      session.gambler_money += amount;
      cb();
    }
  }

};

