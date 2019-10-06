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
			path: "COMMIT.md",
			create: true,
			content: "# Change Log"
		},
		{
			path: "__package.json"
		},
		{
			path: "nuxt.config.js"
		},
		{
			path: "__.env"
		},
		{
			path: "boilerplate.config.js"
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
			path: "assets/styles/mixins",
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
			path: "assets/styles/project.less",
			create: true,
			content: "/* Project Specific Styles! */"
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