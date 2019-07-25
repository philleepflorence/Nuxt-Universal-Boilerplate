/**
 * App Auth Middleware
 *
 * @author 		:: Philleep Florence
 * @module      :: Middleware
 * @description :: App Auth Middleware - Check authenticated user against page privilege - client only.
 * @docs        :: https://nuxtjs.org/guide/routing#middleware
 * @directory 	:: middleware
 *
 */

import _ from 'lodash';
import Page from "../helpers/core/page.js";

export default function ({ route, store, redirect }) {
	if (!process.server) {
		let pages = store.state.api.pages;
		let page = Page.get(pages, route.path);
		let login = Page.get(pages, true, 'login');
		let user = store.state.api.user;
		let privilege = user ? user.privilege : 0;
		
		if (page.privilege > privilege) {
			store.commit('app/SET', {
				key: "redirect",
				data: route.path
			});
			
			return redirect(login.path);
		}
	}	
}