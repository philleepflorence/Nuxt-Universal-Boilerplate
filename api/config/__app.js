/**
 * App.js
 *
 * @author 		:: Philleep Florence
 * @description :: Holds Project Specific API runtime configuration.
 * @directory 	:: api/config
 */

require('dotenv').config();

import moment from 'moment';

module.exports = {
	directus: {	
		collections: {
			/*
				Enter project specific collections configuration!
				See api/config/api.js for examples.
			*/
		},			
		credentials: {
			access_token: process.env.API_TOKEN
		}
	},
	initialize: {
		/*
			Project specific data to load on initial load
			See api/config/initialize.js for examples.
		*/
	}
}
