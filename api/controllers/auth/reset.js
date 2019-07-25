/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Reset user account credentials.
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
		
		__app.debugger.info('api.controllers.auth.reset');
		
		const debug = req.query.debug;
		const admin = debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		let form = req.body.form;
		
		const test = await this.test(req, res);
		
		if (admin && !form) form = test.body.form;		
		
		const responses = _.get(__app.data, 'labels.app.form.auth');
		const redirect = req.session.redirect || req.body.redirect || _.get(__app.data, "redirects.route.reset.url");
		
		let endpoint = __app.helpers.core.api.endpoint('auth.reset');
	
		const validations = _.get(__app.config.form.validations, 'reset');		
		const validate = __app.helpers.core.validator(form, validations, req);
		
		if (validate.error) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'reset-error-invalid.value'),
				list: validate.error
			});
		}
		
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
	            form: form
	        },
			result: 'body'
		}, req);
		
		if (!response.user || response.error) return res.status(400).json({
			error: _.get(responses, 'reset-error.value'),
			message: response.error
		});	
		
		const user = await __app.helpers.core.login.user(response.user.id, req, res);     
        
        return res.json({
            message: _.get(responses, 'reset-success.value'),
            success: true,
            navigate: redirect,
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
					token: "72611bcb",
					email: "webmaster@philleepedit.com",
					password: "philleepedit",
					confirm_password: "philleepedit",
					secret_question: "What is the name of the API?",
					secret_answer: "Directus"
				}
			},
			headers: []
		};
	}
}
