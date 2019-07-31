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
 
import axios from 'axios';
import _ from 'lodash';
import ip from 'ip';
import useragent from 'useragent';

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
		
		let initialize = _.cloneDeep(__app.config.initialize);		
		initialize = _.merge(initialize, __app.config.app.initialize);
				
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			query: {
				reload: true
			},
			url: endpoint,
			send: initialize
		}, req);
		
		const data = response.body;
		const error = _.get(response, 'response.text');
		
		if (error) __app.debugger.info('api.helpers.core.app.initialize - Error Message: `%s`', error);
				
		if (!data) return false;
		
		if (debug === 'initialize' && token) return res.json(data);
		else if (token && debug && _.get(data, debug)) return res.json(_.get(data, debug));
		
		for (let method in data) 
		{
			const Method = __app.helpers.core.initialize[method];
			
			let row = _.get(data, method);
			
			if (typeof Method !== 'function' || !_.size(row)) continue;
			
			_.set(data, method, Method(row, req, data));
		}
		
		const success = __app.helpers.core.cache.$.set('app', data);
				
		return data;
	}
}