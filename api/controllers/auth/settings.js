/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Update user account and settings information.
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
		
		__app.debugger.debug('api.controllers.auth.settings');
		
		const debug = req.query.debug;
		const admin = debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		let form = req.body.form;
		let user = req.me || req.session.user || {};
		
		const test = await this.test(req, res);
		
		if (admin && !form) form = test.body.form;
		if (admin && !user.id) user = test.body.form;		
		
		const responses = _.get(__app.data, 'labels.app.form.auth', {});
		const redirect = req.session.redirect || req.body.redirect || _.get(__app.data, "redirects.route.settings.url");
	
		if (!form) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'settings-form-empty.value'),
			});
		}
		
		if (!user.id) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'settings-error-login.value'),
			});
		}
	
		if (form.username !== user.username) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'settings-error-user-id.value'),
				form: form
			});
		}
		
		let file = _.get(form, 'image', {});
		
		if (file.data) 
		{
			__app.debugger.debug(`api.controllers.auth.settings.file.upload - FILENAME: ${ file.name }`);
			
			let endpoint = __app.helpers.core.api.endpoint('form.upload');
		
			const response = await __app.helpers.core.api.connect({
				method: 'post',
				url: endpoint,
				send: file,
				result: 'body'
			}, req);
			
			form.image = _.get(response, 'data.id');			
		}
		
		let endpoint = __app.helpers.core.api.endpoint('auth.settings');
	
		const validations = _.get(__app.config.form.validations, 'settings');		
		const validate = __app.helpers.core.validator(form, validations, req);
		
		if (validate.error) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'settings-error-invalid.value'),
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
			error: _.get(responses, 'settings-error.value'),
			response: response.error
		});	
		
		user = await __app.helpers.core.login.user(response.user.id, req, res);    
        
        return res.json({
            message: _.get(responses, 'settings-success.value'),
            success: true,
            redirect: redirect
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
					id: 1,
					first_name: "Philleep",
					last_name: "Florence",
					username: "PhilleepFlorence",
					email: "email@philleepflorence.com",
					location: "Brooklyn, NY",
					telephone: "+18009859250"
				}
			},
			headers: []
		};
	}
}
