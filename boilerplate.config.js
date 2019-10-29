/**
 * Boilerplate.js
 *
 * @author 			:: Philleep Florence
 * @description 	:: Nuxt Universal Boilerplate Configuration - syncs core folders and files across projects.
 * @directory 		:: api/config
 */

const pkg = require('./package');

require('dotenv').config();

module.exports = {
	configuration: {
		environment: process.env.SERVER_ENVIRONMENT,
		source: __dirname,
		destination: process.env.APP_BOILERPLATE
	},
	paths: [
		{
			path: "README.md"
		},
		{
			path: "COMMIT.md"
		},
		{
			path: "__package.json"
		},
		{
			path: "__app.config.js"
		},
		{
			path: "__.env"
		},
		{
			path: "boilerplate.config.js"
		},
		{
			path: "nuxt.config.js"
		},
		{
			path: "api/index.js"
		},
		{
			path: "api/config/api.js"
		},
		{
			path: "api/config/__app.js"
		},
		{
			path: "api/config/form.js"
		},
		{
			path: "api/config/initialize.js"
		},
		{
			path: "api/config/router.js"
		},
		{
			path: "api/controllers/app",
			recursive: true
		},
		{
			path: "api/controllers/auth",
			recursive: true
		},
		{
			path: "api/controllers/cache",
			recursive: true
		},
		{
			path: "api/controllers/contents/README.md"
		},
		{
			path: "api/controllers/form",
			recursive: true
		},
		{
			path: "api/controllers/webhooks",
			recursive: true
		},
		{
			path: "api/controllers/wiki",
			recursive: true
		},
		{
			path: "api/helpers/core",
			recursive: true
		},
		{
			path: "api/policies",
			recursive: true
		},
		{
			path: "assets/styles/modules",
			recursive: true
		},
		{
			path: "assets/styles/app.less"
		},
		{
			path: "assets/styles/importer.less"
		},
		{
			path: "assets/styles/__project.less",
			create: true,
			content: "/* Project Specific Styles! */"
		},
		{
			path: "assets/styles/mixins/functions.less"
		},
		{
			path: "assets/styles/mixins/mixins.less"
		},
		{
			path: "assets/styles/mixins/utilities.less"
		},
		{
			path: "assets/styles/mixins/__colors.less",
			create: true,
			content: "/* Bootstrap Color Definitions - Load from API Colors Endpoint! - /api/webhooks/colors */"
		},
		{
			path: "assets/styles/mixins/__project.less",
			create: true,
			content: "/* Project Specific Definitions and Mixins! */ \n\n@fontaccent: sans-serif; \n@fontmain: sans-serif;"
		},
		{
			path: "components/core",
			recursive: true
		},
		{
			path: "helpers/core",
			recursive: true
		},
		{
			path: "layouts/app.vue"
		},
		{
			path: "layouts/error.vue"
		},
		{
			path: "middleware",
			recursive: true
		},
		{
			path: "store/app.js"
		},
		{
			path: "store/contents.js"
		},
		{
			path: "store/event.js"
		},
		{
			path: "store/index.js"
		},
		{
			path: "pages/auth",
			recursive: true
		},
		{
			path: "pages/user",
			recursive: true
		}
	]	
}