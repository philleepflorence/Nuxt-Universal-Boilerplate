/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Webhook to get colors from API
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/webhooks
 * @method 		:: GET
 *
 */

import _ from 'lodash';
import fs from 'fs-extra';

module.exports = {
	method: 'GET',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.info('api.controllers.webhooks.color');
		
		const debug = req.query.debug;
		const filename = `${ process.cwd() }/assets/styles/mixins/colors.less`;
		
		let endpoint = __app.helpers.core.api.endpoint('colors');
						
		let response = await __app.helpers.core.api.connect({
			method: 'get',
			url: endpoint,
			result: 'text'
		}, req);	
		
		if (debug === 'test') return res.json({
			filename: filename,
			fileexists: fs.existsSync(filename),
			response: response
		});
		
		if (fs.existsSync(filename))
		{
			fs.writeFile(filename, response, (err) => {
				if (err) return res.status(500).send(err);
				
				return res.status(201).send(`'assets/styles/mixins/colors.less' was successfully updated!`);
			});
		}		
		else return res.status(500).send("Unable to locate colors.less");
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: 'test'
			},
			body: {},
			headers: []
		};
	}
}
