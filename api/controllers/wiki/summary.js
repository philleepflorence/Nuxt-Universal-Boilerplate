/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - RESTful API to load Wiki Summary and Image
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/contents/wiki
 * @method 		:: GET
 *
 */

import _ from 'lodash';
import axios from 'axios';
import UserAgent from 'user-agents';

module.exports = {
	method: 'GET',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		__app.debugger.info(`api.controllers.contents.wiki.summary`);
			
		let debug = req.query.debug;
		let title = req.query.title;	
		
		if (!title) return res.status(400).send("Title parameter is required");
			
		const endpoint = 'https://en.wikipedia.org/api/rest_v1/page/summary/:title'.replace(':title', title);
		
		const currtime = Date.now();
		
		const headers = {
			'User-Agent': _.get(req, 'headers[user-agent]', UserAgent.toString())
		};
			
		const response = await axios({
			method: 'GET',
			url: endpoint,
			headers: headers
		});
		
		const duration = Date.now() - currtime;

		__app.debugger.info('api.controllers.contents.wiki.summary - Duration: `%s` ms', duration);
		
		let contents = {
			wiki: {
				description: _.get(response, 'data.description'),
				html: _.get(response, 'data.extract_html'),
				image: _.get(response, 'data.originalimage'),
				plantext: _.get(response, 'data.extract'),
				titles: _.get(response, 'data.titles')
			}
		};
			
		return res.json(contents);	
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: 'test',
				title: 'Open_API'
			},
			body: {},
			headers: []
		};
	}
}
