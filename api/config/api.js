/**
 * Api.js
 *
 * @author 		:: Philleep Florence
 * @description :: Holds API runtime configuration.
 * @directory 	:: api/config
 */

require('dotenv').config();

module.exports = {
	directus: {	
		domain: process.env.API_URL,		
		endpoints: {
			analytics: {
				url: ':domain/api/analytics'
			},
			colors: {
				url: ':domain/api/styles/colors'
			},
			compile: {
				url: ':domain/api/compile'
			},
			notifications: {
				url: ':domain/api/notifications'
			},
			items: {
				url: ':domain/api/1.1/tables/:collection/rows'
			},
			item: {
				url: ':domain/api/1.1/tables/:collection/rows/:id'
			},
			bulk: {
				url: ':domain/api/1.1/tables/:collection/rows/bulk'
			},
			thumbnailer: {
				url: ':domain/thumbnail/{{width}}/{{height}}/contain/{{image}}'
			},
			auth: {
				settings: {
			        url: ':domain/api/auth/settings'
		        },
		        confirm: {
			        url: ':domain/api/auth/confirm'
		        },
		        credentials: {
			        url: ':domain/api/auth/credentials'
		        },
		        login: {
			        url: ':domain/api/auth/login'
		        },
		        logout: {
			        url: ':domain/api/auth/logout'
		        },
		        metadata: {
			        url: ':domain/api/auth/metadata'
		        },
		        reset: {
			        url: ':domain/api/auth/reset'
		        },
		        register: {
			        url: ':domain/api/auth/register'
		        }
			},
	        form: {
				submit: {
			        url: ':domain/api/form/submit'
		        },
		        update: {
			        url: ':domain/api/form/update'
		        },
		        upload: {
			        url: ':domain/api/1.1/files'
		        }
	        },
	        search: {
		        app: {
			        url: ':domain/api/search/app'
		        },
		        cache: {
			        url: ':domain/api/search/cache'
		        }
	        }
		},	
		collections: {
			activity: 'directus_activity',
			error: 'app_errors',
			files: 'directus_files',
			mailbox: 'app_mailbox',
			users: {
				rows: 'app_users',
				metadata: 'joins_app_users_metadata'
			}
		},			
		credentials: {
			access_token: process.env.API_TOKEN
		}
	}
}
