/**
 * Gambler.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'gamblers',

  schema: true,

  attributes: {
    user: {
      model: 'User'
    },
    league: {
      model: 'League'
    },
    bets: {
      collection: 'Bet',
      via: 'gambler'
    },
  },

  getForUserAndLeague: async function(userId, leagueId) {
    const gambler = await Gambler.findOne({user: userId, league: leagueId});
    return gambler;
  },

};

