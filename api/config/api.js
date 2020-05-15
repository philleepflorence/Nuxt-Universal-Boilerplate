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
				url: ':domain/app/custom/analytics/set'
			},
			colors: {
				url: ':domain/app/custom/styles/variables'
			},
			compile: {
				url: ':domain/app/custom/collections/compile'
			},
			notifications: {
				url: ':domain/app/custom/notifications/send'
			},
			items: {
				url: ':domain/app/items/:collection'
			},
			item: {
				url: ':domain/app/items/:collection/:id'
			},
			bulk: {
				url: ':domain/app/custom/collections/bulk'
			},
			thumbnailer: {
				url: ':domain/thumbnail/{{width}}/{{height}}/contain/{{image}}'
			},
			auth: {
				confirm: {
			        url: ':domain/app/custom/auth/confirm'
		        },
		        credentials: {
			        url: ':domain/app/custom/auth/credentials'
		        },
		        login: {
			        url: ':domain/app/custom/auth/login'
		        },
		        logout: {
			        url: ':domain/app/custom/auth/logout'
		        },
		        reset: {
			        url: ':domain/app/custom/auth/reset'
		        },
		        register: {
			        url: ':domain/app/custom/auth/register'
		        }
			},
			user: {
				settings: {
			        url: ':domain/app/custom/user/settings'
		        },
		        metadata: {
			        url: ':domain/app/custom/user/metadata'
		        }
			},
	        form: {
				submit: {
			        url: ':domain/app/custom/form/submit'
		        },
		        update: {
			        url: ':domain/app/custom/form/update'
		        },
		        upload: {
			        url: ':domain/app/files'
		        }
	        },
	        search: {
		        cache: {
			        url: ':domain/app/custom/search/cache'
		        },
		        database: {
			        url: ':domain/app/custom/search/database'
		        }
	        }
		},	
		collections: {
			activity: 'directus_activity',
			revisions: 'directus_revisions',
			error: 'app_errors',
			files: 'directus_files',
			mailbox: 'app_mailbox',
			users: {
				rows: 'app_users',
				metadata: 'app_users_metadata'
			}
		},			
		credentials: {
			access_token: process.env.API_TOKEN
		}
	}
}
