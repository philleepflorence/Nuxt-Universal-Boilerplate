/**
 * Express Controller
 *
 * @author 			:: Philleep Florence
 * @module      	:: Express Controller
 * @description 	:: Express Server Controller - Sync Nuxt Boilerplate Directories and Files.
 * @disclaimer		:: Blocking Process - Only run on a development server!
 * @docs        	:: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 		:: api/controllers/app
 * @method 			:: GET
 *
 */

import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';

module.exports = {
	method: 'GET',
	async run (req, res) {

		__app.debugger.info('api.controllers.app.boilerplate');
		
		const token = req.query.token; 		
		const currtime = Date.now();
		
		if (!token || token !== process.env.APP_TOKEN) return res.status(400).send("Token is required to process boilerplate!");
		
		const dirname = (process.env.INIT_CWD || process.env.PWD);
		const filepath = `${ dirname }/boilerplate.config.js`;
		const fileexists = await fs.pathExists(filepath);
		
		if (!fileexists) return res.status(400).send("Boilerplate.config.js must be included in the project directory root!");
		
		let config = require(filepath);
		
		if (process.env.NODE_ENV !== _.get(config, 'configuration.environment')) return res.status(400).send("Sync must be done on a local development environment only!");
		
		let output = config.configuration.destination;
		let outputexists = await fs.pathExists(output);
		
		if (!outputexists) return res.status(400).send("You must create a Nuxt Universal App and provide the path first!");
		
		if (Array.isArray(config.paths)) {
			for (let row of config.paths) {
				let source = `${ dirname }/${ row.path }`;
				let pathexists = fs.pathExistsSync(source);
				
				
				if (pathexists) {
					row.source = source; 
					
					let directory = path.dirname(source);
					
					fs.ensureDirSync(directory);
				
					try {				
						let destination;
						
						if (row.output) {
							destination = `${ output }/${ row.output }`;					
						}					
						else if (row.recursive) {
							destination = `${ output }/${ row.path }`;
						}				
						else  {
							destination = `${ output }/${ row.path }`;
						}
						
						if (typeof destination === "string" && row.create) {
							row.destination = destination;
							row.sync = fs.writeFileSync(destination, row.content);
						}
						else if (typeof destination === "string") {
							row.destination = destination;	
							row.synced = fs.copySync(source, destination, { preserveTimestamps: true });
						}
						else {
							row.synced = false;
						}									
					}
					catch (err) {
						row.error = err;
					}
				}
			}
		}		
		
		const duration = Date.now() - currtime;

		__app.debugger.info('api.controllers.app.boilerplate - Duration: `%s` ms', duration);
	
		return res.json({
			duration: `${ duration }ms`,
			configuration: config
		});
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				token: process.env.APP_TOKEN
			}
		};
	}
}