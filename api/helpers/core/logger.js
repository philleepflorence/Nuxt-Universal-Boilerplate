/**
 * Logger Helper
 *
 * @author :: Philleep Florence
 * @module      :: Logger Helper
 * @description :: Logger Helper - Activates or deactivates logging
 * @docs        :: https://github.com/quirkey/node-logger
 *
 */
 
const winston = require('winston');

module.exports = function (debug) {
	
	if (debug) console.log("\n\n\n\n");
	
	if (__app.debugger) return __app.debugger;
	
	__app.debugger = winston.createLogger({
		level: debug ? 'silly' : 'error',
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.splat(),
			winston.format.simple()
		),
		transports: [new winston.transports.Console()]
	});
	
	return __app.debugger;
}