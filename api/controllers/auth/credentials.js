/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Get user account information via email or username.
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
		
		__app.debugger.info('api.controllers.auth.credentials');
		
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		const debug = req.query.debug;
		let form = req.body.form;
		const test = await this.test(req, res);
		const responses = _.get(__app.data, 'labels.app.form.auth');
		
		if (admin && !form) form = test.body.form;
		
		if (!_.size(form)) return res.status(400).json({ error: _.get(responses, 'credentials-error-invalid.value')});
		
		form.link = form.link || ( process.env.SERVER_DOMAIN + _.get(__app.data, 'redirects.route.credentials.url') );
		
		let redirect = req.body.redirect;
		const validations = __app.config.form.validations.credentials;
		const validate = __app.helpers.core.validator(form, validations);
		
		if (validate.error) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'credentials-error-invalid.value'),
				list: validate.error
			});
		}
				
		const endpoint = __app.helpers.core.api.endpoint('auth.credentials');
						
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
	            form: form
	        },
			result: 'body'
		}, req);
		
		if (response.error) return res.status(400).json({ error: _.get(responses, 'credentials-error.value'), response: response.error });
		
		if (debug === 'test') return res.json(response);
		
		return res.json({
			success: _.get(responses, 'credentials-success.value'),
			navigate: redirect
		});
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: 'test',
				token: process.env.APP_TOKEN
			},
			body: {
				form: {
					email: "email@philleepflorence.com",
					link: ( process.env.SERVER_DOMAIN + _.get(__app.data, 'redirects.route.credentials.url') )
				}
			},
			headers: []
		};
	}
}
