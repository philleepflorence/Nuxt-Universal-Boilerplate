const pkg = require('./package');

require('dotenv').config();

module.exports = {
    mode: 'universal',
    
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
				Articles - Feed, Filters, and Item
			*/
			routes.push({
				path: '/articles',
				component: resolve(__dirname, 'pages/articles/feed.vue'),
				name: 'articles',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/articles/article.vue'),
						name: 'article'
					}
				]
			});
			
			/*
				Beverages - Feed, Filters, Sections, and Item
			*/
			routes.push({
				path: '/beverages',
				component: resolve(__dirname, 'pages/beverages/feed.vue'),
				name: 'beverages'
			});
			routes.push({
				path: '/beverages/brands',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'brands',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'brand'
					}
				]
			});
			routes.push({
				path: '/beverages/cocktails',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'cocktails',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'cocktail'
					}
				]
			});
			routes.push({
				path: '/beverages/condiments',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'condiments',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'condiment'
					}
				]
			});
			routes.push({
				path: '/beverages/countries',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'countries',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'country'
					}
				]
			});
			routes.push({
				path: '/beverages/factories',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'factories',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'factory'
					}
				]
			});
			routes.push({
				path: '/beverages/garnishes',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'garnishes',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'garnish'
					}
				]
			});
			routes.push({
				path: '/beverages/manufacturers',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'manufacturers',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'manufacturer'
					}
				]
			});
			routes.push({
				path: '/beverages/products',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'products',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'product'
					}
				]
			});
			routes.push({
				path: '/beverages/regions',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'regions',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'region'
					}
				]
			});
			routes.push({
				path: '/beverages/sources',
				component: resolve(__dirname, 'pages/beverages/section.vue'),
				name: 'sources',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/beverages/beverage.vue'),
						name: 'source'
					}
				]
			});
			
			/*
				Events - Feed, Filters, and Item
			*/
			routes.push({
				path: '/events',
				component: resolve(__dirname, 'pages/events/feed.vue'),
				name: 'events',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/events/event.vue'),
						name: 'event'
					}
				]
			});
			
			/*
				Venues - Feed, Filters, and Item
			*/
			routes.push({
				path: '/venues',
				component: resolve(__dirname, 'pages/venues/feed.vue'),
				name: 'venues',
				children: [
					{
						path: ':id?/:slug?',
						component: resolve(__dirname, 'pages/venues/venue.vue'),
						name: 'venue'
					}
				]
			});
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
        color: '#FFFFFF',
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
        watch: []
    },

    /*
     ** Custom configuration
     */
    bootstrapVue: {
	    componentPlugins: [
		    'AlertPlugin',
		    'ButtonPlugin', 
		    'ButtonGroupPlugin',
		    'CardPlugin',
		    'DropdownPlugin',
			'FormPlugin',
			'FormCheckboxPlugin',
			'FormFilePlugin',
			'FormGroupPlugin',
			'FormInputPlugin',
			'FormRadioPlugin',
			'FormSelectPlugin',
			'FormTextareaPlugin',
			'ImagePlugin',
			'InputGroupPlugin',
		    'LayoutPlugin',
		    'ListGroupPlugin',
			'ModalPlugin',
		    'NavbarPlugin',
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