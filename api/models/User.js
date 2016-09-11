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
      type: 'email',
      required: true,
      unique: true
    },
    league: {
      model: 'League'
    },
    admin: {
      type: 'boolean',
      defaultsTo: false
    },
    encryptedPassword: {
      type: 'string'
    },
    bets: {
      collection: 'Bet',
      via: 'user'
    },

    getFullName: function() {
      return this.firstName + " " + this.lastName;
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      obj.fullName = this.getFullName();
      return obj;
    }

  },

  validationMessages: { //hand for i18n & l10n
    email: {
      required: 'Email is required',
      email: 'Provide valid email address',
      unique: 'This email address is already taken'
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
    if (!values.password || values.password != values.confirmation) {
      return next({err: ["Password doesn't match password confirmation"]});
    }
    values.email = values.email.toLowerCase();

    var encryptedPassword = require('password-hash').generate(values.password);
    values.encryptedPassword = encryptedPassword;
    next();
  },

  beforeUpdate: function(values, next) {
    if (!values.password_update) {
      return next();
    }
    if (!values.password || values.password != values.confirmation) {
      return next({err: ["Password doesn't match password confirmation"]});
    }

    var encryptedPassword = require('password-hash').generate(values.password);
    values.encryptedPassword = encryptedPassword;
    next();
  }

};
