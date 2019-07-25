/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Updates a collection in the API as well as related collections including file upload.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/form
 * @method 		:: POST
 *
 */

import _ from 'lodash';
import bytes from 'bytes';
import moment from 'moment';
import S from 'string';

module.exports = {
	method: 'POST',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.info('api.controllers.form.update');
		
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		let form = req.body.form;
		let joins = req.body.joins;
		let params = req.body.params || {};
		let test = await this.test(req, res);
		
		if (admin && !form) form = test.body.form;		
		if (admin && !joins) joins = test.body.joins;	
		if (admin && !_.size(params)) params = test.body.params;
				
		if (!_.size(form)) return res.status(400).send("Form object is required!");			
		
		const formname = params.form;
		let collection = params.collection;
		let preview = params.preview;
		let tagspreview = params.tagspreview;
		let user = _.get(req.me, 'id');
		
		let	responses = params.responses ? _.get(__app.data, params.responses) : _.get(__app.data, `labels.${ formname }.form.responses`);
			responses = responses ? responses : _.get(__app.data, 'labels.app.form.responses');
		let	labels = params.labels ? _.get(__app.data, labels) : _.get(__app.data, `labels.${ formname }.form.settings`);
		let update = form.id || params.method === 'update';
		let bulk = params.method === 'bulk'
		let endpoint = params.method === "upload" ? __app.helpers.core.api.endpoint('form.upload') : 
			__app.helpers.core.api.endpoint((bulk ? 'bulk' : ( update ? 'item' : 'items' )), { id: form.id, collection: collection });
		let validations = _.get(__app.config.form.validations, formname);
		let previews = [];
		let dateformat = _.get(__app.data, 'configuration.application.format.date') || 'LLLL';
		let tags = _.get(__app.data, 'tags');
		
		const status = update ? 200 : 201;
		
		/*
			1. Collection must be present!
			2. Make sure all responses have been created!
			3. Make sure the user submitting is the authenticated user - if not admin!
		*/
		
		if (!collection) return res.status(400).json({ error: "Missing collection!" });
		
		if (!responses) return res.status(400).json({ error: "Missing responses!" });
		
		if (params.user && user != params.user && !admin) return res.status(400).json({ error: _.get(responses, '[error-user].value') });
	
		/*
			1. Build validations object from labels if applicable.
			2. Build previews if no labels.
			3. Validate form data using validations object.
			4. Clean Form Data - Integer Columns do no like empty strings
		*/
		
		preview = preview ? preview.split(',') : [];
		
		if (!validations && labels)
		{
			validations = {};
			
			_.forEach(labels, function (label)
			{
				let attributes = label.attributes || '';
				let options = {
					property: label.slug,
					required: _.get(attributes.match(/required/), 'index') >= 0,
					max: _.get(attributes.match(/maxlength\=\"([0-9]*)\"/), 1) || _.get(attributes.match(/max\=\"([0-9]*)\"/), 1) || null,
					min: _.get(attributes.match(/min\=\"([0-9]*)\"/), 1) || null,
					validate: label.validation || null
				};
				options.max = options.max ? Number(options.max) : null;
				options.min = options.min ? Number(options.min) : null;
				
				_.set(validations, label.slug, options);
				
				/* Build Preview from Form Data */
				
				_.forEach(form, function (value, index)
				{
					if (preview.includes(index) && value && index == label.slug) 
					{
						if (label.form_type === "select" && label.source) 
						{
							var options = App.get(label.source) || {};
							
							_.forEach(options, function (option)
							{
								if (option.value == value)
								{
									previews.push({
										value: option.text,
										label: label.value
									});
								}
							});
						}
						else 
						{
							previews.push({
								value: value,
								label: label.value
							});
						}	
					}
				});
			});			
		}
		else if (!labels && preview)
		{
			_.forEach(form, function (value, index)
			{
				if (preview.includes(index)) 
				{
					previews.push({
						value: value,
						label: S(index).humanize().titleCase().s
					});
				}				
			});
			
		}
	
		tagspreview = tagspreview ? tagspreview.split(',') : [];
		
		if (Array.isArray(tagspreview) && tagspreview.length)
		{
			_.forEach(form, function (value, index)
			{
				if (tagspreview.includes(index))
				{
					var tag = _.filter(tags, function (row)
					{
						return row.id == value;
					});
									
					if (_.get(tag, '0.name'))
					{
						previews.push({
							value: _.get(tag, '0.name'),
							label: S(index).humanize().titleCase().s
						});
					}
				}							
			});
		}
		
		var validate = validations ? __app.helpers.core.validator(form, validations) : true;
		
		if (validate.error) 
		{
			return res.status(400).json({
				error: _.get(responses, '[error-invalid].value'),
				list: validate.error
			});
		}
	
		if (!bulk)
		{
			_.forEach(form, function (value, index)
			{
				if (value === '') form[index] = null;
			});
		}
		
		let method = !update ? 'post' : 'put';
		
		if (req.query.debug === 'form') return res.json({
			"endpoint": endpoint,
			"form": form,
			"previews": previews,
			"params": params,
			"joins": joins
		});
				
		let response = await __app.helpers.core.api.connect({
			method: method,
			url: endpoint,
			send: form,
			result: 'body'
		}, req);
		
		if (!response || response.error) return res.status(502).json({
            message: _.get(responses, 'error.value'),
            error: response ? response.error : response
        });	
        
        let OBJ = response.data;
        
        if (params.navigate && OBJ) params.navigate = sails.helpers.handlebars(params.navigate, OBJ);        
        if (params.redirect && OBJ) params.redirect = sails.helpers.handlebars(params.redirect, OBJ);
        
        params.link = params.link ? params.link : params.redirect ? process.env.SERVER_DOMAIN + params.redirect : null;
        
        if (params.link === "upload")
        {
	        _.set(OBJ, 'formated.size', bytes(OBJ.size));
			_.set(OBJ, 'formated.uploaded', moment( new Date( OBJ.date_uploaded ).getTime() ).format(dateformat));
        }
		        
        if (params.notifications && App.get('configuration.mail.notifications')) Api.notifications({
	        params: params,
	        user: req.me,
	        editor: req.me,
	        preview: previews,
	        response: OBJ
        }, 
        req, res); 	
        
        if (params.notifications && _.get(__app.data, 'configuration.mail.notifications')) 
        {
	        endpoint = __app.helpers.core.api.endpoint('notifications');
	        
	        __app.helpers.core.api.connect({
				method: 'post',
				url: endpoint,
				send: {
					form: {
				        params: params,
				        user: req.me,
				        editor: req.me,
				        preview: previews,
				        response: OBJ
			        }
				},
				result: 'body'
			}, req);
        }
        
        let result = {
	        success: _.get(responses, 'success.value'),
	        navigate: !params.reload ? (params.navigate || params.redirect) : null,
	        redirect: params.reload ? (params.redirect || params.navigate) : null,
	        refresh: params.refresh,
	        reload: params.reload,
	        remove: params.remove,
	        form: form,
	        params: params,
	        response: OBJ,
	        users: params.users
        };
        
        /*
	        Process joins if applicable
        */
        
        if (joins && Array.isArray(joins.rows))
        {
	        endpoint = __app.helpers.core.api.endpoint('bulk', { collection: joins.collection });
	        
	        _.forEach(joins.rows, function (row)
	        {
		        _.forEach(joins.update, function (input, output)
		        {
			        var value = _.get(OBJ, input);
			        
			        if (value) _.set(row, output, value);
		        });
	        });
				
			let response = await __app.helpers.core.api.connect({
				method: 'post',
				url: endpoint,
				send: {
			        rows: joins.rows
		        },
				result: 'body'
			}, req);
		
			if (!response || response.error) return res.status(502).json({
	            message: _.get(responses, 'error.value'),
	            error: response ? response.error : response
	        });	
	        
	        return res.status(status).json(result); 
        }
        else return res.status(status).json(result); 
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
					email: "email@philleepflorence",
					first_name: "Philleep",
					last_name: "Florence",
				},
				params: {
					form: "user.settings",
					collection: "users.rows",
					method: "update",
					responses: "labels.app.form.responses",
					preview: "first_name,last_name,email",
					validation: "user"
				},
				joins: {
					collection: "users.metadata",
					rows: [{
						key: "metadata",
						value: "Unit Test",
						user: "id"
					}],
					update: "id"
				}
			},
			headers: []
		};
	}
}

/*
	Performs validation using Validator Helper.
	Form name must match the validation rules or form data will not be validated.
	Powered by Directus Custom Endpoint of the same route.
	Updates a table as well as related tables.
	INPUT:
		{
			form: form data,
			params: {
				form: name of form,
				validation: validation in api/config/form validations,
				table: table in the API to update,
				user: the user trying to make the update
				remove: Item to delete after success - Requires ID
				redirect: URL to redirect the user after success
				method: update|insert|bulk,
				preview: CSV of form keys to preview - must also have labels from App Labels,
				responses: Server responses to use from aoo_labels,
				labels: Form Settings labels to use for the form elements,
				method: update|bulk|upload
			},
			joins: {
				collection: join table in API to update,
				rows: [{ key: value, key: value }],
				update: { key to update in rows: dot.syntax.path.in.response }
			}
		}
	REQUIRED:
		Form.validations - dictionary of Form Inputs that require validation or Labels from the API
	RETURNS:
		JSON Response
	@help - See https://sailsjs.com/documentation/concepts/actions-and-controllers
		To clear console: console.log('\033c');
*/