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
      isIn: ["CFB","NFL","NBA"],
      required: true
    },
    gameKey: {
  		type: 'string',
  		required: true
  	},
  	gameTime: {
      type: 'ref',
      columnType: 'timestamp',
  		required: true
  	},
    sideId1: {
      type: 'string',
      required: true
    },
    sideId2: {
      type: 'string',
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
      defaultsTo: false
    },
    off: {
      type: 'boolean',
      defaultsTo: false
    },

  },

  updateOrCreate: function(gameKey, bettable) {
    Bettable.findOne({gameKey: gameKey}, function foundBettable(err, foundBettable) {
      if (err) {
        console.error("ERROR on retrieving bettable: " + err);
      }
      if (foundBettable) {
        Bettable.update({gameKey: gameKey}, bettable, function bettableUpdated(err, updatedBettable) {
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
