/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Add or create user account information.
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
		
		__app.debugger.debug('api.controllers.auth.register');
		
		const debug = req.query.debug;
		const admin = debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		let form = req.body.form;
		
		const test = await this.test(req, res);
		
		if (admin && !form) form = test.body.form;	
		
		const responses = _.get(__app.data, 'labels.app.form.auth');
		const redirect = req.session.redirect || req.body.redirect || _.get(__app.data, "redirects.route.register.url");
		const notifications = _.get(__app.data, "notifications.register");
		const previews = [];
	
		form.link = form.link || ( process.env.SERVER_DOMAIN + _.get(__app.data, 'redirects.route.confirm.url') );
		
		let endpoint = __app.helpers.core.api.endpoint('auth.register');
	
		const validations = _.get(__app.config.form.validations, 'register');		
		const validate = __app.helpers.core.validator(form, validations, req);
		
		if (validate.error) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'register-error-invalid.value'),
				list: validate.error
			});
		}
		
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
	            form: form,
				notifications: true
	        },
			result: 'body'
		}, req);
		
		if (!response.user || response.error) return res.status(400).json({
			error: _.get(responses, 'register-error.value'),
			message: response.error
		});
		
		const user = await __app.helpers.core.user(response.user, "session", req); 
		
		req.session.registered = user;  
    
	    _.forEach(user, function (value, label)
	    {
		    previews.push({
				value: value,
				label: _.startCase(label)
			});
	    }); 	
        
        if (_.size(notifications)) 
        {
	        endpoint = __app.helpers.core.api.endpoint('notifications');
	        
	        __app.helpers.core.api.connect({
				method: 'post',
				url: endpoint,
				send: {
					form: {
				        params: {
					        notifications: _.get(notifications, 'id')
				        },
				        user: user,
				        editor: user,
				        preview: previews,
				        response: response.data,
				        users: true
			        }
				},
				result: 'body'
			}, req);
        }  
        
        return res.json({
            message: _.get(responses, 'register-success.value'),
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
					first_name: "Philleep",
					last_name: "Florence",
					username: "PhilleepEdit",
					email: "webmaster@philleepedit.com",
					password: "philleepedit",
					confirm_password: "philleepedit",
					location: "Brooklyn, NY",
					telephone: "+18009859250"
				}
			},
			headers: []
		};
	}
}
