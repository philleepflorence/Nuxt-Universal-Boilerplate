/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Search the API via the Search App Endpoint.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/app
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
		
		__app.debugger.debug('api.controllers.app.search - Query:  `%s`', req.query.query);
		
		let endpoint = __app.helpers.core.api.endpoint('search.app');
		
		const response = await __app.helpers.core.api.connect({
			method: 'get',
			url: endpoint,
			query: {
				mode: req.query.mode,
				query: req.query.query
			},
			result: 'body'
		}, req);
		return res.json(response);
				
		if (!_.get(response, 'data') && server === true) return null;
		else if (!_.get(response, 'data')) return res.status(404).json(response);
		
		const articles = await __app.helpers.app.articles.feed(response.data);
		const content = {
			feed: articles
		};
		
		if (server === true) return content;
		
		return res.json(content);
		
		
		
		return res.json(response);
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				query: "Hello World"
			}
		};
	}
}
