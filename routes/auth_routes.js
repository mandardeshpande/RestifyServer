/**
 * Module Dependencies
 */
const errors = require('restify-errors');
const auth_header = require('../utils/auth_header');

/**
 * Model Schema
 */
const User = require('../models/users');
const bcrypt = require('bcrypt');

function _setSessionCookie (resp, info) {
    resp.setCookie('sessionToken', info.sessionToken, { maxAge: 900000, httpOnly: true });
    resp.setCookie('userId', info.objectId, { maxAge: 900000, httpOnly: true });
}


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
		if(!auth_header(req.headers['authorization'])) {
			
				var err = new Error('authorization failed.');
				console.error(err);
        		res.send(401); next();
        		return;
		}

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
        		console.error(err);
        		res.send(401);
        		return;
      		}
      		
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
        	let info = {
			sessionToken: Math.random().toString(12).substring(2, 20),
			objectId: user.email
		}
		_setSessionCookie(res, info);
          res.send({login: true, message:'login success'});          
          next();
        } else {
          res.send({login: false, message:'please check credentials'});          
          next();
        }
      })
    });

	});


	server.post('/logout', (req, res, next) => {
		res.clearCookie('sessionToken');
		res.clearCookie('objectId');
		res.send({login: false, message:'logout success'});          
        next();
	});



};    
