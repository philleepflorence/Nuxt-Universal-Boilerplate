/**
 * App Server Middleware - Redirection
 *
 * @author 			:: Philleep Florence
 * @module      	:: Middleware
 * @description 	:: App Server Middleware - Redirection - Check for redirections in App Redirect
 * @docs        	:: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 		:: api/policies
 *
 */

import { forEach as __forEach, get as __Get, trimEnd as __trimEnd, size as __Size } from 'lodash';
import routeParser from 'route-parser';
 
export default async function (req, res, next) 
{
	for (let route of __app.config.router.server.middleware.exclude) if (req.path.indexOf(route) >= 0) return next();
	
	__app.debugger.info('api.policies.redirect - Path: `%s`', req.path);
	
	let redirects = __Get(__app.data, "redirects.404");
	let currpath = __trimEnd(req.path, '/').toLowerCase();
	let page;
	
	if (!__Size(redirects)) return next();
	
	__forEach(redirects, (row, path) => {
		if (currpath === path) {
			page = {
				path: path,
				url: row.url
			};
		}
		else {
			let route = new routeParser(path);
			let match = route.match(currpath);
			
			if (match) {
				page = {
					path: path,
					url: row.url,
					match: match
				};
			}
		}
	});
	
	if (!page) return next();
	
	if (page.match) {
		__forEach(page.match, (value, key) => {
			page.url = page.url.replace(`:${ key }`, value);
		});
	}
	
	if (page.url) return res.redirect(301, page.url);
		
	next();
}