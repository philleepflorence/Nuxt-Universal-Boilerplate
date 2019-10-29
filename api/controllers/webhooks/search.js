/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Webhook to update the Search Cache in the API
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/webhooks
 * @method 		:: POST
 *
 */

import _ from 'lodash';

module.exports = {
	method: 'POST',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		const debug = req.query.debug;
		const token = req.query.token;
		const collection = req.query.collection || req.body.collection;
		
		__app.debugger.debug(`api.controllers.webhooks.search - collection: ${ collection }`);
		
		let endpoint = __app.helpers.core.api.endpoint('search.cache');
		let config = __app.helpers.core.api.collection(`${ collection }.cache`);
		let timer = _.get(__app, `timers.cache.${ collection }`);
		
		if (req.query.endpoint && token === process.env.APP_WEBHOOKS_TOKEN) {
			endpoint = req.query.endpoint;
		}
		
		let params = {
			debug: debug,
			endpoint: endpoint,
			collection: collection,
			config: config
		};
		
		if (timer) {
			clearTimeout(timer);
		}
		else if (!timer) {
			_.set(__app, `timers.cache.${ collection }`, Date.now());
			timer = _.get(__app, `timers.cache.${ collection }`);
		}
		
		timer = setTimeout((params) => {	
			
			__app.debugger.debug(`api.controllers.webhooks.search.timer - collection: ${ collection }`);
								
			__app.helpers.core.api.connect({
				method: 'post',
				url: params.endpoint,
				send: params.config,
				result: 'body'
			}, req);
		}, 
		10000, params);	
		
		return res.json(params);
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: 'test'
			},
			body: {
				token: process.env.APP_WEBHOOKS_TOKEN
			},
			headers: []
		};
	}
}
