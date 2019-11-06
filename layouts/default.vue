<template>
	<div id="wrapper" class="animated off bg-dark bg-content" v-bind:key="keys.element">
		<Analytics v-if="analytics"></Analytics>
		<Introduction v-bind:elements="elements" v-bind:delay="delay" v-if="apploaded"></Introduction>
		<LegacyBrowser v-if="applegacy"></LegacyBrowser>
		<Navigation></Navigation>
		<Disclaimer v-if="apploaded" v-show="apprendered"></Disclaimer>
		<DeviceOrientation v-if="apploaded"></DeviceOrientation>
		<Options v-show="apprendered"></Options>
		<div id="content" class="vh-100 position-relative bg-dark bg-content animated fadeIn" role="app content" v-show="apprendered">
			<nuxt />
		</div>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	import Analytics from "~/components/core/layouts/Analytics.vue";
	import DeviceOrientation from "~/components/core/layouts/DeviceOrientation.vue";
	import Disclaimer from "~/components/core/layouts/Disclaimer.vue";
	import Introduction from "~/components/core/layouts/Introduction.vue";
	import LegacyBrowser from "~/components/core/layouts/LegacyBrowser.vue";
	import Navigation from "~/components/core/layouts/Navigation.vue";
	import Options from "~/components/core/layouts/Options.vue";
	import _ from "lodash";
	
	export default {
		name: "Layout",
		components: {
			Analytics,
			DeviceOrientation,
			Disclaimer,
			Introduction,
			LegacyBrowser,
			Navigation,
			Options
		},
		data() {
			return {
				keys: {
					element: Page.utils.rand()
				},
				supported: false,
				applegacy: false,
				apploaded: false,
				apprendered: false
			};
		},
		computed: {
			analytics () {
				return process.env.APP_ANALYTICS === true;
			},
			delay () {
				return _.get(this.$store.state.api.config, 'application.introduction.delay');
			},
			elements () {
				return _.get(this.$store.state.api.config, 'application.introduction.elements');
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
			},
			mousemove (e) {
				if (document.body.getAttribute('data-device-control') !== 'touch') {
					document.body.setAttribute('data-device-control', 'mouse');
					
					this.$store.commit('app/SET', {
						key: "control",
						data: 'mouse'
					});					
				}
				
				window.removeEventListener('mousemove', this.mousemove);
			},
			render () {
				if (window.DEBUG) console.log("debug - app.layouts.default.render");
				
				this.$el.classList.remove('off');
				this.$el.classList.add('fadeIn');
				
				if (!this.supported) {
					this.applegacy = true;
				}
				else if (this.delay && this.elements) {
					setTimeout(() => {
						this.apprendered = true;
					}, this.delay);
				}
				else {
					this.apprendered = true;
				}
				
				setTimeout(() => {
					this.$store.commit('app/SET', {
						key: "rendered",
						data: Date.now()
					});
					this.$store.commit('event/SET', ['app:rendered', 'Layout']);
				}, this.delay || 10);			
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
			
			if (process.env.SERVER_ENVIRONMENT === 'development') window.DEBUG = true;
			
			if (this.touchscreen) document.body.setAttribute('data-device-control', 'touch');
			else {
				window.addEventListener('mousemove', this.mousemove);
				window.addEventListener('touchstart', this.touchstart);
			}
			
			this.supported = typeof Array.prototype.find === "function" && typeof Array.prototype.includes === "function" && typeof JSON.parse === "function" && window.localStorage;
			
			if (this.supported) {
				window.addEventListener('load', this.loaded);
				window.addEventListener("beforeunload", this.unload);
				window.addEventListener('error', this.error);
				
				this.focus();
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
				
				#legacy-browser[role="app legacy-browser"] {
					z-index: 3000;
				}
			}
		}
	}	
</style>