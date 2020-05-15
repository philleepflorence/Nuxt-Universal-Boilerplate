/**
 * Main Store
 *
 * @author :: Philleep Florence
 * @module      :: Main Store
 * @description :: Main Store - Main Application Store and Data - Loaded from API - Readonly!
 *
 */
 
import { forEach, get, set } from 'lodash';

export const state = () => ({
	api: {},
	user: {}
});

export const getters = {
	GET: (state) => (key) => {
		let value = get(state, key);
		
		if (typeof value !== "undefined") return value;
		
		if (typeof window === "object") {
			value = window.localStorage.getItem(key);
			
			if (typeof value !== "string") return JSON.parse(value);			
		}
		
		return value;
	},
	USER: (state) => (key) => {
		let value = get(state.user, key);

		if (typeof value !== "undefined") return value;
		
		let username = get(state.user, 'username');

		if (typeof window === "object" && username) {
			let currkey = `user:${ username }:${ key }`;
			
			value = window.localStorage.getItem(currkey);
			
			if (typeof value === "string") return JSON.parse(value);			
		}
		
		return value;
	}
};

export const mutations = {
	INIT_STORE (state, payload) {
		forEach(payload, (row, index) => {
			if (state[index]) {
				set(state, index, row);
			}
			else {
				set(state, `api.${ index }`, row);
			}
		});
	},
	INIT_USER (state, payload) {
		set(state, 'user', payload);
	},
	SET (state, payload) {
		if (typeof payload.key === 'string') {
			set(state, payload.key, payload.data);
			
			if (payload.storage === true && typeof window === "object") {
				window.localStorage.setItem(payload.key, JSON.stringify(payload.data));
			}			
		}
	},
	USER (state, payload) {
		if (typeof payload.key === 'string' && state.user) {
			let username = get(state.user, 'username');
			
			set(state.user, payload.key, payload.data);
			
			if (payload.storage === true && typeof window === "object" && username) {
				let key = `user:${ username }:${ payload.key }`;
				
				window.localStorage.setItem(key, JSON.stringify(payload.data));
			}			
		}
	}
};

export const actions = {
	nuxtServerInit ({ commit }, { req }) {				
		if (req.store) {
			commit('INIT_STORE', req.store);
		}
		
		let user = req.me || req.session.user || null;
				
		if (user) {
			commit('INIT_USER', user);
		}
	}
};