module.exports = {

  indexOfBetInCart: function(bet, cart) {
    for (var i=0; i<cart.length; i++) {
      var existing = cart[i];
      if (CartHelper.betMatches(bet, existing)) {
        return i;
      }
    }
    return -1;
  },

  betMatches: function(bet, existing) {
    const bettableIdMatches = existing.bettable.id == bet.bettableId;
    const sideIdMatches = existing.sideId!=null && existing.sideId == bet.sideId;
    const overPickMatches = existing.overunder!=null && existing.overunder == bet.overunder;
    return bettableIdMatches && (sideIdMatches || overPickMatches);
  }

};
