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

  	gambler: {
      model: 'Gambler',
  		required: true
  	},
  	bettable: {
  		model: 'Bettable',
  		required: true
  	},
  	time: {
      type: 'ref',
      columnType: 'timestamp',
  		required: true
  	},
  	amount: {
  		type: "number",
      columnType: "integer",
  		required: true
  	},
    sideId: {
      type: "string",
      required: false
    },
    overunder: {
      type: 'string',
      isIn: ['OVER','UNDER'],
      required: false
    },
    line: {
      type: 'string',
      required: true
    },
    outcome: {
      type: 'string',
      isIn: ['WIN','LOSS','PUSH'],
      required: false
    },
    complete: {
      type: 'boolean',
      defaultsTo: false
    },
    archived: {
      type: 'boolean',
      defaultsTo: false
    },
  }
};

