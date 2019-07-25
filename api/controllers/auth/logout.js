/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - UnAuthenticate user and destroy user session.
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
		
		__app.debugger.info('api.controllers.auth.logout');
		
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		const debug = req.query.debug;
		let form = req.me;
		let redirect = req.body.redirect || _.get(__app.data, 'redirects.route.logout.url');
		
		const test = await this.test(req, res);
		
		if (admin && !form) form = test.body.user;	
		
		let endpoint = __app.helpers.core.api.endpoint('auth.logout');
		
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
	            form: form
	        },
			result: 'body'
		}, req);
		
		if (response.error) return res.status(400).json({
			error: response.error
		}); 
		
		const user = await __app.helpers.core.logout.user(form.id, req, res);
		
		return res.json({
			user: user,
			redirect: redirect,
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
				user: {
					id: 1,
					email: "email@philleepflorence.com"
				}
			},
			headers: []
		};
	}
}
