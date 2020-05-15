const pkg = require('./package');
const config = require('./app.config.js');

const path = require('path');
const fs = require('fs');

require('dotenv').config();

module.exports = {
    mode: 'universal',
    
    globalName: process.env.APP_ID,
    
    globals: {
		id: globalName => `${globalName}`,
		nuxt: globalName => `$${globalName}`,
		context: globalName => `__${globalName.toUpperCase()}__`,
		pluginPrefix: globalName => globalName,
		readyCallback: globalName => `onAppReady`,
		loadedCallback: globalName => `onAppLoaded`
    },
    
    server: {
	    port: process.env.SERVER_PORT,
	    host: process.env.SERVER_HOST,
	    timing: {
		    total: true
	    },
	    https: {
		    key: process.env.LOCALHOST_KEY ? fs.readFileSync(path.resolve(process.env.LOCALHOST_KEY)) : null,
			cert: process.env.LOCALHOST_CRT ? fs.readFileSync(path.resolve(process.env.LOCALHOST_CRT)) : null
	    }
    },
    
    serverMiddleware: [
	    '~/api/index.js',
	    '~/api/policies/app',
	    '~/api/policies/redirect',
	    '~/api/policies/auth',
	    '~/api/policies/page'
    ],

    /*
     ** Custom Routes - Extend Project Dynamic Routes
     */
	router: {
		middleware: 'auth',
		extendRoutes (routes, resolve) {
			routes.push({
				path: '/forms/:form',
				component: resolve(__dirname, 'pages/forms/form.vue'),
				name: 'forms-page'
			});	
			
			routes.push({
				path: '/glossary',
				component: resolve(__dirname, 'pages/glossary/glossaries.vue'),
				name: 'glossary-page'
			});	
			
			routes.push({
				path: '/glossary/:type/:slug',
				component: resolve(__dirname, 'pages/glossary/glossary.vue'),
				name: 'glossary-page-item'
			});
			
			routes.push({
				path: '/help/:category/:slug',
				component: resolve(__dirname, 'pages/help/index.vue'),
				name: 'help-page-item'
			});
			
			routes.push({
				path: '/legal/:slug',
				component: resolve(__dirname, 'pages/legal/item.vue'),
				name: 'legal-page-item'
			});
			
			routes.push({
				path: '/auth/reset/:salt',
				component: resolve(__dirname, 'pages/auth/reset.vue'),
				name: 'auth-page-reset'
			});
			
			routes.push({
				path: '/user/profile/:username',
				component: resolve(__dirname, 'pages/user/profile.vue'),
				name: 'user-page-profile-username'
			});
			
			routes.push({
				path: '/user/profile/account/:section',
				component: resolve(__dirname, 'pages/user/profile.vue'),
				name: 'user-page-profile-account'
			});
			
			routes.push({
				path: '/user/settings/account/:section',
				component: resolve(__dirname, 'pages/user/settings.vue'),
				name: 'user-page-account-settings'
			});
			/*
				See api/config/app.js -> routes()
			*/
			config.routes(routes, resolve, __dirname);
		}
	},
	 
    /*
     ** Headers of the page
     */
    head: {
        title: pkg.name,
        meta: [
        	{
                charset: 'utf-8'
            },
            {
                name: 'env',
                content: process.env.SERVER_ENVIRONMENT
            },
            {
                name: 'robots',
                content: 'noindex'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui'
            },
            {
                name: 'HandheldFriendly',
                content: 'true'
            },
            {
                name: 'fonts',
                content: process.env.APP_FONT_FAMILY
            }
        ],
        link: [
        	{
		        rel: 'stylesheet',
		        href: process.env.APP_FONTS
	        },
	        {
		        rel: 'stylesheet',
		        href: `${ process.env.CDN_URL }/app/vendors/material-design-icons/css/materialdesignicons.css`,
		        dataSrc: 'https://materialdesignicons.com/'
	        },
	        {
		        rel: 'stylesheet',
		        href: `${ process.env.CDN_URL }/app/vendors/animate.css/animate.css`,
		        dataSrc: 'https://daneden.github.io/animate.css/'
	        },
	        {
		        rel: 'stylesheet',
		        href: `${ process.env.CDN_URL }/app/vendors/overlayscrollbars/css/OverlayScrollbars.min.css`,
		        dataSrc: 'https://kingsora.github.io/OverlayScrollbars'
	        }
        ],
        script: [
	        {
		        src: `${ process.env.CDN_URL }/app/vendors/overlayscrollbars/js/OverlayScrollbars.min.js`,
		        dataSrc: 'https://kingsora.github.io/OverlayScrollbars'
        	},
	        {
		        src: `${ process.env.CDN_URL }/app/vendors/overlayscrollbars/js/Extensions.min.js`,
		        dataSrc: 'https://github.com/parsisolution/os-scroll-chain'
        	}
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: process.env.APP_LOADER_COLOR,
        height: '4px',
        continuous: true
    },

    /*
     ** Global CSS
     */
    css: [
	    { src: '~/assets/styles/importer.less', lang: 'less' }
    ],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [],

    /*
     ** Nuxt.js modules
     */
    modules: [
	    /*
	     ** https://axios.nuxtjs.org/usage
	     */
        '@nuxtjs/axios',
	    /*
	     ** https://bootstrap-vue.js.org/docs/
	     */
        'bootstrap-vue/nuxt',
	    /*
	     ** https://pwa.nuxtjs.org/
	     */
        '@nuxtjs/pwa',
	    /*
	     ** https://github.com/nuxt-community/dotenv-module
	     */
        '@nuxtjs/dotenv',
	    /*
	     ** https://www.npmjs.com/package/nuxt-session
	     */
        [
        	'nuxt-session', 
        	(session) => {
	        	
	        	const RedisStore = require('connect-redis')(session);
				const redis = require('redis');

				let redisClient = redis.createClient({
					host: process.env.REDIS_HOST,
					port: process.env.REDIS_PORT,
					password: process.env.REDIS_PASSWORD,
					db: process.env.REDIS_DB
				});
				redisClient.unref();
				redisClient.on('error', console.log);
				
				let $store = new RedisStore({ client: redisClient });
	        	
	        	return {
		        	name: 'redis-session-id',
                    store: $store,
                    secret: process.env.REDIS_SECRET,
                    
                    cookie: { 
                        maxAge: process.env.APP_COOKIES_EXPIRE * 1000
                    },
                    saveUninitialized: true,
                    resave: false
	        	};
        	}
        ],
	    /*
	     ** https://www.npmjs.com/package/cookie-universal-nuxt
	     */
        ['cookie-universal-nuxt', { alias: 'cookie' }]
    ],
    /*
     ** Axios module configuration
     */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        analyze: process.env.BUILD_ANALYZER === 'true',
	    optimization: {
		    runtimeChunk: 'single',
		    splitChunks: {
		        chunks: 'all',
			    automaticNameDelimiter: '.',
			    name: false,
			    minSize: 10000,
			    maxSize: 200000,
			    cacheGroups: {
				    styles: {
					    test: /\.s?css$/,
					    name: 'styles',
					    enforce: true,
					    chunks: 'all'
				    },
				    vendor: {
					    test: /[\\/]node_modules[\\/]/,
					    name(module) {
						    const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];					    
						    return `npm.${packageName.replace('@', '')}`;
					    }
				    }
			    }
	        }
	    },
        watch: [],
        extractCSS: {
	        ignoreOrder: true
        },
        filenames: {
	        app: ({ isDev }) => isDev ? 'app.[name].js' : 'app.[chunkhash].js',
	        chunk: ({ isDev }) => isDev ? 'chunk.[name].js' : 'chunk.[id].[chunkhash].js',
	        css: ({ isDev }) => isDev ? 'style.[name].css' : 'style.[contenthash].css'
        },
        stats: {
	        colors: true,
	        logging: 'verbose'
        }
    },

    /*
     ** Custom configuration - See api/config/app.js -> bootstrapVue
     */
    bootstrapVue: {
	    componentPlugins: config.bootstrapVue.componentPlugins,
	    directivePlugins: config.bootstrapVue.directivePlugins
    },

    /*
     ** PWA Manifest and Meta Configuration
     */
    pwa: {
	    manifest: {
		    short_name: process.env.APP_SHORT_NAME,
		    name: process.env.APP_NAME,
		    start_url: process.env.APP_START_URL,
		    background_color: process.env.APP_THEME_COLOR,
		    theme_color: process.env.APP_THEME_COLOR,
		    display: "standalone",
		    orientation: "portrait",
		    prefer_related_applications: true,
		    screenshots: config.pwa.manifest.screenshots
	    }
    }
}