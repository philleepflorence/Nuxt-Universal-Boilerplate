<template>
	<div id="wrapper" class="animated off bg-content" v-bind:key="keys.element">
		
		<app-component-layout-analytics v-if="analytics"></app-component-layout-analytics>
		
		<app-component-layout-introduction v-bind:elements="introduction" v-bind:delay="delay" v-if="apploaded"></app-component-layout-introduction>
		
		<app-component-layout-legacy-browser v-if="applegacy"></app-component-layout-legacy-browser>
		
		<app-component-layout-navigation></app-component-layout-navigation>
		
		<app-component-layout-disclaimer v-if="apploaded" v-show="apprendered"></app-component-layout-disclaimer>
		
		<app-component-layout-device-orientation v-if="apploaded"></app-component-layout-device-orientation>
		
		<app-component-layout-options v-show="apprendered"></app-component-layout-options>
		
		<app-component-layout-notifications v-show="apprendered"></app-component-layout-notifications>
		
		<div id="content" class="vh-100 position-relative bg-content transition animated fadeIn" role="app content" v-show="apprendered">
			<nuxt />
		</div>
		
	</div>
</template>

<script>
	import { get } from "lodash";
	
	import ComponentLayoutAnalytics from "~/components/core/layouts/Analytics.vue";
	import ComponentLayoutDeviceOrientation from "~/components/core/layouts/DeviceOrientation.vue";
	import ComponentLayoutDisclaimer from "~/components/core/layouts/Disclaimer.vue";
	import ComponentLayoutIntroduction from "~/components/core/layouts/Introduction.vue";
	import ComponentLayoutLegacyBrowser from "~/components/core/layouts/LegacyBrowser.vue";
	import ComponentLayoutNavigation from "~/components/core/layouts/Navigation.vue";
	import ComponentLayoutNotifications from "~/components/core/layouts/Notifications.vue";
	import ComponentLayoutOptions from "~/components/core/layouts/Options.vue";
	
	import Alert from "~/helpers/core/alert.js";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "LayoutDefault",
		components: {
			'app-component-layout-analytics': ComponentLayoutAnalytics,
			'app-component-layout-device-orientation': ComponentLayoutDeviceOrientation,
			'app-component-layout-disclaimer': ComponentLayoutDisclaimer,
			'app-component-layout-introduction': ComponentLayoutIntroduction,
			'app-component-layout-legacy-browser': ComponentLayoutLegacyBrowser,
			'app-component-layout-navigation': ComponentLayoutNavigation,
			'app-component-layout-notifications': ComponentLayoutNotifications,
			'app-component-layout-options': ComponentLayoutOptions
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				supported: false,
				applegacy: false,
				apploaded: false,
				apprendered: false,
				scroll: {
					direction: null,
					top: 0
				},
				timers: {
					loaded: 0,
					scroll: 0
				}
			};
		},
		computed: {
			analytics () {
				return process.env.APP_ANALYTICS === 'true';
			},
			delay () {
				return get(this.$store.state.api.config, 'application.introduction.delay');
			},
			introduction () {
				return get(this.$store.state.api.labels, 'content.introduction');
			},
			touchscreen () {
				return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
			}
		},
		methods: {
			onfocus (evt) {
				var v = "active",
					h = "inactive",
					hidden = document["hidden"],
					evtMap = {
						focus: v,
						focusin: v,
						pageshow: v,
						blur: h,
						focusout: h,
						pagehide: h
					};

				evt = evt || window.event;
				
				if (window.DEBUG) console.log(`debug - app.layouts.default.onfocus - EVENT: ${ evt.type } - HIDDEN: ${ hidden }`);
				
				this.$el.classList.remove('active');
				this.$el.classList.remove('inactive');
				
				if (evt.type in evtMap) {
					this.$el.classList.add(evtMap[evt.type]);
				}
				else if (hidden === true) {
					this.$el.classList.add('inactive');
				}
				else if (hidden === false) {
					this.$el.classList.add('active');
				}
				
				if (this.$el.classList.contains('active') && this.apprendered) {
					this.$el.classList.remove('off');
				}
			},
			focus () {
				let hidden = "hidden";
	
				if (hidden in document) {
					document.addEventListener("visibilitychange", this.onfocus);
				}
				else if ((hidden = "mozHidden") in document) {
					document.addEventListener("mozvisibilitychange", this.onfocus);
				}
				else if ((hidden = "webkitHidden") in document) {
					document.addEventListener("webkitvisibilitychange", this.onfocus);
				}
				else if ((hidden = "msHidden") in document) {
					document.addEventListener("msvisibilitychange", this.onfocus);
				}
				else if ("onfocusin" in document) {
					document.onfocusin = document.onfocusout = this.onfocus;
				}
				else {
					window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this.onfocus;
				}
	
				if (document[hidden] !== undefined) {
					this.onfocus({
						type: document[hidden] ? "blur" : "focus"
					});
				}				
			},
			error (e) {
				if (window.DEBUG) console.log("debug - app.layouts.default.loaded", {
					message: e.message,
					filename: e.filename,
					url: window.location.href,
					line_number: e.lineno,
					column_number: e.colno,
					error: e.error,
					user_agent: navigator.appVersion
				});
			},
			loaded () {
				if (window.DEBUG) console.log("debug - app.layouts.default.loaded");
				
				this.apploaded = true;
				
				this.render();
				
				setTimeout(() => {
					this.$store.commit('app/SET', {
						key: "loaded",
						data: Date.now()
					});
					this.$store.commit('event/SET', ['app:loaded', 'Layout']);
				}, 500);
			
				this.$router.afterEach((to, from) => {
					window.document.body.setAttribute('data-scroll-direction', 'down');
				});
			},
			mousemove (e) {
				if (document.body.getAttribute('data-device-control') !== 'touch') {
					document.body.setAttribute('data-device-control', 'mouse');
					
					this.$store.commit('app/SET', {
						key: "control",
						data: 'mouse'
					});	
					
					this.focus();				
				}
				
				window.removeEventListener('mousemove', this.mousemove);
			},
			onScroll (e) {
				clearTimeout(this.timers.scroll);
				
				this.timers.scroll = setTimeout(() => {
					if (typeof window.pageYOffset !== "number") return false;
					
					if (!window.pageYOffset || window.pageYOffset > this.scroll.top) this.scroll.direction = 'down';
					else this.scroll.direction = 'up';
					
					this.scroll.top = window.pageYOffset;
					
					window.document.body.setAttribute('data-scroll-direction', this.scroll.direction);
				}, 
				100);
			},
			render () {
				if (window.DEBUG) console.log("debug - app.layouts.default.render");
				
				this.$el.classList.remove('off');
				this.$el.classList.add('fadeIn', 'on');
				
				if (!this.supported) {
					this.applegacy = true;
				}
				else if (this.delay && this.introduction) {
					setTimeout(() => {
						this.apprendered = true;
					}, this.delay);
				}
				else {
					this.apprendered = true;
				}
				
				setTimeout(this.rendered, this.delay || 10);			
			},
			rendered () {
				if (window.DEBUG) console.log("debug - app.layouts.default.rendered");
				
				if (process.env.LOADED_MESSAGE) {
					clearTimeout(this.timers.loaded);
					
					this.timers.loaded = setTimeout(() => {
						Alert.show(process.env.LOADED_MESSAGE, false, 5000);
					}, 
					100);
				}
				
				this.$store.commit('app/SET', {
					key: "rendered",
					data: Date.now()
				});
				
				this.$store.commit('event/SET', ['app:rendered', 'Layout']);
			},
			touchstart (e) {
				document.body.setAttribute('data-device-control', 'touch');
				
				this.$store.commit('app/SET', {
					key: "control",
					data: 'touch'
				});
				
				window.removeEventListener('touchstart', this.touchstart);
			},
			unload () {
				this.$el.classList.add('fadeOut');
				this.$el.classList.remove('fadeIn');
			}
		},
		beforeMount () {
			if (window.DEBUG) console.log("debug - app.layouts.default.beforeMount - ENVIRONMENT", process.env.SERVER_ENVIRONMENT);
			
			if (['development', 'staging', 'qa'].includes(process.env.SERVER_ENVIRONMENT)) window.DEBUG = true;
			
			const urlParams = new URLSearchParams(window.location.search);
			const source = urlParams.get('source') === "pwa" ? "pwa" : "browser";
				
			this.$store.commit('app/SET', {
				key: "source",
				data: source
			});
			
			if (this.touchscreen) document.body.setAttribute('data-device-control', 'touch');
			else {
				window.addEventListener('mousemove', this.mousemove);
				window.addEventListener('touchstart', this.touchstart);
			}
			
			this.supported = typeof Array.prototype.find === "function" && typeof Array.prototype.includes === "function" && typeof JSON.parse === "function" && window.localStorage && "Notification" in window && window.navigator.geolocation; 
			
			if (this.supported) {
				window.addEventListener('load', this.loaded);
				window.addEventListener("beforeunload", this.unload);
				window.addEventListener('error', this.error);
				window.addEventListener('scroll', this.onScroll);
				
				window.document.body.setAttribute('data-scroll-direction', 'down');
			}
		},
		mounted () {			
			if (window.DEBUG) console.log("debug - app.layouts.default.mounted");
			
			if (!this.supported) this.render();	
			else if (document.readyState === "complete") this.render();		
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.layouts.default.updated");
			
			if (this.apploaded && !this.apprendered) this.render();
		}
	}	
</script>

<style lang="less">
	html {
		body {			
			#wrapper {
				&.off {
					opacity: 0;
					pointer-events: none;
				}
				
				&.inactive {
					visibility: hidden !important;
				}
				
				&.active {
					visibility: visible !important;
				}
				
				.spinner-grow {
					border-radius: 50% !important;
				}
				
				#content[role="app content"] {
					z-index: 2;
				}
				
				#options[role="app options"] {
					z-index: 10;
				}
				
				#disclaimer[role="app disclaimer"] {
					z-index: 50;
				}
				
				#navigation[role="app navigation"] {
					z-index: 100;
				}
				
				#introduction[role="app introduction"] {
					z-index: 1000;
				}
				
				#device-orientation[role="app device-orientation"] {
					z-index: 2000;
				}
				
				#notifications[role="app notifications"] {
					z-index: 3000;
				}
				
				#legacy-browser[role="app legacy-browser"] {
					z-index: 4000;
				}
				
				.page-enter-active,
				.page-leave-active, 
				.page-enter,
				.page-leave-to {
					animation: none;
					transition: none;
				}
			}
		}
	}	
</style>