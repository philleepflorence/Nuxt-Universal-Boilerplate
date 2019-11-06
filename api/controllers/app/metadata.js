/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Get Metadata Information for a URL
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/app
 * @method 		:: GET
 *
 */

import _ from 'lodash';
import scrape from 'html-metadata';
import striptags from 'striptags';
import request from 'request';
import UserAgent from 'user-agents';

module.exports = {
	method: 'GET',
	async run (req, res) {
		
		const url = req.query.url || req.params.url; 
		
		if (!url) return res.status(400).send();
		
		let metadata = {};

		__app.debugger.debug('api.controllers.app.metadata - URL: `%s`', url);
		
		const currtime = Date.now();
	
		scrape({
			url: url,
			jar: request.jar(),
			headers: {
				'User-Agent': _.get(req, 'headers[user-agent]', UserAgent.toString())
			}
		}, 
		function (error, response)
		{
			if (error) return res.status(502).send(error);
			
			metadata = {
				url: _.get(response, 'openGraph.url') || url,
				author: _.get(response, 'general.author') || _.get(response, 'twitter.creator'),
				description: _.get(response, 'general.description') || _.get(response, 'openGraph.description') || _.get(response, 'twitter.description'),
				title: _.get(response, 'general.title') || _.get(response, 'openGraph.title') || _.get(response, 'twitter.title'),
				name: _.get(response, 'openGraph.site_name'),
				image: _.get(response, 'openGraph.image.url') || _.get(response, 'twitter.image.src')
			};
						
			_.each(metadata, function (value)
			{
				value = value ? striptags(value) : value
			});
			
			const duration = ( Date.now() - currtime );
			
			__app.debugger.debug('api.controllers.app.metadata - Duration: `%s ms`', duration);
			
			return res.json(metadata);
		});
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				url: 'http://www.google.com'
			}
		};
	}
}