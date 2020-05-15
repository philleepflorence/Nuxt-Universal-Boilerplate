/**
 * App Helper
 *
 * @author 			:: Philleep Florence
 * @module      	:: App Helper
 * @description 	:: App Helper - Wrapper for global App methods and Configuration
 * @docs        	:: https://nuxtjs.org/guide/plugins
 * @directory 		:: api/helpers/core
 *
 */
 
import { cloneDeep, get, merge, set, size } from 'lodash';

module.exports = {
	
	/*
		Loads and Caches the Core Store Data from the API Compile Endpoint
	*/
	
	async initialize (req, res, getcache) {
		
		getcache = getcache || false;
		
		__app.debugger.info('api.helpers.core.app.initialize - Cache: `%s`', getcache);
	
		await __app.helpers.core.cache.init(req, res);
		
		const currcache = __app.helpers.core.cache.$.get('app');
	
		if (getcache && currcache) return currcache;
	
		const token = (req.query.token && req.query.token === process.env.APP_TOKEN);
		const debug = req.query.debug;
	
		const endpoint = __app.helpers.core.api.endpoint('compile');
		
		let initialize = cloneDeep(__app.config.initialize);		
			initialize = merge(initialize, __app.config.app.initialize);
		let query = merge({ reload: true }, initialize.params);
				
		const response = await __app.helpers.core.api.connect({
			method: 'get',
			query: query,
			url: endpoint
		}, req);
		
		const data = response.body;
		const error = get(response, 'text');
		
		if (!size(data) && error) __app.debugger.info('api.helpers.core.app.initialize - Error Message: `%s`', error);
				
		if (!size(data)) return false;
		
		if (debug === 'initialize' && token) return res.json(data);
		else if (token && debug && get(data, debug)) return res.json(get(data, debug));	
		
		const success = __app.helpers.core.cache.$.set('app', data);
				
		return data;
	},
	
	/*
		Process the application initialization data for the specific response
		User Specific Processing!
	*/
	
	async process (req, res, data) {
		
		__app.debugger.info('api.helpers.core.app.process');
		
		for (let method in data) 
		{
			__app.debugger.info('api.helpers.core.app.process - Method: `%s`', method);
			
			const Method = get(__app.helpers, `app.initialize.${ method }`) || get(__app.helpers, `core.initialize.${ method }`);
			
			let row = get(data, method);
			
			if (typeof Method !== 'function' || !size(row)) continue;
			
			set(data, method, Method(row, req, data));
		}
		
		return data;
	}
}