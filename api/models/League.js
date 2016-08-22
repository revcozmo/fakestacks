
module.exports = {
  tableName: 'league',

  schema: true,

  attributes: {
  	name: {
  		type: 'string',
  		required: true
  	},
  	sport: {
  		type: "string",
  		enum: Object.keys(sails.config.sports),
  		defaultsTo: "NFL"
  	},
  	startingAccount: {
  		type: "integer",
  		defaultsTo: 500
  	},
  	weeklyBetAccountRatio: {
  		defaultsTo: 0.5,
  		type: "float"
  	},
  	weeklyBetCountMax: {
  		defaultsTo: 4,
  		type: "integer"
  	},
  	landingMessage: {
  		type: "string",
  		defaultsTo: "Getting your gambling fix while continuing to put food on your family"
  	},
    admin: {
       model: 'user',
       required: true
    }
  },

  beforeCreate: function (values, next) {
    delete values.id;
    var errors = [];
    if (values.weeklyBetAccountRatio<0 || values.weeklyBetAccountRatio>1) {
      errors.push("Weekly Bet Ratio must be between 0 and 1");
    }
    if (values.weeklyBetCountMax<0 || values.weeklyBetCountMax>10) {
      errors.push("Weekly Bet Count Max must be between 0 and 10");
    }
    if (values.name == null || values.name.trim().length == 0) {
      errors.push("You must create a league name");
    }
    if (Object.keys(sails.config.sports).indexOf(values.sport) == -1) {
      errors.push(values.sport + "is not a valid sport type at this time");
    }
    if (errors.length > 0) {
      return next({err: errors});
    }
    next();
  }
};

