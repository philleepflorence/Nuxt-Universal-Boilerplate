/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Update User Options and Metadata.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/auth
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
		
		__app.debugger.debug('api.controllers.auth.options');
		
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		const debug = req.query.debug;
		let form = req.body.form;
		let user = req.session.user;
		let redirect = req.body.redirect;
		let refresh = req.body.refresh;
		
		const test = await this.test(req, res);
		const responses = _.get(__app.data, 'responses.user.settings');
		
		if (admin && !form) form = test.body.form;		
		if (admin && !user) user = test.body.user;
		
		let endpoint = __app.helpers.core.api.endpoint('user.metadata');
		
		/*
			Update options and metadata!
		*/
						
		let response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
	            form: form
	        },
			result: 'body'
		}, req);
		
		if (response.error) return res.status(400).json({ error: _.get(responses, 'settings-error.value'), response: response.message });
		
		/*
			Authenticate the user and update the metadata
		*/
			
		user = await __app.helpers.core.login.user(user.id, req);
					
		return res.json({
			success: _.get(responses, 'settings-success.value'),
			navigate: redirect,
			refresh: refresh,
			user: user
		});
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: "test",
				token: process.env.APP_TOKEN
			},
			body: {
				form: {
					"age": {
						key: "age",
						value: "30",
						user: 1
					},
					"location": {
						key: "location",
						value: "New York",
						user: 1
					}
				},
				user: {
					id: 1,
					email: "email@philleepflorence.com"
				}
			},
			headers: []
		};
	}
}
