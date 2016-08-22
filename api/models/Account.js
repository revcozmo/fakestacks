//
// module.exports = {
//   tableName: 'account',
//
//   schema: true,
//
//   attributes: {
//
//   	firstName: {
//   		type: 'string',
//   		required: true
//   	},
//   	lastName: {
//   		type: 'string',
//   		required: true
//   	},
//   	email: {
//   		type: 'email',
//   		required: true,
//   		unique: true
//   	},
//   	encryptedPassword: {
//   		type: 'string'
//   	},
//   	// users: {
//    //      collection: 'User',
//    //      via: 'user'
//    //  },
//
//   	toJSON: function() {
//   		var obj = this.toObject();
//   		delete obj.password;
//   		delete obj.confirmation;
//   		delete obj.encryptedPassword;
//   		delete obj._csrf;
//   		return obj;
//   	}
//
//   },
//
//   beforeCreate: function(values, next) {
//     delete values.id;
//     if (!values.password || values.password != values.confirmation) {
//       return next({err: ["Password doesn't match password confirmation"]});
//     }
//     values.email = values.email.toLowerCase();
//
//     var encryptedPassword = require('password-hash').generate(values.password);
//     values.encryptedPassword = encryptedPassword;
//     next();
//   },
//
//   beforeUpdate: function(values, next) {
//     if (!values.password_update) {
//       return next();
//     }
//     if (!values.password || values.password != values.confirmation) {
//       return next({err: ["Password doesn't match password confirmation"]});
//     }
//
//     var encryptedPassword = require('password-hash').generate(values.password);
//     values.encryptedPassword = encryptedPassword;
//     next();
//   }
//
// };
//
//
