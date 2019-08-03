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

import _ from 'lodash';
import routeParser from 'route-parser';
 
export default async function (req, res, next) 
{
	__app.debugger.info('api.policies.redirect');
	
	let redirects = _.get(__app.data, "redirects.404");
	let currpath = _.trimEnd(req.path, '/').toLowerCase();
	let page;
	
	if (!_.size(redirects)) return next();
	
	_.forEach(redirects, (row, path) => {
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
		_.forEach(page.match, (value, key) => {
			page.url = page.url.replace(`:${ key }`, value);
		});
	}
	
	if (page.url) return res.redirect(301, page.url);
		
	next();
}