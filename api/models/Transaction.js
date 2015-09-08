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
  	user: {
  		model: 'User',
  		required: true
  	},
  	amount: {
  		type: 'integer',
  		required: true
  	},
  	bet: {
      model: 'Bet'
  	},
    bettable: {
      model: 'Bettable'
    }
  },

  beforeCreate: function(values, next) {
    delete values.id;
    next();
  },

  getTransactionsWithTally: function(userId, cb) {
    Transaction.find()
		.where({'user':userId})
		.sort('createdAt asc')
    .populate('bet')
    .populate('bettable')
		.exec(function foundTransactions(err, transactions) {
			if (err) cb(err);
			if (!transactions) return [];
			var totalTally = 0;
			for (var i=0; i<transactions.length; i++) {
				var transaction = transactions[i];
				totalTally += parseInt(transaction.amount);
        transaction.tally = totalTally;
			}
			cb(null, {transactions: transactions, total: totalTally});
		});
  },

  afterUpdate: function(transaction, cb) {
    console.log(transaction.user);
    Transaction.updateUserMoney(transaction.user, transaction.amount, cb);
  },

  afterCreate: function(transaction, cb) {
    console.log(transaction.user);
    Transaction.updateUserMoney(transaction.user, transaction.amount, cb);
  },

  updateUserMoney: function(userId, amount, cb) {
    console.log("Updating user money for " + userId);
    if (!sails.config.cache.user_money[userId]) {
      Transaction.getTransactionsWithTally(userId, function(err, transactionsWithTally) {
        if (err) {
          //TODO: handle error
        }
        sails.config.cache.user_money[userId] = transactionsWithTally.total;
        sails.config.cache.user_money[userId] += amount;
        cb();
      })
    }
    else {
      sails.config.cache.user_money[userId] += amount;
      cb();
    }
  }

};

