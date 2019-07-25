/**
 * API Helper
 *
 * @author 		:: Philleep Florence
 * @module      :: API Helper
 * @description :: API Helper - HandleBars Templating Engine
 * @docs        :: https://nuxtjs.org/guide/plugins
 * @directory 	:: api/helpers/core
 *
 */
 
import _ from 'lodash';
import handlebars from 'handlebars';

module.exports = {
	/*
		PARAMETERS:
			source - @String - Content to compile - REQUIRED
			layout - @Object - Dictionary or array to use when compiling - REQUIRED
			data - @String - Layout in which to place compiled template - OPTIONAL
			key - @String - Dot syntax key to use when adding source to layout - OPTIONAL
	*/
	async render (source, data, layout, key) {
		
		if (!data) return '';
		
		let template = handlebars.compile(source);
		let result = template(data);
		
		if (!key || typeof layout !== 'string') return result;
		
		template = handlebars.compile(layout);
		
		let _data = Object.assign(data, {
			key: result
		});
		
		result = template(_data);
		
		return result;
	}	
}
