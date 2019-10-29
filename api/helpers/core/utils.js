/**
 * App Utils Helper
 *
 * @author 			:: Philleep Florence
 * @module      	:: App Utils Helper
 * @description 	:: App Utils Helper - Methods to assist in processing generic data
 * @docs        	:: https://nuxtjs.org/guide/plugins
 * @directory 		:: api/helpers/core
 *
 */
 
import _ from 'lodash';

module.exports = {
	
	/*
		Recursive find value via key
	*/
	
	find (object, property) {
		
		if (_.get(object, property)) return _.get(object, property);
		
		for(var key in object)
		{
			var obj = object[key];
			
			if (!obj || typeof obj !== "object") continue;
			
			if (!obj.hasOwnProperty(property)) return __app.helpers.core.utils.find(obj, property);
			
			return _.get(obj, property);
		}
	}
}