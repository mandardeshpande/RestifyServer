var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var ContactSchema = new mongoose.Schema({
	email: {
    	type: String,
   		required: true,
    	trim: true
  	},

  	contactName: {
  		type: String,
  		required: true,
  		trim: true
  	},

  	contactEmail: {
  		type: String,
  		required: true,
  		trim: true
  	},

  	date: {
  		type: Date,
  		required: true,
  		trim: true
  	},

  	type: {
  		type: String,
  		required: true,
  		trim: true
  	}

});

// ContactSchema.pre('save', function (next) {
//   var contact = this;
//   bcrypt.hash(contact.date, 10, function (err, hash){
//     if (err) {
//       return next(err);
//     }
//     contact.password = hash;
//     next();
//   })
// });

var Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
