const pkg = require('./package');

require('dotenv').config();

module.exports = {
    mode: 'universal',
    
    globalName: 'name-of-project',
    
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
			/*
				Add all custom routes that do not follow the standard boilerplate!
			*/			
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
                content: 'Josefin Sans,Encode Sans Condensed,Material Design Icons'
            }
        ],
        link: [
        	{
		        rel: 'stylesheet',
		        href: 'https://fonts.googleapis.com/css?family=Encode+Sans+Condensed:400,500,600,700|Josefin+Sans:300,400,600,700'
	        },
	        {
		        rel: 'stylesheet',
		        href: `${ process.env.CDN_URL }/vendors/material-design-icons/css/materialdesignicons.css`
	        },
	        {
		        rel: 'stylesheet',
		        href: `${ process.env.CDN_URL }/vendors/animate.css/animate.css`
	        },
	        {
		        rel: 'stylesheet',
		        href: `${ process.env.CDN_URL }/vendors/overlayscrollbars/css/OverlayScrollbars.min.css`
	        }
        ],
        script: [
	        {
		        src: `${ process.env.CDN_URL }/vendors/overlayscrollbars/js/OverlayScrollbars.min.js`,
		        dataSrc: 'https://kingsora.github.io/OverlayScrollbars'
        	},
	        {
		        src: `${ process.env.CDN_URL }/vendors/overlayscrollbars/js/Extensions.min.js`,
		        dataSrc: 'https://github.com/parsisolution/os-scroll-chain'
        	},
        	{
		        src: `${ process.env.CDN_URL }/vendors/waypoints/lib/noframework.waypoints.min.js`,
		        dataSrc: 'http://imakewebthings.com/waypoints/'
        	},
        	{
		        src: `${ process.env.CDN_URL }/vendors/waypoints/lib/shortcuts/inview.min.js`,
		        dataSrc: 'http://imakewebthings.com/waypoints/shortcuts/inview/'
        	}
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: '#bca474',
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
	        	
	        	return {
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
        extend(config, ctx) {},
        watch: [],
        extractCSS: true,
        filenames: {
	        app: ({ isDev }) => isDev ? 'app.[name].js' : 'app.[chunkhash].js',
	        chunk: ({ isDev }) => isDev ? 'chunk.[name].js' : 'chunk.[id].[chunkhash].js',
	        css: ({ isDev }) => isDev ? 'style.[name].css' : 'style.[contenthash].css'
        }
    },

    /*
     ** Custom configuration
     */
    bootstrapVue: {
	    componentPlugins: [
		    'AlertPlugin',
		    'ButtonPlugin', 
		    'DropdownPlugin',
			'FormPlugin',
			'FormCheckboxPlugin',
			'FormFilePlugin',
			'FormGroupPlugin',
			'FormInputPlugin',
			'FormRadioPlugin',
			'FormSelectPlugin',
			'FormTextareaPlugin',
			'ModalPlugin',
		    'PopoverPlugin',
		    'SpinnerPlugin',
		    'TablePlugin',
		    'TooltipPlugin'
	    ],
	    directivePlugins: [
		    'VBPopoverPlugin', 
		    'VBTooltipPlugin'
	    ]
    }
}