/**
 * Format Helper
 *
 * @author :: Philleep Florence
 * @module      :: Logger Helper
 * @description :: Logger Helper - Formats Numerical and String objects into readable formats
 *
 */
 

import _ from 'lodash';
import humanFormat from 'human-format';
import stringFormat from 'string-format';

module.exports = {
	
	formats: {
		bytes : new humanFormat.Scale({
			KB: 1024,
			MB: 1048576,
			GB: 1073741824,
			TB: 1099511627776,
			PB: 1125899906842624
		}),
		time : new humanFormat.Scale({
			seconds: 1,
			minutes: 60,
			hours: 3600,
			days: 86400,
			months: 2592000,
			years: 31104000
		})
	},
	
	/*
		Numerical Format - https://www.npmjs.com/package/human-format
	*/
	
	human (input, options) {
		
		options = options || {};
		
		let scale = options.scale;
	
		if (_.get(this.formats, scale)) options.scale = _.get(this.formats, scale);
		
		const response = humanFormat(input, options);
		
		return response;
		
	}
}