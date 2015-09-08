/**
* Bet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'bet',
  schema: true,

  attributes: {

  	user: {
      model: 'User',
  		required: true
  	},
  	bettable: {
  		model: 'Bettable',
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
    sideId: {
      type: 'integer',
      required: true
    },
    win: {
      type: 'boolean',
      required: false,
      defaultsTo: null
    },
    complete: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },

  	toJSON: function() {
  		var obj = this.toObject();
  		return obj;
  	}
  }
};

