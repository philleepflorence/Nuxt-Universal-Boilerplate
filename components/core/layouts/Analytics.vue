<template>
	<div></div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import Handlebars from 'handlebars/dist/handlebars.min.js';
	import _ from "lodash";
	
	export default {
		name: "Analytics",
		computed: {
			configuration () {
				return this.$store.state.api.config.analytics;
			},
			downloadtime () {
				const timing = _.get(window, 'performance.timing');
				
				if (!timing) return null;
								
				let loadtime = timing.responseEnd - timing.navigationStart;
				
				return loadtime;
			},
			loadtime () {
				const timing = _.get(window, 'performance.timing');
				
				if (!timing) return null;
								
				let loadtime = timing.loadEventEnd - timing.navigationStart;
				
				return loadtime;
			},
			page () {
				let pages = this.$store.state.api.pages;
				let page = Page.get(pages, Page.path()) || {};
				
				return page;
			},
			path () {
				let pathname = window.location.pathname;
				let hash = window.location.hash;
				
				if (hash) {
					pathname = _.trimEnd(pathname, '/');
					
					return `${ pathname }/${ hash }`;
				}
				
				return pathname;
			},
			rendertime () {
				const timing = _.get(window, 'performance.timing');
				
				if (!timing) return null;
								
				let loadtime = timing.loadEventEnd - timing.responseEnd;
				
				return loadtime;
			}
		},
		data () {
			return {
				enabled: process.env.GOOGLE_ANALYTICS,
				loaded: true,
				timingtimer: 0,
				time: {
					incoming: 0,
					outgoing: 0
				}
			};
		},
		methods: {
			error (e) {				
				let data = {
					message: e.message,
					filename: e.filename,
					url: window.location.href,
					lineNumber: e.lineno,
					columnNumber: e.colno,
					error: _.get(e.error, 'stack'),
					userAgent: navigator.appVersion
				}
				
				Page.post('/app/error', { form: data });
				
				if (this.enabled) {
					this.init(this.path, 'error', {
						message: `${ data.message } @ Line: ${ data.linenumber } on ${ data.url }`,
						params: data
					});					
				}
			},
			/*
				Google Analytics provides a debug version of the analytics.js library
				that logs detailed messages to the Javascript console as its running.
				These messages include successfully executed commands as well as warnings
				and error messages that can tell you when your tracking code is set up incorrectly.
				It also provides a breakdown of each hit sent to Google Analytics,
				so you can see exactly what data is being tracked.
				To override, add variable to URL on page init: analytics=debug
			*/
			google (path, type, params) {			
				const initialize = () => {
					let UUID = _.get(this.configuration, 'google.id');
					let debug = _.get(this.configuration, 'google.debug');
						debug = debug || window.location.search.indexOf('analytics=debug') > 0;
					let urlpath = debug ? 'analytics_debug' : 'analytics';
					
		            if (UUID) {
			            (function (i, s, o, g, r, a, m) {
							i['GoogleAnalyticsObject'] = r;
							i[r] = i[r] ||
								function () {
									(i[r].q = i[r].q || []).push(arguments)
								}, i[r].l = 1 * new Date();
							a = s.createElement(o), m = s.getElementsByTagName(o)[0];
							a.async = 1;
							a.src = g;
							m.parentNode.insertBefore(a, m)
						})(window, document, 'script', `https://www.google-analytics.com/${ urlpath }.js`, 'ga');
			
						ga('create', UUID, 'auto');
			
						if (path === true) {
			                ga('send', 'pageview');
			
			                track();
			            }
		            }	
			            
				};
		
				const track = () => {
					let result = null;
		
					params = params || _.get(this.configuration, `types.${ type }`) || {};
		
					switch (type)
		            {
						case 'timing':
							/* https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings */
		
							ga('send', {
								hitType: 'timing',
								timingCategory: params.category,
								timingVar: 'load',
								timingValue: params.value
							});
		
						break;
		
		                case 'event':
							/* https://developers.google.com/analytics/devguides/collection/analyticsjs/events */
		
							ga('send', {
								hitType: 'event',
								eventCategory: params.category || params.analyticsCategory,
								eventAction: params.action || 'click',
								eventLabel: params.label || params.analyticsLabel,
								eventValue: params.value || params.analyticsValue
							});
		
						break;
		
						case 'pageview':
							/* https://developers.google.com/analytics/devguides/collection/analyticsjs/pages */
		
							ga('send', {
								hitType: 'pageview',
								page: path,
								title: params.title || window.document.title
							});
		
						break;
		
						case 'social':
							/* https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions */
		
							ga('send', {
								hitType: 'social',
								socialNetwork: params.category || params.analyticsCategory,
								socialAction: params.action || 'click',
								socialTarget: params.value || params.analyticsValue
							});
		
						break;
		
						case 'error':
							/* https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions */
		
							ga('send', {
								hitType: 'exception',
								exDescription: params.message,
								exFatal: params.value || false
							});
		
						break;
					}
				};
				
				
				if (!window.ga) initialize();
				else if (window.ga && path && type) track();
			},
			init (path, type, params) {
			    let apis = _.get(this.configuration, 'apis');	 
			    var options = _.get(this.configuration, 'options');
			    			    
			    if (options && _.get(options, type)) {
				    this.send(path, type, params);	
			    }   
				
				if (apis) {
					_.forEach(apis, (value, api) => {
						if (typeof this[api] === 'function' && typeof api === "string") this[api](path, type, params);
					});
				}
				
			},
			initTiming () {
				clearTimeout(this.timingtimer);
				
				this.timingtimer = setTimeout(() => {
					this.timing({
						category: "Application Loaded",
						value: this.loadtime
					});
					
					this.timing({
						category: "Application Rendered",
						value: this.rendertime
					});
					
					this.timing({
						category: "Application Downloaded",
						value: this.downloadtime
					});					
				}, 1000);
			},
			outbound (element, params) {
			    let href = e.currentTarget.href;
			    
			    params = params || {};
				params = _.cloneDeep(params, _.get(this.configuration, 'types.link'));
				params.label = params.label || $this.attr('href');
			
				this.init(href, 'event', params);
				
			},
			send (path, type, params) {
				path = (typeof path === "boolean") ? this.path : path;
		
				switch (type)
		        {
					case 'timing':
					
						Page.post('/api/app/analytics', 
						{
							analytics: {
								type: type,
								category: params.category,
								action: 'load',
								value: params.value,
								label: params.label || params.analyticsLabel,
								url: path,
								page: params.page || this.page.id
							}					
						});
		
					break;
		
		            case 'event':
					
						Page.post('/api/app/analytics', 
						{
							analytics: {
								type: type,
								category: params.category || params.analyticsCategory,
								action: params.action || 'click',
								value: params.value || params.analyticsValue,
								label: params.label || params.analyticsLabel,
								url: path,
								page: params.page || this.page.id
							}						
						});
		
					break;
		
					case 'pageview':
					
						Page.post('/api/app/analytics', 
						{
							analytics: {
								type: type,
								category: params.category,
								action: params.action,
								value: params.value,
								label: params.label,
								url: path,
								page: params.page || this.page.id
							}						
						});
		
					break;
		
					case 'social':
					
						Page.post('/api/app/analytics', 
						{
							analytics: {
								type: type,
								category: params.category || params.analyticsCategory,
								action: params.action || 'click',
								value: params.value || params.analyticsValue,
								label: params.label,
								url: path,
								page: params.page || this.page.id
							}						
						});
		
					break;
		
					case 'error':
					
						Page.post('/api/app/analytics', 
						{
							analytics: {
								type: type,
								category: params.category,
								action: 'exception',
								value: params.value,
								url: path,
								page: params.page || this.page.id
							}						
						});
		
					break;
				}
			},
			timing (params) {
				params = params || {};
				params.category = params.category || "Page Loaded";
				params.label = params.label || document.title;
				
				this.init(true, 'timing', params);
			}
		},
		mounted () {
			this.loaded = this.$store.state.app.loaded;
			
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.mounted");
			
			if (this.loaded) {
				this.initTiming();
			}
			else {
				const subscription = this.$store.subscribe((mutation, state) => {
					if (mutation.type = 'app/SET' && mutation.payload.key === 'loaded') {
						this.loaded = this.$store.state.app.loaded;						
						
						if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.loaded");
						
						this.initTiming();
						
						setTimeout(subscription, 300);
					}												
				});
			}
			
			window.addEventListener("error", this.error);
			
			this.$router.beforeEach((to, from, next) => {
				this.time.outgoing = Date.now();
				
				next();
			});		
			
			this.$router.afterEach((to, from) => {
				this.time.incoming = Date.now() - this.time.outgoing;
				
				setTimeout(() => {
					this.init(this.path, "pageview");
					
					this.timing({
						category: "Page Loaded",
						value: this.time.incoming
					});
				}, 300);
			});		
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.updated");
		},
		beforeDestroy () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.beforeDestroy");
			
			window.removeEventListener("error", this.error);
		}
	}
</script>