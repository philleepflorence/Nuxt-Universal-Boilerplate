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
		
		__app.debugger.debug('api.controllers.auth.credentials');
		
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		const debug = req.query.debug;
		let form = req.body.form;
		const test = await this.test(req, res);
		const responses = _.get(__app.data, 'responses.auth.credentials');
		
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
		
		let user = _.get(response, 'data.0');
		
		if (response.error || !user) return res.status(400).json({ error: _.get(responses, 'credentials-error.value'), response: response.message });
		
		if (debug === 'test') return res.json(response);
		
		user = await __app.helpers.core.user(user, 'account', req);
		
		let link = _.get(response, 'meta.link');
		
		let message = form.email_access === true ? _.get(responses, 'credentials-success-reset.value') : _.get(responses, 'credentials-success.value');
			redirect = link && form.email_access === true ? link.replace(process.env.SERVER_DOMAIN, '') : redirect;
			
		if (!redirect) redirect = _.get(__app.data, 'pages.login.path');
		
		return res.json({
			message: message,
			navigate: redirect,
			user: user.id
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
