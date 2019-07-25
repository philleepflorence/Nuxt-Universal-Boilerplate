/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller - Flush
 * @description :: Express Server Controller - Empty or flush cache without restarting the node server
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/cache
 * @method 		:: GET
 * @requires 	:: env.APP_TOKEN
 *
 */

import _ from 'lodash';

module.exports = {
	method: 'GET',
	token: true,
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.info('api.controllers.cache.flush');
		
		if (!__app.cache) return res.status(503).json({
			error: "Unable to load cache!"
		});
		
		__app.helpers.core.cache.flushAll();
		
		return res.json({
			properties: __app.helpers.core.cache.$.keys(),
			statistics: __app.helpers.core.cache.$.getStats()
		});
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				token: process.env.APP_TOKEN
			}
		};
	}
}