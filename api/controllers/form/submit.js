/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - General Form Submission Controller
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/form
 * @method 		:: POST
 *
 */

import {
	forEach,
	get,
	size,
	template as _template, 
	templateSettings
} from 'lodash';

import uuid from 'uuid-by-string';

module.exports = {
	method: 'POST',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.form.submit');
				
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		let form = req.body.form;
		let test = await this.test(req, res);
		let referer = req.headers.referrer || req.headers.referer;
		
		if (admin && !form) form = test.body.form;
		
		const formname = form.form;
				
		let notifications = req.body.notifications || form.notification || formname;
			notifications = get(__app.data, `notifications.${ notifications }.email`);
			
		let responses = req.body.responses || form.responses || formname;		
			responses = get(__app.data, `responses.form.${ responses }`);
			responses = responses || get(__app.data, `responses.form.responses`);
		
		if (!size(form))	
		{
			return res.status(400).json({
				error: true,
				message: get(responses, 'process-error-empty.value')
			});
		}
		
		if (!form.notification && notifications) form.notification = notifications;
		
		let template = req.body.template || form.template || get(form, 'notification.template') || formname;		
			template = get(__app.data, `templates.${ template }`);
		
		let inputs = get(__app.config.form, `inputs.${ formname }`);		
		let methods = get(__app.config.form, `methods.${ formname }`);
		
		if (inputs) form = Object.assign(form, inputs);
		
		if (methods) form = methods(form, template);
		const redirect = req.body.redirect;
		
		/*
			Validate form data
		*/
		
		const validations = get(__app.config.form.validations, formname);		
		const validate = __app.helpers.core.validator(form, validations);
		
		__app.debugger.debug('api.controllers.form.submit - validate');
		
		if (validate.error) 
		{
			return res.json({
				error: true,
				message: get(responses, 'error-invalid.value'),
				list: validate.error
			});
		}
		
		form.ip_address = req.ip_address;
		form.uuid = form.uuid || uuid(Date.now() + JSON.stringify(form));
		form.url = form.url || referer;
		
		let endpoint = __app.helpers.core.api.endpoint('form.submit');
	    
	    /*
		    Create preview using the form inputs
	    */
	    
	    __app.debugger.debug('api.controllers.form.submit - previews');
	    
		let previews = [];
			inputs = get(__app.data, `forms.${ formname }.inputs`);
		
		if (inputs) {
			forEach(inputs, (input) => {
				let property = input.property || input.slug;
				let value = get(form, property);
				
				if (input.preview && value) {
					let compiled = _template(input.preview, { interpolate: /{{([\s\S]+?)}}/g });
						value = compiled(form);
					
					previews.push({
						value: value,
						label: input.value
					});
				}
			});
		}
		
		if (req.query.debug === 'form') return res.json({
			"endpoint": endpoint,
			"form": form,
			"previews": previews,
			"notifications": notifications
		});
				
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
				form: form,
				previews: previews
			},
			result: 'body'
		}, req);
		
		if (!response || response.error) return res.status(502).json({
            error: get(responses, 'error.value'),
            response: response ? response.message : response
        });
        
        if (notifications) 
        {
	        endpoint = __app.helpers.core.api.endpoint('notifications');	
        
			__app.debugger.debug(`api.controllers.form.submit - notifications: ${ endpoint }`);
	        
	        __app.helpers.core.api.connect({
				method: 'post',
				url: endpoint,
				send: {
					form: {
				        params: {
					        notifications: get(notifications, 'id')
				        },
				        user: form,
				        editor: req.me,
				        preview: previews,
				        response: response.data,
				        users: true
			        }
				},
				result: 'body'
			}, req);
        }
        
        return res.status(201).json({
            message: get(responses, 'success.value'),
            success: true,
            navigate: redirect,
            response: response
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
					form: "contact",
					email: "email@philleepflorence.com",
					first_name: "Philleep",
					last_name: "Florence",
					message: "Express Form Submission Controller Unit Test.",
					subject: "General Form Submission Controller"
				}
			}
		};
	}
}
