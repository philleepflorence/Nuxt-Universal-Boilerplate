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
		__app.debugger.debug(`api.controllers.wiki.introduction`);
			
		let debug = req.query.debug;
		let title = req.query.title;
		let reload = req.query.reload;	
		
		if (!title) return res.status(400).send("Title parameter is required");
		
		const cachepath = `api/wikipedia/introduction/${ title }.json`;
		
		if (!reload) {
			const cache = await __app.helpers.core.cache.filesystem.get(cachepath);
			
			if (cache && cache.wiki) return res.json(cache);
		}
			
		const endpoint = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=:title'.replace(':title', title);
		
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

		__app.debugger.debug('api.controllers.wiki.summary - Duration: `%s` ms', duration);
		
		let introduction = __app.helpers.core.utils.find(_.get(response, 'data'), 'extract');
		
		let contents = {
			wiki: {
				text: introduction
			}
		};
		
		__app.helpers.core.cache.filesystem.set(cachepath, contents);
			
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
