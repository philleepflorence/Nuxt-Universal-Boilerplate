/**
 * App Store
 *
 * @author :: Philleep Florence
 * @module      :: App Store
 * @description :: App Store - Core Application Store  - Read and Write!
 *
 */
 
import { get as __Get, set as __Set } from 'lodash';

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
	options: {},
	routes: {
		parent: null,
		history: []
	}
});

export const mutations = {
	CONTENT (state, payload) {
		if (payload && payload.id) {
			state.content = payload;			
		}
	},
	HISTORY (state, payload) {
		if (typeof payload === 'string') {
			state.routes.parent = payload;			
		}
		else if (payload === false) {
			state.routes.parent = null;	
		}
	},
	ROUTES (state, payload) {
		if (typeof payload === 'string') {
			state.routes.history.push(payload);			
		}
	},
	SET (state, payload) {
		if (typeof payload.key === 'string') {
			__Set(state, payload.key, payload.data);			
		}
	}
};