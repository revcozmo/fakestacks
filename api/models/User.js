/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'users',

  schema: true,

  attributes: {
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string', //TODO: This is no longer email. Need to validate that this checks email address formatting
      required: true,
      unique: true,
    },
    gamblers: {
      collection: 'gambler',
      via: 'user'
    },
    encryptedPassword: {
      type: 'string'
    },
    notifyprocessedbets: {
      type: 'boolean',
      defaultsTo: true
    },
    lastVisitedLeague: {
      model: 'League'
    },
  },

  customToJSON: function () {
    var obj = _.omit(this, ['password', 'confirmation', 'encryptedPassword', '_csrf'])
    obj.fullName = obj.firstName + " " + obj.lastName;
    return obj;
  },

  //TODO: Figure out another way to verify that password == confirmation
  // types: {
  //   confirmationmatch: function() {
  //     return this.password === this.confirmation;
  //   }
  // },

  validationMessages: { //hand for i18n & l10n
    email: {
      required: 'Email is required',
      email: 'Provide valid email address',
      unique: 'This email address is already taken',
      confirmationmatch: 'Password does not match password confirmation' //This is a hack, but need this check to happen on password matches
    },
    firstName: {
      required: 'First name is required'
    },
    lastName: {
      required: 'Last name is required'
    }
  },

  beforeCreate: function(values, next) {
    delete values.id;
    values.email = values.email.toLowerCase();

    next();
  },

  beforeUpdate: function(values, next) {
    if (!values.password_update) {
      return next();
    }

    next();
  },

  visitLeague: async function(userId, leagueId) {
    let updatedUsers = await User.update({id: userId}).set({lastVisitedLeague: leagueId}).fetch();
    console.log("VISITED LEAGUE: " + updatedUsers); //TODO: Get rid of this
  },

};
