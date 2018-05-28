/**
 * Module Dependencies
 */
const config = require('./config');
const restify = require('restify');
const mongoose = require('mongoose');
const restifyPlugins = require('restify-plugins');
const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*']
})
/**
  * Initialize Server
  */
const server = restify.createServer({
	name: config.name,
	version: config.version,
});

/**
  * Middleware
  */
restifyBodyParser = require('restify-plugins').bodyParser,
restifyAcceptParser = require('restify-plugins').acceptParser,
restifyQueryParser = require('restify-plugins').queryParser,
restifyFullResponse = require('restify-plugins').fullResponse;

server.pre(cors.preflight)
server.use(cors.actual)
server.use(restifyBodyParser());
server.use(restifyAcceptParser(server.acceptable));
server.use(restifyQueryParser({ mapParams: true }));
server.use(restifyFullResponse());


/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, () => {
	// establish connection to mongodb
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri);

	const db = mongoose.connection;

	db.on('error', (err) => {
	    console.error(err);
	    process.exit(1);
	});

	db.once('open', () => {	    
	    require('./routes').init(server);
	    console.log(`Server is listening on port ${config.port}`);
	});
});
