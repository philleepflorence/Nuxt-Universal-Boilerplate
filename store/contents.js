/**
 * Contents Store
 *
 * @author 		:: Philleep Florence
 * @module      :: Contents Store
 * @description :: Contents Store - Page Contents Store - Read & Write - Should load from Directus!
 *
 */
 
import { get as __Get, set as __Set } from 'lodash';
import superagent from 'superagent';
import uuid from 'uuid-by-string';

export const state = () => ({
	
});

export const mutations = {
	SET (state, payload) {
		if (typeof payload.key === 'string') {
			__Set(state, payload.key, payload.data);			
		}
	}
};

export const actions = {
	CACHE ({ commit }, options) {
		let query = options.query || {};
		let hash = uuid(`${ options.url }-${ JSON.stringify(query) }`);
		let key = `${ options.collection }.${ hash }`;
		
		commit('SET', {
			key: key,
			data: options.data
		});
	},
	async LOAD ({ commit, state }, options) {	
		let url = options.url;
					
		if (process.server) url = `${ process.env.SERVER_DOMAIN }${ url }`;
		
		options = options || {};
		
		let cache = typeof options.cache === 'boolean' ? options.cache : true;
		
		let query = options.query || {};
		let hash = uuid(`${ url }-${ JSON.stringify(query) }`);
		let key = `${ options.collection }.${ hash }`;
		
		if (cache === true) {
			let currcache = __Get(state, key);
			
			if (currcache) {
				return currcache;
			}
		}
		
		options.response = options.response || 'body';
		
		options.headers = options.headers || {};
		options.headers = Object.assign({
			'Content-type': 'application/json'
		}, options.headers); 
		
		query.xhr = true;
		
		try {
        
			const result = await superagent('GET', url)
			.set(options.headers)
			.query(query);
			
			let data = __Get(result, options.response);
			
			if (cache === true && options.collection) {				
				commit('SET', {
					key: key,
					data: data
				});
			}
			
			return data;	        
        }
        catch (err) {
	        
	        return null;
        }
	}
};