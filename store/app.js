/**
 * App Store
 *
 * @author :: Philleep Florence
 * @module      :: App Store
 * @description :: App Store - Core Application Store  - Read and Write!
 *
 */
 
import { get, set } from 'lodash';

export const state = () => ({
	endpoints: {
		auth: {
			login: '/api/auth/login',
			register: '/api/auth/register',
			reset: '/api/auth/reset',
			credentials: '/api/auth/credentials',
			user: '/api/auth/user'
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
				x: "hidden",
				y: "scroll"
			},
			scrollbars: {
				autoHide: "leave",
				visibility: "auto"
			}
		}
	},
	timer: {
		transition: 800
	},
	cache: {},
	form: {
		changed: false
	},
	feed: {
		rows: 20
	},
	metadata: {},
	options: {},
	regex: {
		iOS: /(CriOS|iPad|iPhone)/
	},
	routes: {
		host: process.env.SERVER_DOMAIN,
		parent: null,
		history: []
	}
});

export const getters = {
	GET: (state) => (key) => {
		let value = get(state, key);
		
		if (typeof value !== "undefined") return value;
		
		if (typeof window === "object") {
			value = window.localStorage.getItem(key);
			
			if (typeof value !== "undefined") return JSON.parse(value);			
		}
		
		return value;
	}
};

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
	METADATA (state, payload) {
		if (typeof payload.key === 'string') {
			set(state.metadata, payload.key, payload.data);			
		}
	},
	ROUTES (state, payload) {
		if (typeof payload === 'string') {
			state.routes.history.push(payload);			
		}
	},
	REMOVE (state, payload) {
		if (typeof payload.key === 'string') {
			set(state, payload.key, null);
			
			if (payload.storage === true && typeof window === "object") {
				window.localStorage.removeItem(payload.key);
			}			
		}
	},
	SET (state, payload) {
		if (typeof payload.key === 'string') {
			set(state, payload.key, payload.data);
			
			if (payload.storage === true && typeof window === "object") {
				window.localStorage.setItem(payload.key, JSON.stringify(payload.data));
			}			
		}
	}
};