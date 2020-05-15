<template>
	<div></div>
</template>

<script>
	import { cloneDeep, forEach, get, trimEnd } from "lodash";
	import { stringify } from 'query-string';
	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "AnalyticsLayoutComponent",
		computed: {
			configuration () {
				return this.$store.state.api.config.analytics;
			},
			downloadtime () {
				const timing = get(window, 'performance.timing');
				
				if (!timing) return null;
								
				let loadtime = timing.responseEnd - timing.navigationStart;
				
				return loadtime;
			},
			loadtime () {
				const timing = get(window, 'performance.timing');
				
				if (!timing) return null;
								
				let loadtime = timing.loadEventEnd - timing.navigationStart;
				
				return loadtime;
			},
			page () {
				let pages = this.$store.state.api.pages;
				let page = Page.get(pages, Page.path(this.$router.path)) || {};
				
				return page;
			},
			path () {
				let pathname = this.$route.path;
				let hash = this.$route.hash;
				let query = this.$route.query;
				
				if (hash) {
					pathname = trimEnd(pathname, '/');
					
					return `${ pathname }/${ hash }`;
				}
				
				if (this.source === "pwa") {
					query = {...query, ...{
						source: "pwa"
					}};
					
					query = stringify(query);
					
					pathname = `${ pathname }?${ query }`;
				}
				
				return pathname;
			},
			rendertime () {
				const timing = get(window, 'performance.timing');
				
				if (!timing) return null;
								
				let loadtime = timing.loadEventEnd - timing.responseEnd;
				
				return loadtime;
			}
		},
		data () {
			return {
				enabled: process.env.GOOGLE_ANALYTICS === 'true',
				loaded: true,
				timingtimer: 0,
				time: {
					incoming: 0,
					outgoing: 0
				},
				source: null
			};
		},
		methods: {
			async error (e) {				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.error");
				
				let data = {
					message: e.message,
					filename: e.filename,
					url: window.location.href,
					line_number: e.lineno,
					column_number: e.colno,
					error: get(e.error, 'stack'),
					user_agent: navigator.appVersion
				};
				
				let response = await Page.post('/api/app/error', { form: data });
				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.error.response");
				
				if (this.enabled) {
					this.init(this.path, 'error', {
						message: `${ data.message } @ Line: ${ data.linenumber } on ${ data.url }`,
						params: {
							category: 'Application Error',
							label: this.page.name,
							value: get(response, 'data.id')
						}
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
			google (path, type, params = {}) {			
				const initialize = () => {
					let UUID = get(this.configuration, 'google.id');
					let debug = get(this.configuration, 'google.debug');
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
		
					params = params || get(this.configuration, `types.${ type }`) || {};
		
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
			init (path, type, params = {}) {
			    if (window.DEBUG) console.log(`debug - app.components.core.layouts.Analytics.init - Path: ${ path }, Type: ${ type }, Referrer: ${ params.referrer }`);
			    
			    let apis = get(this.configuration, 'apis');	 
			    var options = get(this.configuration, 'options');
			    			    
			    if (options && get(options, type)) {
				    this.send(path, type, params);	
			    }   
				
				if (apis) {
					forEach(apis, (value, api) => {
						if (typeof this[api] === 'function' && typeof api === "string") this[api](path, type, params);
					});
				}
				
			},
			initTiming () {
				clearTimeout(this.timingtimer);
				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.initTiming");
				
				this.timingtimer = setTimeout(() => {
					this.timing({
						category: "Application Loaded",
						value: this.loadtime,
						referrer: this.referrer
					});
					
					this.timing({
						category: "Application Rendered",
						value: this.rendertime,
						referrer: this.referrer
					});
					
					this.timing({
						category: "Application Downloaded",
						value: this.downloadtime,
						referrer: this.referrer
					});					
				}, 1000);
			},
			outbound (element, params = {}) {
			    let href = e.currentTarget.href;
			    
			    params = params || {};
				params = cloneDeep(params, get(this.configuration, 'types.link'));
				params.label = params.label || $this.attr('href');
			
				this.init(href, 'event', params);
				
			},
			send (path, type, params = {}) {
				path = (typeof path === "boolean") ? this.path : path;
				
				let $params = get(this.page, `analytics.${ type }.page`); 
				
				if ($params) params = {...$params, ...params};
				
				params.label = params.label || this.page.name;
				
				if (window.DEBUG) console.log(`debug - app.components.core.layouts.Analytics.send - Path: ${ path }, Type: ${ type }, Category: ${ params.category }`);
										
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
								page: params.page || this.page.id,
								referrer: params.referrer
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
								page: params.page || this.page.id,
								referrer: params.referrer
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
								page: params.page || this.page.id,
								referrer: params.referrer
							}						
						});
		
					break;
		
					case 'pageload':
					
						Page.post('/api/app/analytics', 
						{
							analytics: {
								type: type,
								category: params.category,
								action: params.action,
								value: params.value,
								label: params.label,
								url: path,
								page: params.page || this.page.id,
								referrer: params.referrer
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
								page: params.page || this.page.id,
								referrer: params.referrer
							}						
						});
		
					break;
		
					case 'error':
					
						Page.post('/api/app/analytics', 
						{
							analytics: {
								type: type,
								category: params.category || 'Application Error',
								action: 'exception',
								value: params.value,
								label: params.label,
								url: path,
								page: params.page || this.page.id,
								referrer: params.referrer
							}						
						});
		
					break;
				}
			},
			timing (params = {}) {
				params.category = params.category || "Page Loaded";
				params.label = params.label || this.page.name || document.title;
				
				this.init(this.path, 'timing', params);
			}
		},
		mounted () {
			this.loaded = this.$store.state.app.loaded;
			
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.mounted");
			
			this.source = this.$store.state.app.source;
			this.referrer = window.document.referrer;
			
			if (this.referrer.indexOf(window.location.origin) === 0) this.referrer = this.referrer.replace(window.location.origin, '');
			
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
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.mounted.afterEach", this.referrer);
				
				this.time.incoming = Date.now() - this.time.outgoing;
				
				setTimeout(() => {
					this.init(this.path, "pageview", { referrer: from.path });
					
					this.timing({
						category: "Page Loaded",
						value: this.time.incoming,
						referrer: from.path
					});
				}, 300);
			});		
		},
		beforeDestroy () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Analytics.beforeDestroy");
			
			window.removeEventListener("error", this.error);
		}
	}
</script>