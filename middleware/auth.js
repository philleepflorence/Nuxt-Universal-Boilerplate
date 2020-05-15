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

import Page from "../helpers/core/page.js";

export default function ({ route, store, redirect }) {
	if (!process.server) {
		if (window.DEBUG) console.log("debug - app.middleware.auth");
		
		let pages = store.state.api.pages;
		let page = Page.get(pages, route.path);
		let login = Page.get(pages, true, 'login');
		let user = store.state.user;
		let privilege;
		let Privilege = Number(page.privilege);
		
		if (user && typeof user.privilege !== "object") privilege = Number(user.privilege);
		else privilege = 0;
		
		if (window.DEBUG) console.log(`debug - app.middleware.auth - Page: ${ page.name } - Page Privilege: ${ Privilege } - User Privilege: ${ privilege }`);
		
		if (Privilege > privilege) {
			store.commit('app/SET', {
				key: "redirect",
				data: route.path
			});
			
			return redirect(login.path);
		}
	}	
}