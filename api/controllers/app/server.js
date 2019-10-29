/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Get information on the current platform and the process running.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/app
 * @method 		:: GET
 *
 */

import _ from 'lodash';
import sysinfo from 'systeminformation';

module.exports = {
	method: 'GET',
	token: true,
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.app.server - DEBUG:  `%s`', req.query.debug);
		
		let response = {};
		let currtime = Date.now();
		
		response.application = {
			frameWorks: ['ExpressJS', 'NuxtJS', 'VueJS'],
			memoryUsage: process.memoryUsage(),
			uptime: __app.helpers.core.format.human(Math.floor(process.uptime()), { scale: 'time' }),
			workingDirectory: process.cwd()
		};
		response.system = await sysinfo.system();
		response.system.cpu = await sysinfo.cpu();
		response.system.memory = await sysinfo.mem();
		response.system.os = await sysinfo.osInfo();
		response.system.versions = await sysinfo.versions();
		
		if (response.application.memoryUsage) _.forEach(response.application.memoryUsage, (string, key) => {
			_.set(response.application.memoryUsage, key, __app.helpers.core.format.human(string, { scale: 'bytes' }));
		});
		
		if (response.system.memory) _.forEach(response.system.memory, (string, key) => {
			_.set(response.system.memory, key, __app.helpers.core.format.human(string, { scale: 'bytes' }));
		});
		
		__app.debugger.debug('api.controllers.app.server - Duration:  `%s ms` ', Date.now() - currtime);
		
		return res.json(response);
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				token: process.env.SERVER_TOKEN
			}
		};
	}
}
