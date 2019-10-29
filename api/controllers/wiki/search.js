/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - RESTful API to Search for a Wiki Item or closest match
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
		__app.debugger.debug(`api.controllers.wiki.search`);
			
		let debug = req.query.debug;
		let query = req.query.query;
		let reload = req.query.reload;	
		let title = query.replace(/[A-Za-z0-9]/gi, '-');
		
		if (!query) return res.status(400).send("Query parameter is required");
		
		const cachepath = `api/wikipedia/search/${ title }.json`;
		
		if (!reload) {
			const cache = await __app.helpers.core.cache.filesystem.get(cachepath);
			
			if (cache && cache.wiki) return res.json(cache);
		}		
			
		const endpoint = "https://en.wikipedia.org/w/api.php";
		const params = {
		    action: "query",
		    list: "search",
		    srsearch: query,
		    format: "json",
		    srlimit: req.query.limit || 50
		};
		
		const currtime = Date.now();
		
		const headers = {
			'User-Agent': _.get(req, 'headers[user-agent]', UserAgent.toString())
		};
			
		const response = await axios({
			method: 'GET',
			url: endpoint,
			headers: headers,
			params: params
		});
		
		const duration = Date.now() - currtime;

		__app.debugger.debug('api.controllers.wiki.search - Duration: `%s` ms', duration);

		const items = _.get(response, 'data.query.search', []);
				
		let contents = {
			query: query,
			total: items.length,
			wiki: {
				items: items
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
				query: 'Node'
			},
			body: {},
			headers: []
		};
	}
}
