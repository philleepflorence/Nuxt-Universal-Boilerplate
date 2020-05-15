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

import fs from 'fs-extra';

module.exports = {
	method: 'POST',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		const debug = req.query.debug;
		const filename = `${ process.cwd() }/assets/styles/mixins/colors.less`;
		
		__app.debugger.debug(`api.controllers.webhooks.color - filename: ${ filename }`);
		
		let endpoint = __app.helpers.core.api.endpoint('colors');
								
		let response = await __app.helpers.core.api.connect({
			method: 'get',
			url: endpoint,
			result: 'text',
			query: {
				write: true,
				mode: 'less'
			}
		}, req);	
		
		if (debug === 'test') return res.json({
			filename: filename,
			fileexists: fs.existsSync(filename),
			response: response
		});
		
		if (fs.existsSync(filename))
		{
			fs.writeFile(filename, response, (err) => {
				let error = err || response.error;
				
				if (error) return res.status(500).send(error);
				
				return res.status(201).send(`'${ filename }' was successfully updated!`);
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
