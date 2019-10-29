/**
 * app.config.js
 *
 * @author 		:: Philleep Florence
 * @description :: Holds Project Specific APP configuration
 */

module.exports = {
	bootstrapVue: {
		componentPlugins: [
		    'AlertPlugin',
		    'ButtonPlugin', 
		    'DropdownPlugin',
			'FormPlugin',
			'FormCheckboxPlugin',
			'FormFilePlugin',
			'FormGroupPlugin',
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
	routes (routes, resolve, dirname) {
		/*
			Extend non-blueprint routes: https://nuxtjs.org/guide/routing/
			See example below!
		*/
		routes.push({
			path: '/pathname',
			component: resolve(dirname, 'pages/pathname/parent.vue'),
			name: 'parent',
			children: [
				{
					path: 'pathname/:slug?',
					component: resolve(dirname, 'pages/pathname/child.vue'),
					name: 'child'
				}
			]
		});
	}
}
