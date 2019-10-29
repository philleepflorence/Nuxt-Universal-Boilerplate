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

import _ from 'lodash';
import ip from 'ip';
import S from 'string';
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
				
		if (!_.size(form))	
		{
			return res.status(400).json({
				error: true,
				message: _.get(responses, 'error.value'),
				response: "Form object is required!"
			});
		}
		
		const formname = form.form;
		
		let template = req.body.template || formname;		
			template = _.get(__app.data, `templates.${ template }`);
		
		let inputs = _.get(__app.config.form, `inputs.${ formname }`);		
		let methods = _.get(__app.config.form, `methods.${ formname }`);
		
		if (inputs) form = Object.assign(form, inputs);
		
		if (methods) form = methods(form, template);
				
		let notifications = _.get(__app.data, `notifications.${ formname }`);		
		let responses = _.get(__app.data, `labels.app.form.${ formname }`);
		const redirect = req.body.redirect;
		let previews = [];
		
		/*
			Validate form data
		*/
		
		const validations = _.get(__app.config.form.validations, formname);		
		const validate = __app.helpers.core.validator(form, validations);
		
		if (validate.error) 
		{
			return res.json({
				error: true,
				message: _.get(responses, 'error-invalid.value'),
				list: validate.error
			});
		}
		
		form.ip_address = req.ip || ip.address();
		form.uuid = form.uuid || uuid(Date.now() + JSON.stringify(form));
		form.url = form.url || referer;
		
		let endpoint = __app.helpers.core.api.endpoint('form.submit');
	    
	    _.forEach(form, function (value, label)
	    {
		    previews.push({
				value: value,
				label: S(label).humanize().titleCase().s
			});
	    });
		
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
				form: form
			},
			result: 'body'
		}, req);
		
		if (!response || response.error) return res.status(502).json({
            error: _.get(responses, 'error.value'),
            response: response ? response.error : response
        });	
        
        if (notifications) 
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
            message: _.get(responses, 'success.value'),
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
