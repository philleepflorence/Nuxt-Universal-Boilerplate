/**
 * Main Store
 *
 * @author :: Philleep Florence
 * @module      :: Main Store
 * @description :: Main Store - Main Application Store and Data - Loaded from API - Readonly!
 *
 */
 
import { get as __Get, set as __Set, forEach as __forEach } from 'lodash';

export const state = () => ({
	api: {},
	user: {}
});

export const mutations = {
	INIT_STORE (state, payload) {
		__forEach(payload, (row, index) => {
			if (state[index]) {
				__Set(state, index, row);
			}
			else {
				__Set(state, `api.${ index }`, row);
			}
		});
	},
	INIT_USER (state, payload) {
		__Set(state, 'user', payload);
	}
};

export const actions = {
	nuxtServerInit ({ commit }, { req }) {				
		if (req.store) {
			commit('INIT_STORE', req.store);
		}
		
		let user = req.me || req.session.user;
				
		if (user) {
			commit('INIT_USER', user);
		}
	}
};