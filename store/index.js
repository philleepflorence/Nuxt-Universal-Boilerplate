/**
 * Main Store
 *
 * @author :: Philleep Florence
 * @module      :: Main Store
 * @description :: Main Store - Main Application Store and Data - Loaded from API - Readonly!
 *
 */
 
import _ from 'lodash';

export const state = () => ({
	api: {},
	user: {}
});

export const mutations = {
	INIT_STORE (state, payload) {
		_.forEach(payload, (row, index) => {
			if (state[index]) {
				_.set(state, index, row);
			}
			else {
				_.set(state, `api.${ index }`, row);
			}
		});
	},
	INIT_USER (state, payload) {
		_.set(state, 'user', payload);
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