/**
 * App.js
 *
 * @author 		:: Philleep Florence
 * @description :: Holds Project Specific API runtime configuration.
 * @directory 	:: api/config
 */

require('dotenv').config();

module.exports = {
	bootstrapVue: {
		componentPlugins: [
		    'AlertPlugin',
		    'ButtonPlugin', 
		    'DropdownPlugin',
			'FormPlugin',
			'FormCheckboxPlugin',
			'FormFilePlugin',
			'FormInputPlugin',
			'FormRadioPlugin',
			'FormSelectPlugin',
			'FormTextareaPlugin',
		    'SpinnerPlugin',
		    'TooltipPlugin'
	    ],
	    directivePlugins: [
		    'VBTooltipPlugin'
	    ]
	},
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
		*/
	},
	routes (routes, resolve, dirname) {
		/*
			Extend the routes that do not follow the blueprint
		*/	
	}
}
