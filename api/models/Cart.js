/**
* Cart.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	potentialBets: {
  		type: 'array',
  		required: true
  	}
  },

  addBet: function(potentialBet) {
    potentialBets.push(potentialBet);
    console.log("Added bet to cart. Cart length: " + potentialBets.length);
  },

  getBets: function(potentialBet) {
    return potentialBets;
  }

};

