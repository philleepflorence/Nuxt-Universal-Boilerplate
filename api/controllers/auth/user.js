/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Get user using any number of parameters
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/auth
 * @method 		:: GET
 *
 */

import _ from 'lodash';

module.exports = {
	method: 'GET',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.auth.user');
		
		const debug = req.query.debug;
		const admin = debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		let form = req.query.form;
		
		const test = await this.test(req, res);
		
		if (admin && !form) form = test.query.form;
		
		let endpoint = __app.helpers.core.api.endpoint('items', { collection: 'users.rows' });
		let query = {
			limit: 1,
            filter: form,
            fields: '*.*.*'
        };
		
		let response = await __app.helpers.core.api.connect({
			method: 'get',
			url: endpoint,
			query: query,
			result: 'body'
		}, req);
		
		response = _.get(response, 'data.0');
		
		if (!response || !response.id) return res.status(404).send();
		
		const user = await __app.helpers.core.user(response, 'account', req);
		
		return res.json(user);
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: "test",
				token: process.env.APP_TOKEN,
				form: {
					email: "email@philleepflorence.com"
				}
			},
			headers: []
		};
	}
}
