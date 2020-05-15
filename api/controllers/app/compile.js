/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Load contents via the API Collections Compile Endpoint.
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
		
		__app.debugger.debug('api.controllers.app.compile - Query:  `%s`', req.query.collections);
		
		const admin = req.query.debug === 'test' && req.query.token === process.env.APP_TOKEN;
		
		let query = req.query;
		let test = await this.test(req, res);
		
		if (admin && !query.collection) query = test.query;
		
		let endpoint = __app.helpers.core.api.endpoint('compile');
				
		const response = await __app.helpers.core.api.connect({
			method: 'get',
			url: endpoint,
			query: {
				collections: query.collections,
				mode: query.mode,
				filter: query.filter,
				filters: query.filters,
				process: query.process
			},
			result: 'body'
		}, req);
				
		if (!_.get(response, 'data')) return res.status(404).json(response);
		
		const content = _.get(response, 'data');
				
		return res.json(content);
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				collections: "glossary",
				mode: "collection",
				filter: true,
				process: true
			}
		};
	}
}
