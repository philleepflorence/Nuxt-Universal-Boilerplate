/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller - Compile
 * @description :: Express Server Controller - Reload Application Comiled Data
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/webhooks
 * @method 		:: GET
 * @requires 	:: env.APP_WEBHOOKS_TOKEN
 *
 */

import _ from 'lodash';

module.exports = {
	method: 'POST',
	token: process.env.APP_WEBHOOKS_TOKEN,
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.webhooks.compile');
		
		const find = req.query.find;
		
		__app.data = await __app.helpers.core.app.initialize(req, res, false);
		
		if (find) return res.json(_.get(__app.data, find));
				
		return res.json(__app.data);
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				token: process.env.APP_WEBHOOKS_TOKEN
			}
		};
	}
}