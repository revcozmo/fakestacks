/**
 * Bettable
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'bettable',

  schema: true,

  attributes: {
    sport: {
      type: "string",
      enum: Object.keys(sails.config.sports),
      required: true
    },
    gameKey: {
  		type: 'string',
  		required: true
  	},
  	gameTime: {
  		type: 'datetime',
  		required: true
  	},
    sideId1: {
      type: 'integer',
      required: true
    },
    sideId2: {
      type: 'integer',
      required: true
    },
  	team1: {
  		type: 'string',
  		required: true
  	},
  	team2: {
  		type: 'string',
  		required: true
  	},
  	team1MoneyLine: {
  		type: 'string'
  	},
  	team2MoneyLine: {
  		type: 'string'
  	},
  	team1Spread: {
  		type: 'string'
  	},
  	team2Spread: {
  		type: 'string'
  	},
    overunder: {
      type: 'string'
    },
    ouoff: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    off: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },

  	toJSON: function() {
  		var obj = this.toObject();
  		return obj;
  	}

  },

  beforeCreate: function(values, next) {
    delete values.id;
    Bettable.findByGameKey(values.gameKey, function foundBettable(err, foundBettables) {
        if (err) return next(err);
        if (foundBettables == null || foundBettables.length == 0) {
          next();
        }
        else {
          console.log("Duplicate gameKey, skipping...");
          return;
        }
    });
  },

  updateOrCreate: function(gameKey, bettable) {
    Bettable.findOneByGameKey(gameKey, function foundBettable(err, foundBettable) {
      if (foundBettable) {
        Bettable.update({gameKey: gameKey}, bettable, function bettableCreated(err, updatedBettable) {
          if (err) {
            console.log(err);
          }
          console.log("Updated bettable " + gameKey);
        });
      }
      else {
        Bettable.create(bettable, function bettableCreated(err, createdBettable) {
          if (err) {
            console.log(err);
          }
          console.log("Added bettable " + gameKey);
        });
      }
    });
  }

};
