/**
 * Authentication Server Middleware
 *
 * @author :: Philleep Florence
 * @module      :: Middleware
 * @description :: Authentication Server Middleware - Cookie and Session Authentication.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory :: api/policies
 *
 */

import _ from 'lodash';
 
export default async function (req, res, next) 
{
	for (let route of __app.config.router.server.middleware.exclude) if (req.path.indexOf(route) >= 0) return next();
			
	__app.debugger.info('api.policies.auth');
	
	let user = req.session.user || {};
	
	__app.debugger.info('api.policies.auth - Session User: %s', user.username || "Not Authenticated!");
	
	req.me = user;
	
	/* Allow the authenticated user to see the user session data via username parameter */
	
	if (user.id && req.query.debug === 'user' && req.query.username == user.username) return res.json(user);
	
	/* User is authenticated and is in the session */
	
	if (user.username) return next();
	
	/* Check if authenticated user ID exists in the cookies - if so get user from API */
	
	const usercookie = await __app.helpers.core.cookie.get('user', req, res);
	
	__app.debugger.info('api.policies.auth - Cookie User ID: %s', usercookie || "No Cookie!");
	
	if (!usercookie) return next();
	
	const endpoint = __app.helpers.core.api.endpoint('item', {
		id: usercookie,
		collection: 'users.rows'
	});
	
	const response = await __app.helpers.core.api.connect({
		method: 'get',
		query: {
			reload: true
		},
		url: endpoint
	}, req);
	
	user = _.get(response, 'data.data', {});
	
	if (!user.id) return next();
	
	__app.debugger.info('api.policies.auth - Cookie Authenticated User: %s', user.username);
	
	user = __app.helpers.core.user(user, 'session', req);
	
	req.me = user;
	
	req.session.user = user;
	
	next();
}