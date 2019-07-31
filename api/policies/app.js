/**
 * App Server Middleware - Application Boot
 *
 * @author 			:: Philleep Florence
 * @module      	:: Middleware
 * @description 	:: App Server Middleware - Initialize global and process
 * @docs        	:: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 		:: api/policies
 *
 */

import _ from 'lodash';
import path from 'path';

global.__app = global.__app || {};

__app.helpers = __app.helpers || require('require-all')({
	dirname: path.dirname(__dirname) + '/helpers',
	recursive: true,
	excludeDirs: /^\.(git|svn)$|^__.*$/
});

__app.config = __app.config || require('require-all')({
	dirname: path.dirname(__dirname) + '/config',
	recursive: true,
	excludeDirs: /^\.(git|svn)$|^__.*$/
});
 
export default async function (req, res, next) 
{
	for (let route of __app.config.router.server.middleware.exclude) if (req.path.indexOf(route) >= 0) return next();
	
	await __app.helpers.core.logger(process.env.SERVER_DEBUG || req.query.debug);
	
	let xhr = req.xhr || req.query.xhr || false;
			
	__app.debugger.info('api.policies.app - Path: `%s` - XHR: `%s`', req.path, xhr);
	
	__app.data = await __app.helpers.core.app.initialize(req, res, xhr);
		
	if (__app.data === false) return res.status(500).send("Initialization Data Failure - See Logs for details!");
	
	req.store = {};
	
	let exclude = __app.config.initialize.server;
	
	_.forEach(__app.data, function (row, key)
	{
		if (!exclude.includes(key)) _.set(req.store, key, row);
	});
		
	next();
}