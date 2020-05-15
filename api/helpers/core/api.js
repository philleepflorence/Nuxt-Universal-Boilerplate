/**
 * API Helper
 *
 * @author 		:: Philleep Florence
 * @module      :: API Helper
 * @description :: API Helper - Wrapper for connecting to the Applications Main API
 * @docs        :: https://nuxtjs.org/guide/plugins
 * @directory 	:: api/helpers/core
 *
 */
 
import { forEach, get, merge, set } from 'lodash';
import UAParser from 'ua-parser-js';
import superagent from 'superagent';
import queryString from 'query-string';

module.exports = {
	
	/*
		Get the API Collection Information
	*/
	
	collection (collection, api) {
		
		api = api || 'directus';
		
		let config = merge(__app.config.api, __app.config.app);
		
		return get(config, `${api}.collections.${ collection }`);
	},
	
	/*
		Get the API Credentials - access token
	*/
	
	credentials (api) {
		
		api = api || 'directus';
		
		let config = merge(__app.config.api, __app.config.app);
		
		return get(config, `${api}.credentials`);
	},
	
	/*
        API URL Getter - Set the domain in the .env file
    */

    domain (api)
    {
	    api = api || 'directus';
		
		let config = merge(__app.config.api, __app.config.app);
        	    
	    return get(config, `${api}.domain`);
    },
	
	/*
        Get Formatted API Endpoint - allows other helpers to be agnostic of the API database
        PARAMETERS:
        	endpoint: endpoint alias or property
        	params: [
	        	{collection: collection alias},
	        	{id: ID of item - if applicable}
	        	{... - any :prop to replace within the endpoint}
        	]
    */

    endpoint (endpoint, params, api, env)
    {
	    api = api || 'directus';
	    env = env || process.env.SERVER_ENVIRONMENT || 'production';
	    
	    let domain = this.domain(api, env);
	    let config = merge(__app.config.api, __app.config.app);
	    
	    endpoint = get(config, `${api}.endpoints.${endpoint}.url`);	    
	    endpoint = endpoint.replace(':domain', domain);
	    
	    if (params) forEach(params, function (value, key)
	    {
		    if (key === 'collection') value = get(config, `${api}.collections.${value}`);
		    
		    endpoint = endpoint.replace(`:${key}`, value);
	    });
        	    
	    return endpoint;
    },
	
	/*
        Get the fields to load from a collection - allows other helpers to be agnostic of the API database
        PARAMETERS:
        	collection: collection alias or name
        	api: the API to connect with
    */

    fields (collection, api)
    {
	    api = api || 'directus';
	    
	    let config = merge(__app.config.api, __app.config.app);
	    
	    let fields = get(config, `${api}.fields.${collection}`);
        	    
	    return fields;
    },
    
    /*
        General Purpose Application API CURL Loader and Connector
        ARGUMENTS:
        	{
	        	url: endpoint,
	        	query: URL query parameter,
	        	send: JSON Object Body - Only applicable for 'PUT', 'POST', and 'PATCH',
	        	method: get|post|put|...
	        	headers: additional headers to send - see default values below
        	}
        DEPENDENTS:
            superagent - npm install superagents --save
    */
    
	async connect (options, req) {
		
		__app.debugger.info('api.helpers.core.api.connect - Endpoint: `%s`', options.url);
		
		const uaparser = new UAParser(get(req.headers, 'user-agent'));
		
		let agent = uaparser.getResult();	
		let user = get(req.session, 'user') || req.me || {};
		let userData = user ? {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			username: user.username,
			email: user.email,
			name: user.name
		} : {};
		
		options.method = options.method || 'get';
		options.send = options.send || {};
		options.query = options.query || {};
		options.headers = options.headers || {};
		options.headers = options.method === 'get' ? options.headers : Object.assign({
			'Content-type': 'application/json',
			'Browser': get(agent.browser, 'name', ''),
			'Operating-System': get(agent.os, 'name', ''),
			'Device': get(agent.device, 'model', ''),
			'User-Agent': uaparser.getUA(),
			'Ip-Address': req.ip_address,
			'App-User': user.id || 0,
			'App-User-Data': JSON.stringify(userData),
			'App-Environment': process.env.SERVER_ENVIRONMENT,
			'App-Domain': process.env.SERVER_DOMAIN
		}, options.headers); 
		
		const currtime = Date.now();
		
        const query = Object.assign({}, options.query, this.credentials());
        
        __app.debugger.info('api.helpers.core.api.connect - Query: `%s`', JSON.stringify(query));
                        
        try {
        
			const result = await superagent(options.method.toUpperCase(), options.url)
			.set(options.headers)
			.query(query)
			.send(options.send);
			
			const duration = ( Date.now() - currtime );
			const error = ( result.status > 300 || result.status < 200 );
			
			__app.debugger.info('api.helpers.core.api.connect - Endpoint: `%s`', decodeURIComponent(result.req.path));

			__app.debugger.info('api.helpers.core.api.connect - Duration: `%s` ms', duration);
			
			result.duration = duration;
			
			if (options.result) return get(result, options.result);
			
			return result;	        
        }
        catch (err) {

	        let error = get(err, 'response.text') || get(err, 'response.body');
	        
	        if (typeof error === "string") error = JSON.parse(error);
	        
	        let message = get(error, 'error.message') || get(error, 'message');
	        
	        __app.debugger.info('api.helpers.core.api.connect - Error: `%s`!', message);
	        
	        return error;
        }
	}
}
