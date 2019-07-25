/**
 * API Helper
 *
 * @author 		:: Philleep Florence
 * @module      :: API Helper
 * @description :: API Helper - User Session and Authentication Helper - can only log in active user.
 * @docs        :: https://nuxtjs.org/guide/plugins
 * @directory 	:: api/helpers/core
 *
 */
 
import _ from 'lodash';

module.exports = {
	
	async user (user, req, res, curruser) {		
		__app.debugger.info('api.helpers.core.login.user - User ID: `%s` - Current User: `%s`', user, typeof curruser);
		
		const expires = Number(_.get(__app.data, 'configuration.auth.login.cookie.expires', process.env.APP_COOKIES_EXPIRE));
		
		if (!curruser) {
			const endpoint = __app.helpers.core.api.endpoint('item', { collection: 'users.rows', id: user });			
			const response = await __app.helpers.core.api.connect({
				method: 'get',
				url: endpoint,
				result: 'body'
			}, req);
			
			if (!response.data.id) return null;
			
			curruser = response.data;
		}			
		
		user = __app.helpers.core.user(curruser, 'session', req);
		
		req.me = user;
		
		req.session.user = user;
		
		if (res && user.id) __app.helpers.core.cookie.set('user', user.id, {
	        maxAge: expires
        }, req, res);	
		
		return user;
	}	
}
