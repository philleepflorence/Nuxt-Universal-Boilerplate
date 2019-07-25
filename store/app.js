/**
 * App Store
 *
 * @author :: Philleep Florence
 * @module      :: App Store
 * @description :: App Store - Core Application Store  - Read and Write!
 *
 */
 
import _ from 'lodash';

export const state = () => ({
	endpoints: {
		auth: {
			login: '/api/auth/login',
			register: '/api/auth/register',
			reset: '/api/auth/reset',
			credentials: '/api/auth/credentials'
		},
		form: {
			submit: '/api/auth/submit',
			update: '/api/auth/update'
		},
		user: {
			options: '/api/auth/options',
			settings: '/api/auth/settings'
		}
	},
	scrollBar: {
		options: {
			className: "os-theme-dark",
			resize: "none",
			autoUpdate: true,
			overflowBehavior: {
				x: "hidden"
			}
		}
	},
	timer: {
		transition: 800
	},
	cache: {
		
	},
	form: {
		changed: false
	},
	feed: {
		rows: 20
	},
	options: {}
});

export const mutations = {
	SET (state, payload) {
		if (typeof payload.key === 'string') {
			_.set(state, payload.key, payload.data);			
		}
	}
};