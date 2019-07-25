/**
 * Gravatar Helper
 *
 * @author :: Philleep Florence
 * @module      :: Gravatar Helper
 * @description :: Gravatar Helper - Generate Gravatar Image - Random Image Placeholders - https://en.gravatar.com/
 *
 */
 
import crypto from 'crypto';
import format from 'string-format';

module.exports = function (options, req) {
	
	__app.debugger.info('api.helpers.core.gravatar');
	
	options = options || {};
	
	let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		
	options.rating = options.rating || 'g';
	options.size = options.size || 960;	
	options.type = options.type || 'identicon';		
	options.hash = options.hash || (options.email ? crypto.createHash('md5').update(options.email).digest("hex") : hash);
	
	let url = "https://www.gravatar.com/avatar/{hash}?s={size}&d={type}&r={rating}";
		url = format(url, options);
		
	return url;
}