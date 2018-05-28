/**
 * Module Dependencies
 */
const errors = require('restify-errors');

/**
 * Model Schema
 */
const Todo = require('../models/todo');

module.exports = function(server) {

	/**
	 * POST
	 */
	server.post('/todos', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'")
			);
		}

		let data = req.body || {};

		console.log(req.body);	
		let todo = new Todo(data);
		todo.save(function(err) {
			if (err) {
				console.error(err);
				return next(new errors.InternalError(err.message));
				next();
			}

			res.send(201);
			next();
		});
	});

	// /**
	//  * LIST
	//  */
	server.get('/todos', (req, res, next) => {
		Todo.apiQuery(req.params, function(err, docs) {
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message)
				);
			}

			res.send(docs);
			next();
		});
	});
};    
