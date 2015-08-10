/**
* Bet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'bet',
  adapter: 'mysql',
  schema: true,

  attributes: {

  	userId: {
  		type: 'integer',
  		required: true
  	},
  	bettableId: {
  		type: 'integer',
  		required: true
  	},
  	time: {
  		type: 'datetime',
  		required: true
  	},
  	amount: {
  		type: 'integer',
  		required: true
  	},
    betId: {
      type: 'integer',
      required: true
    },
  	team: {
  		type: 'string',
  		required: true
  	},
  	moneyline: {
  		type: 'string'
  	},
  	spread: {
  		type: 'string',
      required: true
  	},

  	toJSON: function() {
  		var obj = this.toObject();
  		return obj;
  	}
  }
};

