/**
 * Module Dependencies
 */
const errors = require('restify-errors');

/**
 * Model Schema
 */
const Contact = require('../models/contact');
const bcrypt = require('bcrypt');

module.exports = function(server) {

	/**
	 * POST add contacts
	 */
	server.post('/addContact', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			);
		}

		let data = req.body || {};

		// massage the data 
		for (var i = 0; i < data.ocassions.length; i++) {
			var c = {
				"email": data.email,
				"contactName": data.contactName,
				"contactEmail": data.contactEmail,
				"date": data.ocassions[i].date,
				"type": data.ocassions[i].type

			};

			console.log(c);
			let contact = new Contact(c);
			console.log(contact);

		    contact.save(function(err) {
			if (err) {
				console.error(err);
				return next(new errors.InternalError(err.message));
				next();
			}
		});

		}

		res.send(201);
		next();
	});

	/*
	 *  GET get all contacts of a particular user
	 */
	server.get('/getContacts/:email', (req, res, next) => {
		Contact.find({ "email": req.params.email }, function(err, docs) {
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.message)
				);
			}

			res.send(docs);
			next();
		});
	});

}