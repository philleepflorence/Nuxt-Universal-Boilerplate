/**
 * Cookie Helper
 *
 * @author :: Philleep Florence
 * @module      :: Cookie Helper
 * @description :: Cookie Helper - Cookie Wrapper!
 * @docs        :: https://www.npmjs.com/package/cookie
 *
 */

import _ from 'lodash'; 
import cookie from 'cookie';
import moment from 'moment';

module.exports = {
	
	async get (property, req, res) 
	{
		const cookies = cookie.parse(req.headers.cookie || '');	
		
		if (property === true) return cookies;
		
		return _.get(cookies, property);
	},
	
	async set (property, value, options, req, res) 
	{
		const milliseconds = Date.now() + ( process.env.APP_COOKIES_EXPIRE * 1000 );
		const expires = new Date(milliseconds);
		
		__app.debugger.info('api.helpers.core.cookie.set - `%s`', JSON.stringify([property, value]));
		
		options = options || {};
		options.expires = options.expires || expires;
		options.maxAge = options.maxAge || process.env.APP_COOKIES_EXPIRE;
		options.path = options.path || process.env.APP_COOKIES_PATH;
		options.domain = options.domain || process.env.SERVER_DOMAIN;
		options.sameSite = options.sameSite || process.env.APP_COOKIES_SAMESITE || 'none';
		
		res.setHeader('Set-Cookie', cookie.serialize(property, value, options));
						
		return res;
	},
	
	async remove (property, req, res) 
	{
		let options = {
			expires: new Date(0),
			maxAge: 0,
			path: process.env.APP_COOKIES_PATH,
			domain: process.env.SERVER_DOMAIN
		};
		
		res.setHeader('Set-Cookie', cookie.serialize(property, "", options));
						
		return res;
	}		
}