/**
 * Cache Helper
 *
 * @author :: Philleep Florence
 * @module      :: Cache Helper
 * @description :: Cache Helper - Attaches the cache helper to the NodeJS global process object
 * @docs        :: https://www.npmjs.com/package/node-cache
 *
 */
 

import NodeCache from 'node-cache';

module.exports = {
	
	async init (req, res) {
	
		if (this.$) return this.$;
		
		this.$ = new NodeCache({
			stdTTL: process.env.CACHE_TTL || 0,
			checkperiod: process.env.CACHE_CHECK || 0,
			useClones: process.env.CACHE_CLONE || true,
			deleteOnExpire: process.env.CACHE_DELETE || true
		});
		
		this.$.on('set', (key, value) => {
			__app.debugger.info('api.helpers.core.cache :: SET - Key: %s', key);
		});	
		
		this.$.on('del', (key, value) => {
			__app.debugger.info('api.helpers.core.cache :: DELETE - Key: %s', key);
		});	
		
		this.$.on('expired', (key, value) => {
			__app.debugger.info('api.helpers.core.cache :: EXPIRED - Key: %s', key);
		});	
		
		this.$.on('flush', (key, value) => {
			__app.debugger.info('api.helpers.core.cache :: FLUSH - Key: %s', key);
		});
		
		return this.$;
		
	}
}