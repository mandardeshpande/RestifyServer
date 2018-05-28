/**
 * Module Dependencies
 */
const errors = require('restify-errors');

/**
 * Model Schema
 */
const User = require('../models/users');
const bcrypt = require('bcrypt');


module.exports = function(server) {

	/**
	 * POST
	 */
	server.post('/addUser', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			);
		}

		let data = req.body || {};
		
		let user = new User(data);
		user.save(function(err) {
			if (err) {
				console.error(err);
				return next(new errors.InternalError(err.message));
				next();
			}

			res.send(201);
			next();
		});
	});

	server.post('/authenticate', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			);
		}

		let data = req.body || {};		
		let user = new User(data);
		const password = user.password;

		User.findOne({ email: user.email }).exec(function (err, user) {
			if (err) {
        		return callback(err)
      		} else if (!user) {
        		var err = new Error('User not found.');
        		res.send(401);
        		return;
      		}
      		
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          res.send({message:'login success'});          
          next();
        } else {
          res.send({message:'please check credentials'});          
          next();
        }
      })
    });

	});
};    
