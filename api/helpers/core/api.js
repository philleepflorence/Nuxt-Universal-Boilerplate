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
 
import _ from 'lodash';
import ip from 'ip';
import useragent from 'useragent';
import superagent from 'superagent';
import queryString from 'query-string';

module.exports = {
	
	/*
		Get the API Collection Information
	*/
	
	collection (collection, api) {
		
		api = api || 'directus';
		
		let config = _.merge(__app.config.api, __app.config.app);
		
		return _.get(config, `${api}.collections.${ collection }`);
	},
	
	/*
		Get the API Credentials - access token
	*/
	
	credentials (api) {
		
		api = api || 'directus';
		
		let config = _.merge(__app.config.api, __app.config.app);
		
		return _.get(config, `${api}.credentials`);
	},
	
	/*
        API URL Getter - Set the domain in the .env file
    */

    domain (api)
    {
	    api = api || 'directus';
		
		let config = _.merge(__app.config.api, __app.config.app);
        	    
	    return _.get(config, `${api}.domain`);
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
	    let config = _.merge(__app.config.api, __app.config.app);
	    
	    endpoint = _.get(config, `${api}.endpoints.${endpoint}.url`);	    
	    endpoint = endpoint.replace(':domain', domain);
	    
	    if (params) _.forEach(params, function (value, key)
	    {
		    if (key === 'collection') value = _.get(config, `${api}.collections.${value}`);
		    
		    endpoint = endpoint.replace(`:${key}`, value);
	    });
        	    
	    return endpoint;
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
            axios - npm install @nuxtjs/axios --save
    */
    
	async connect (options, req) {
		
		__app.debugger.info('api.helpers.core.api.connect - Endpoint: `%s`', options.url);
		
		options.method = options.method || 'get';
		options.send = options.send || {};
		options.query = options.query || {};
		options.headers = options.headers || {};
		options.headers = options.method === 'get' ? options.headers : Object.assign({
			'Content-type': 'application/json',
			'User-Agent': _.get(req, 'headers[user-agent]', 'SuperAgent'),
			'Ip-Address': ip.address(),
			'App-User': _.get(req, 'me.id', 0),
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
			
			if (options.result) return _.get(result, options.result);
			
			return result;	        
        }
        catch (err) {
	        
	        __app.debugger.info('api.helpers.core.api.connect - Error!');
	        
	        return err;
        }
	}
}
