/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Get HTML content from external source.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/app
 * @method 		:: GET
 *
 */

import _ from 'lodash';
import axios from 'axios';
import UserAgent from 'user-agents';

module.exports = {
	method: 'GET',
	async run (req, res) {
		
		const url = req.query.url; 
		
		if (!url) return res.status(400).send();

		__app.debugger.info('api.controllers.app.curl - URL: `%s`', url);
		
		const currtime = Date.now();
		
		const headers = {
			'User-Agent': _.get(req, 'headers[user-agent]', UserAgent.toString())
		};
			
		const response = await axios({
			method: 'GET',
			url: url,
			headers: headers
		});
		
		const duration = Date.now() - currtime;

		__app.debugger.info('api.controllers.app.curl - Duration: `%s` ms', duration);
	
		return res.json({
			duration: duration,
			body: response.data,
			status: response.status,
			statusText: response.statusText
		});
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				url: 'http://www.example.com'
			}
		};
	}
}