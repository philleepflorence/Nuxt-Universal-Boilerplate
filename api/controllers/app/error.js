/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Gets Error from APP and sends to the API
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/app
 * @method 		:: POST
 *
 */

import _ from 'lodash';
import UserAgent from 'user-agents';

module.exports = {
	method: 'POST',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.app.error - DEBUG:  `%s`', req.query.debug);
		
		let endpoint = __app.helpers.core.api.endpoint('items', { collection: 'error' });
		let form = req.body.form;
		let test = await this.test(req, res);
		
		if (req.query.debug === 'test' && !form) form = test.body.form;
				
		if (!_.size(form)) return res.status(400).send("Form object is required!");
				
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: form,
			result: 'body'
		}, req);
		
		return res.json(response);
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		const userAgent = new UserAgent();
		
		return {
			body: {
				form: {
					message: 'Script Error Unit Test',
					filename: __filename,
					url: `${ process.env.SERVER_DOMAIN }${ req.path }`,
					error: 'Express Unit Testing',
					line_number: 1,
					column_number: 1,
					user_agent:  userAgent.toString()
				}
			},
			headers: [
				{ 'User-Agent': userAgent.toString() }
			]
		};
	}
}
