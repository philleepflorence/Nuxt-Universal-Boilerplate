/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller - View
 * @description :: Express Server Controller - View Node Cache Objects
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
		
		__app.debugger.info('api.controllers.cache.view');
		
		if (!__app.cache) return res.status(503).json({
			error: "Unable to load cache!"
		});
		
		let keys = __app.helpers.core.cache.$.keys();
		let response = {};
		
		if (Array.isArray(keys)) keys.forEach((key) => { _.set(response, key, __app.helpers.core.cache.$.get(key)) });
		
		__app.debugger.info('api.controllers.cache.view - KEYS: `%s`', keys.toString());
				
		return res.json(response);
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