/**
 * Module Dependencies
 */
const errors = require('restify-errors');

/**
 * Model Schema
 */
const model_routes = require('./model_routes');
const auth_routes = require('./auth_routes');
const contact_routes = require('./contact_routes');

module.exports = {
	init : function (server){		
		model_routes(server);
		auth_routes(server);
		contact_routes(server);
	}
};    
