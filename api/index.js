/**
 * Main API Server and Routes
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Middleware for Next and Nuxt SSR Applications
 * @description :: Express Server Middleware - Main API Server and Routes.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api
 *
 */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const app = express();

import _ from 'lodash';

global.__app = global.__app || {};

app.use(bodyParser.urlencoded({ limit: process.env.MAX_UPLOAD_SIZE, extended: true }));
app.use(bodyParser.json({ limit: process.env.MAX_UPLOAD_SIZE }));

/*
	Initialize Session - Use Redis for Cluster Mode!!!
	Saving in memory will cause leaks and conflicts/duplicates.
*/

app.use(session({
	name: 'redis-session-id',
    store: new RedisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }),
    secret: process.env.REDIS_SECRET,
    
    cookie: { 
        maxAge: process.env.APP_COOKIES_EXPIRE * 1000
    },
    saveUninitialized: true,
    resave: false
}));

/*
	API Global Middleware - Only GET and POST are allowed
	PUT, DELETE, and Others should be handled by the Directus API
	__app.debugger only runs in development mode!
	__app.data = Runtime Configuration from Directus API
*/

app.use(async function (req, res, next)
{
	await __app.helpers.core.logger(process.env.SERVER_DEBUG || req.query.debug);
		
	__app.debugger.info('api.index - Middleware - Request Path: `%s` - Request Type: `%s`', req.path, req.method);
		
	const method = req.method.toLowerCase();
	
	if (!['get', 'post'].includes(method)) return res.status(405).send();
	
	__app.data = await __app.helpers.core.app.initialize(req, res, true);
	
	if (__app.data === false) return res.status(500).send("Initialization Data Failure - See Logs for details!");
	
	next();
});

/*
	Blueprint Controller Routing
	Only controllers </api/controllers/*> are exposed as Rest API endpoints!
	Excludes .git, .svn, and __boilerplate copies!
	REQUIRED:
		module.exports = {
			token: @Boolean - requires APP_TOKEN to process and for testing
			run () => {},
			[...]
		}
*/

__app.helpers = __app.helpers || require('require-all')({
	dirname: __dirname + '/helpers',
	recursive: true,
	excludeDirs: /^\.(git|svn)$|^__.*$/
});

__app.config = __app.config || require('require-all')({
	dirname: __dirname + '/config',
	recursive: true,
	excludeDirs: /^\.(git|svn)$|^__.*$/
});

__app.controllers = __app.controllers || require('require-all')({
	dirname: __dirname + '/controllers',
	recursive: true,
	excludeDirs: /^\.(git|svn)$|^__.*$/
});

/*
	API Routes - Dynamic Routes :: Directory path must match routes
	Place all other defined routes above this directive!
*/

app.get('/auth/confirm/:salt', __app.controllers.auth.confirm.run);

app.get('/app/mailbox/:uuid', __app.controllers.app.mailbox.run);

app.all('*', async function (req, res, next) {
	
	__app.debugger.info('api.index - Express Router Middleware');
	
	if (process.env.SERVER_ENVIRONMENT === 'production' && req.query.token !== process.env.APP_TOKEN) req.query.debug = null;
	
	const data = __app.helpers.core.cache.$.get('app');
	const path = req.path.replace(/^\/|\/$/g, '').replace(/\//g, '.');
	const controller = _.get(__app.controllers, path);
	
	if (!controller) return res.status(404).send();
	
	if (controller.method && controller.method !== req.method) return res.status(405).send();
	
	if (controller.token && req.query.token !== process.env.APP_TOKEN) return res.status(403).send();
	
	__app.debugger.info('api.index - Controller: `%s`', path);
	
	if (typeof controller.run === 'function') return controller.run(req, res, next);
	else return res.status(500).send();
});

/*
	Export Express Server Middleware
	All routes /api/* will be handled by Express!
	All other routes are handled by Next/Nuxt.
*/

module.exports = {
	path: '/api',
	handler: app
};