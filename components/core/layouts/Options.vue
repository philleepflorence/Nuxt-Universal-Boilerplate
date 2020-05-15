<template>
	<div id="options" class="position-relative" role="app options" v-bind:key="keys.element" data-open="false" data-overlay="false">
		
		<aside class="options-overlays position-static" v-if="buttons">
		
			<component v-bind:if="display('OPTIONS_CONTACT', 'contact')" v-bind:is="componentContact" v-on:close="onClickClose"></component>
			<component v-bind:if="display('OPTIONS_FILTER', 'filter')" v-bind:is="componentFilter" v-on:close="onClickClose"></component>
			<component v-bind:if="display('OPTIONS_SEARCH', 'search')" v-bind:is="componentSearch" v-on:close="onClickClose"></component>
			<component v-bind:if="display('OPTIONS_SHARE', 'share')" v-bind:is="componentShare" v-on:close="onClickClose"></component>
			<component v-bind:if="display('OPTIONS_SUBSCRIBE', 'subscribe')" v-bind:is="componentSubscribe" v-on:close="onClickClose"></component>
			
		</aside>
		
		<nav class="options-overlay-menu position-fixed position-bottom position-right w-50px mr-3 mb-3 transform" v-if="buttons">
			<button 
				id="options-close-button" 
				class="pointer-events-auto shadow-sm plain h-50px w-50px rounded-circle bg-primary transition animated zoomIn position-relative options-toggle-button a-delay"
				v-if="curroverlay"
				v-on:click="onClickClose">
				<span 
					class="overlay-close-button position-absolute position-center text-white animated fadeIn" 
					v-html="icons.toggle.options.close.icon.icon">
				</span>
			</button>			
		</nav>
		
		<nav id="options-navigation" class="position-fixed position-bottom w-100 transform">
			<div class="options-navigation h-50px bg-primary m-3 d-flex flex-row rounded shadow-sm">
				<button 
					class="options-navigation-button flex-fill plain h-100 transition position-relative border-left text-white"
					v-for="(button, key, index) in buttons"
					v-on:click="onClickOverlay"
					v-bind:key="button.slug"
					v-bind:refs="`button-${ button.slug }`"
					v-bind:data-overlay="button.url">
					<span v-html="button.icon.icon"></span>
					<span class="options-navigation-text fs-12px text-lowercase d-none d-md-block">{{ button.value }}</span>
				</button>
				<button 
					class="options-navigation-button flex-fill plain h-100 transition position-relative border-left text-white"
					v-on:click="onClickFullscreen" 
					refs="button-fullscreen"
					v-if="fullscreen">
					<span v-html="icons.toggle.fullscreen.icon.icon"></span>
					<span class="options-navigation-text fs-12px text-lowercase d-none d-md-block">{{ icons.toggle.fullscreen.name }}</span>
				</button>
			</div>
		</nav>
		
	</div>
</template>

