/**
 * Page Server Middleware
 *
 * @author :: Philleep Florence
 * @module      :: Middleware
 * @description :: Page Server Middleware - Check authenticated user against page privilege.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory :: api/policies
 *
 */

import _ from 'lodash';
import routeParser from 'route-parser';
 
export default async function (req, res, next) 
{	
	for (let route of __app.config.router.server.middleware.exclude) if (req.path.indexOf(route) >= 0) return next();
	
	const user = req.me || {};
	const pages = _.get(__app.data, 'pages');
	const redirects = _.get(__app.data, 'redirects');
	
	__app.debugger.warn('api.policies.page - User: %s', user.username);
	
	let page = __app.helpers.core.page.get(pages, req);
	
	if (!page || !page.name) return res.status(500).send("Initialization Error - Unable to connect to Locate Page Configuration!");
	
	__app.debugger.warn('api.policies.page - Page: %s', page.name);
	
	let controller = _.get(__app.controllers, `contents.${ page.slug }`);
	let route = new routeParser(page.path);
	
	if (page.name && controller) {
		req.params = route.match(req.path);
		req.contents = await controller.run(req, res, true);
	}
	
	if (req.query.debug === 'json' && req.query.token === process.env.APP_TOKEN) return res.json(req.contents);
	
	let forbidden = __app.helpers.core.page.forbidden(page, req);
	let redirectpath = _.get(redirects, 'route.forbidden.url', '/');
	
	__app.debugger.warn('api.policies.page - Forbidden: %s - Redirect Path: %s', forbidden, redirectpath);
	
	if (forbidden === 'login')
	{
		req.session.redirect = req.url;
		
		return res.redirect(redirectpath);
	}
	else if (forbidden === true)
	{
		res.status(403);
	}
		
	next();
}