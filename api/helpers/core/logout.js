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
	
	async user (user, req, res) {		
		__app.debugger.info('api.helpers.core.logout.user - User ID: `%s`', user);
		
		req.me = null;
		
		req.session.user = null;
		
		__app.helpers.core.cookie.remove('user', req, res);	
		
		return req.session.user || req.me || __app.helpers.core.cookie.get('user', req, res);
	}	
}
