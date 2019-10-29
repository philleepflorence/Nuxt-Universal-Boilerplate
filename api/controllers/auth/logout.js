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
	method: 'GET',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.auth.logout');
		
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		const debug = req.query.debug;
		const usercookie = await __app.helpers.core.cookie.get('user', req, res);
		
		let form = req.session.user || { id: usercookie };
		let redirect = req.query.redirect || _.get(__app.data, 'redirects.route.logout.url');
						
		const test = await this.test(req, res);
		
		if (admin && !form) form = test.body.user;	
		
		if (!form.id) return res.redirect(redirect);
		
		let endpoint = __app.helpers.core.api.endpoint('auth.logout');
		
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
	            form: form
	        },
			result: 'body'
		}, req);
		
		if (response.error) {
			res.session.error = response.error;			
			return res.status(400).redirect(redirect);
		}
		
		const user = await __app.helpers.core.logout.user(form.id, req, res);
		
		return res.redirect(redirect);
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: "test",
				token: process.env.APP_TOKEN,
				user: {
					id: 1,
					email: "email@philleepflorence.com"
				}
			},
			headers: []
		};
	}
}
