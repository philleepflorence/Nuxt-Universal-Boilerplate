/**
 * App Store
 *
 * @author :: Philleep Florence
 * @module      :: App Store
 * @description :: App Store - Core Application Store  - Read and Write!
 *
 */

export const state = () => ({
	dispatched: []
});

export const mutations = {
	SET (state, payload) {
		if (typeof payload === 'string') payload = [payload];
		state.dispatched = payload;
	}
};