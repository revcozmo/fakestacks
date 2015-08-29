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
      defaultTo: null
    },

  	toJSON: function() {
  		var obj = this.toObject();
  		return obj;
  	}
  },

  beforeCreate: function(values, next) {
    var errors = [];
    //FIXME: Need to have the actual number of pending bets for this user
    console.log(values);
    console.log("values.length" + values.length);
    console.log("MAX: " + parseInt(sails.config.league.weeklyBetCountMax));
    if (values.length > parseInt(sails.config.league.weeklyBetCountMax)) {
      errors.push("You cannot exceed " + sails.config.league.weeklyBetCountMax + " bets for the week");
    }
    //TODO: Invalidate against total money with sails.config.league.weeklyBetAccountRatio
    //TODO: Make sure none of these bets have already started
    //TODO: Make sure none of these bets have been updated
    if (errors.length > 0) {
      return next({err: errors});
    }
    next();
  }
};

