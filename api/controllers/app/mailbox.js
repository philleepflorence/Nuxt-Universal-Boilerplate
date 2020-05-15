/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Get Email from API and render in browser
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/app
 * @method 		:: GET
 *
 */

import { get } from 'lodash';
const axios = require('axios');

module.exports = {
	method: 'GET',
	async run (req, res) {
		
		const uuid = req.query.uuid || req.params.uuid; 
		
		if (!uuid) return res.status(400).send();

		__app.debugger.debug('api.controllers.app.mailbox - UUID: `%s`', uuid);
		
		const endpoint = __app.helpers.core.api.endpoint('items', {
			collection: 'mailbox'
		});
		
		const response = await __app.helpers.core.api.connect({
			method: 'get',
			query: {
		        limit: 1,
		        filter: {
			        "uuid": {
				        "eq": uuid
			        }
		        }
	        },
			url: endpoint
		}, req);
		
		const body = get(response, 'body.data.body');
		
		if (!body) return res.status(400).send();
		
		res.setHeader('Content-Type', 'text/html');
	
		return res.send(body);
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				uuid: '99b9e9b0decca8f810195c119ce9f699d2bcc1da279c05ed185f6241cbba92d6'
			}
		};
	}
}