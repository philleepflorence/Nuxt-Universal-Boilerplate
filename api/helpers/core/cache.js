/**
 * Cache Helper
 *
 * @author :: Philleep Florence
 * @module      :: Cache Helper
 * @description :: Cache Helper - Attaches the cache helper to the NodeJS global process object
 * @docs        :: https://www.npmjs.com/package/node-cache
 *
 */
 
import fs from 'fs-extra';
import NodeCache from 'node-cache';
import path from 'path';

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
		
	},
	
	/*
		Cache contents in JSON format!
	*/
	
	filesystem: {
		async set (filepath, content) {
			const dirname = (process.env.INIT_CWD || process.env.PWD);
			const destination = `${ dirname }/.cache/${ filepath }`;
			const directory = path.dirname(destination);
			
			if (typeof content !== "string") content = JSON.stringify(content);
			
			__app.debugger.info('api.helpers.core.cache.filesystem.set :: Destination: %s', destination);
					
			try {
				fs.ensureDirSync(directory);
				
				fs.writeFileSync(destination, content);
				
				return fs.pathExistsSync(destination);
			}
			catch (error) {
				return error;
			}			
		},
		async get (filepath) {
			const dirname = (process.env.INIT_CWD || process.env.PWD);
			const destination = `${ dirname }/.cache/${ filepath }`;
			const fileexists = await fs.pathExists(destination);
			
			__app.debugger.info('api.helpers.core.cache.filesystem.get :: Destination: %s', destination);
			
			if (fileexists === true) {
				let content = await fs.readJsonSync(destination);
				
				return content;
			}
			
			return false;
		}
	}
}