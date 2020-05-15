/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Get the user via 'reset_token' and then update 'status' via the user ID after registration.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/auth
 * @method 		:: GET
 *
 */

import _ from 'lodash';

module.exports = {
	method: 'GET',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.auth.confirm');
		
		const debug = req.query.debug;
		const salt = req.params.salt || req.query.salt;
		const responses = _.get(__app.data, 'responses.auth.confirm');
		
		if (!salt) return res.status(400).send(_.get(responses, 'confirm-error-token.value'));
		
		const redirect = req.session.redirect || req.query.redirect || _.get(__app.data, 'redirects.route.confirmed.url');
		
		let endpoint = __app.helpers.core.api.endpoint('auth.confirm');
		
		let response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
	            form: {
		            token: salt
	            }
	        },
			result: 'body'
		}, req);
		
		let user = _.get(response, 'data', {});
		
		if (!user.id) return res.status(400).send(_.get(responses, 'confirm-error.value'));
		
		user = __app.helpers.core.user(user, 'session', req);
		
		if (debug === 'user') return res.json(user);
		
		if (debug === 'test') return res.json({ redirect: redirect });
		
		return res.redirect(redirect);
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: 'test',
				salt: "2fae045d"
			},
			body: {},
			headers: []
		};
	}
}
