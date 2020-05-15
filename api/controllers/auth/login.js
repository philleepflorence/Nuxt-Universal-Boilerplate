/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Authenticate user and set session.
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
		
		__app.debugger.debug('api.controllers.auth.login');
		
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		const debug = req.query.debug;
		let form = req.body.form;
		let redirect = req.body.redirect || _.get(__app.data, 'redirects.route.authenticated.url');
		
		const test = await this.test(req, res);
		const responses = _.get(__app.data, 'responses.auth.login');
		
		if (admin && !form) form = test.body.form;
		
		const validations = _.get(__app.config.form, 'validations.login');		
		const validate = __app.helpers.core.validator(form, validations);
		
		if (validate.error) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'login-error-invalid.value'),
				list: validate.error
			});
		}	
		
		let endpoint = __app.helpers.core.api.endpoint('auth.login');
		
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
	            form: form
	        },
			result: 'body'
		}, req);
		
		if (!_.get(response, 'data.id')) return res.json({
			error: _.get(responses, 'login-error.value'),
			response: response.message
		}); 

		const user = await __app.helpers.core.login.user(response.data.id, req, res, response.data);
		
		return res.json({
			success: _.get(responses, 'login-success.value'),
			redirect: redirect,
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
					username: "webmaster@philleepedit.com",
					password: "philleepedit"
				}
			},
			headers: []
		};
	}
}
