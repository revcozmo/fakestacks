/**
* Transaction.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'transactions',
  adapter: 'mysql',

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

};