<script>
	import { forEach, get } from "lodash";
	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "OptionsLayoutComponent",
		data () {
			return {
				loaded: false,
				fullscreen: true,
				keys: {
					element: Page.utils.rand()
				},
				rendered: false,
				options: {
					open: false
				},
				curroverlay: null
			};
		},
		computed: {
			buttons () {
				return this.$store.state.api.labels.button.options;
			},
			componentContact () {
				if (process.env.OPTIONS_CONTACT && this.buttons.contact) return () => import(process.env.OPTIONS_CONTACT);
				else return null;
			},
			componentFilter () {
				if (process.env.OPTIONS_FILTER && this.buttons.filter) return () => import(process.env.OPTIONS_FILTER);
				else return null;
			},
			componentSearch () {
				if (process.env.OPTIONS_SEARCH && this.buttons.search) return () => import(process.env.OPTIONS_SEARCH);
				else return null;
			},
			componentShare () {
				if (process.env.OPTIONS_SHARE && this.buttons.share) return () => import(process.env.OPTIONS_SHARE);
				else return null;
			},
			componentSubscribe () {
				if (process.env.OPTIONS_SUBSCRIBE && this.buttons.subscribe) return () => import(process.env.OPTIONS_SUBSCRIBE);
				else return null;
			},
			configuration () {
				return this.$store.state.api.config.application.options;
			},
			dirname () {
				return (process.env.INIT_CWD || process.env.PWD);
			},
			icons () {
				return this.$store.state.api.icons;
			},
			labels () {
				return this.$store.state.api.labels;
			},
			page () {
				return Page.get(this.pages, this.path);
			},
			pages () {
				return this.$store.state.pages;
			},
			path () {
				return this.$route.path;
			}
		},
		methods: {
			/*
				Close the overlay and reset all the buttons
			*/
			onClickClose (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.onClickClose");
				
				let $overlays = this.$el.querySelectorAll('.options-overlay');
				let $buttons = this.$el.querySelectorAll('.options-navigation-button');
				
				forEach($overlays, (element) => {
					element.classList.add('off');
				});
				forEach($buttons, (element) => {
					element.classList.remove('active');
				});
				
				if (e !== true) {
					this.options.open = false;
						
					this.$el.setAttribute('data-open', 'false');
					this.$el.setAttribute('data-overlay', 'false');
				}
				
				this.$store.commit("app/SET", {
					key: "app:closed:overlay",
					data: this.curroverlay
				});	
				
				this.curroverlay = null;
			},
			/*
				Check if the path of the component file is defined
			*/
			display (component, overlay) {
				if (typeof process.env[component] === 'string') return true;
				
				return false;
			},
			/*
				Initialize Fullscreen Control
			*/
			initFullscreen () {
				if (this.$route.query.source === 'pwa') return false;
				
				var element = document.documentElement;
				
				element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
				
				this.fullscreen = (typeof element.requestFullScreen === 'function');
			},
			/*
				Launch the Fullscreen
			*/
			onClickFullscreen () {
				this.$store.commit('event/SET', ['app:toggle:fullscreen']);
			},
			/*
				Launch an overlay related to the button clicked
			*/
			onClickOverlay (e, curroverlay) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.onClickOverlay");
				
				this.onClickClose(true);
				
				this.curroverlay = curroverlay || e.currentTarget.getAttribute('data-overlay');

				this.overlay();				
			},
			/*
				Overlay Control - Opens an overlay that matches the button clicked or triggered
			*/
			overlay () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.overlay");
				
				if (this.curroverlay) {
					let $button = this.$el.querySelector(`[data-overlay="${ this.curroverlay }"]`);
					let $buttons = this.$el.querySelectorAll('.options-navigation-button');
					let $overlay = this.$el.querySelector(`[role="app ${ this.curroverlay }"]`);
					
					forEach($buttons, (button) => {
						button.classList.remove('active');
					});
					
					if ($overlay) {					
						this.options.open = true;
						this.$el.setAttribute('data-overlay', this.curroverlay);
						this.$el.classList.add('active');
						
						setTimeout(() => {
							$overlay.classList.remove('off');
							
							if ($button) {
								$button.classList.add('active');
							}							
						}, 300);
				
						this.$store.commit("app/SET", {
							key: "app:opened:overlay",
							data: this.curroverlay
						});							
					}
				}
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.render");
				
				let delay = this.configuration.delay;
				let index = 0;
				let transform = 74;
				let tdelay = 150;
				
				let $buttons = this.$el.querySelectorAll('.options-overlay-button');
				let $icons = this.$el.querySelectorAll('span.options-button-open');
								
				if ($icons.length && delay) {
					$icons[index].classList.add('active');
					
					setInterval(() => {
						$icons[index].classList.remove('active');
						
						if (index < $icons.length - 1) index++;
						else index = 0;	
						
						$icons[index].classList.add('active');
					}, delay);				
				}
				
				if ($buttons.length && $icons.length && delay) {
					this.rendered = true;
				}
				
				this.overlay();							
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.mounted");
			
			this.initFullscreen();
						
			this.loaded = this.$store.state.app.loaded;
						
			this.$router.beforeEach((to, from, next) => {		
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.beforeEach");
						
				if (this.options.open) this.onClickClose();
				
				next();
			});	
			
			if (this.loaded && this.configuration.overlay && !this.rendered) {
				this.render();
			}	
			else if (this.configuration.overlay) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.subscription");
				
				const subscription = this.$store.subscribe((mutation) => {
					if (mutation.type === "app/SET" && mutation.payload.key === "loaded") {					
						if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.loaded");
						
						this.loaded = true;	
						
						setTimeout(() => {
							if (!this.rendered) this.render();
							
							subscription();
						}, 300);
					}												
				});
			}
			
			this.$store.subscribe((mutation, state) => {
				if (mutation.type === 'app/SET' && mutation.payload.key === "app:options:overlay") {
					if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.subscribe - app:options:overlay");
					
					this.onClickOverlay(null, mutation.payload.data);						
				}												
			});
			
			this.$store.subscribe((mutation, state) => {
				if (mutation.type === 'app/SET' && mutation.payload.key === "app:close:overlay") {
					if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.subscribe - app:close:overlay");
					
					this.onClickClose(false);						
				}												
			});
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	body {
		&[data-page-mode="app"] {
			@media (min-width: @breakpoint-lg) {
				#options-navigation {
					width: 58.33333% !important;
					right: 0 !important;
				}
			}
			
			@media (min-width: @breakpoint-xl) {
				#options-navigation {
					width: 50% !important;
					right: 0 !important;
				}
			}
		}
	
		#options[role="app options"] {
			#options-navigation {
				.options-navigation {
					border-radius: 25px !important;
					
					.options-navigation-button {
						border-color: fade(white, 30) !important;
						
						&:first-child {
							border: none !important;
						}
					}
				}
			}
			
			.options-overlay {
				backdrop-filter: blur(10px);
				transition-duration: 800ms;
			}
			
			&:not([data-overlay="false"]) {
				#options-navigation {
					transform: translateY(100%) !important;
					opacity: 0;
				}
			}
		}
		
		&[data-scroll-direction="down"] {
			#options-navigation {
				transform: translateY(100%) !important;
				opacity: 0;
			}
		}
	}
</style>