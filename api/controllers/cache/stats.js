/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Gets Node Cache Statistics
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
		
		__app.debugger.debug('api.controllers.cache.stats');
		
		if (!__app.helpers.core.cache.$) return res.status(503).json({
			error: "Unable to load cache!"
		});
		
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