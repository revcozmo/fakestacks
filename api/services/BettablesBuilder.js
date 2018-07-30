/**
 * BettablesBuilder
 */

module.exports = {

  buildBettablesForSport: function (sportKey) {
    try {
      console.log("Retrieving bettables for " + sportKey);
      SportsBookGateway.getBettables(sportKey, function (error, bettables) {
        if (error) {
          console.log(error);
          return;
        }
        else {
          bettables.forEach(function (bettable) {
            Bettable.updateOrCreate(bettable.gameKey, bettable);
          });
        }
      });
    }
    catch (err) {
      console.log("ERROR RETRIEVING BETTABLES: " + err);
    }
  },

};
