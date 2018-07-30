/**
* Notification.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'notification',

  schema: true,

  attributes: {
    scope: {
      type: "string",
      defaultsTo: "Bet.tableName",
    },
    refId: {
      type: "number",
      columnType: "integer",
      required: true
    },
    action: {
      type: "string"
    },
    user: {
      model: 'User',
      required: true
    },
    sent: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};

