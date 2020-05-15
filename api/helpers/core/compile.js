/**
 * API Helper
 *
 * @author 		:: Philleep Florence
 * @module      :: API Helper
 * @description :: API Helper - Mustache Templating Engine
 * @docs        :: https://nuxtjs.org/guide/plugins
 * @directory 	:: api/helpers/core
 *
 */
 
import {
	template
} from 'lodash';

module.exports = {
	/*
		PARAMETERS:
			source - @String - Content to compile - REQUIRED
			layout - @Object - Dictionary or array to use when compiling - REQUIRED
			data - @String - Layout in which to place compiled template - OPTIONAL
			key - @String - Dot syntax key to use when adding source to layout - OPTIONAL
	*/
	async render (source, data, layout, key, options = { escape: /{{{([\s\S]+?)}}}/g, interpolate: /{{([\s\S]+?)}}/g }) {
		
		if (!data) return '';
				
		let compiled = template(source, options);
		let result = compiled(data);
		
		if (!key || typeof layout !== 'string') return result;
				
		let _data = Object.assign(data, {
			key: result
		});
		
		compiled = template(layout, options);
		result = compiled(_data);
		
		return result;
	}	
}
