<template>
	<div id="options" class="position-relative" role="app options" v-bind:key="keys.element" data-open="false" data-overlay="false">
		
		<component v-bind:if="display('OPTIONS_CONTACT')" v-bind:is="contact" v-on:close="close"></component>
		<component v-bind:if="display('OPTIONS_FILTER')" v-bind:is="filter" v-on:close="close"></component>
		<component v-bind:if="display('OPTIONS_SEARCH')" v-bind:is="search" v-on:close="close"></component>
		<component v-bind:if="display('OPTIONS_SHARE')" v-bind:is="share" v-on:close="close"></component>
		<component v-bind:if="display('OPTIONS_SUBSCRIBE')" v-bind:is="subscribe" v-on:close="close"></component>
		
		<nav class="options-menu position-fixed position-bottom position-right w-50px m-4 transform" v-if="buttons">
			<div class="options-overlay-buttons">
				<button 
					class="shadow-sm plain h-50px w-50px bg-primary transition position-relative options-overlay-button mb-4"
					v-for="(button, key, index) in buttons"
					v-on:click="onOverlay"
					v-bind:key="button.slug"
					v-bind:data-overlay="button.url">
					<span 
						class="text-white"
						v-html="button.icon.icon">
					</span>
				</button>
			</div>
			<button 
				id="options-button" 
				class="shadow-sm plain h-50px w-50px bg-primary transition animated zoomIn position-relative options-toggle-button"
				v-if="loaded"
				v-on:click="onToggle">
				<span 
					class="options-button options-button-close position-absolute position-center text-white animated fadeIn" 
					v-html="icons.toggle.options.close.icon.icon">
				</span>
				<span 
					v-for="(button, key, index) in buttons" 
					v-bind:key="button.slug"
					class="options-button options-button-open position-absolute position-center text-white"
					v-html="button.icon.icon">
				</span>
			</button>			
		</nav>
		
		<nav class="options-overlay-menu position-fixed position-bottom position-right w-50px m-4 transform" v-if="buttons">
			<button 
				id="options-close-button" 
				class="shadow-sm plain h-50px w-50px bg-primary transition animated zoomIn position-relative options-toggle-button a-delay"
				v-if="curroverlay"
				v-on:click="close">
				<span 
					class="overlay-close-button position-absolute position-center text-white animated fadeIn" 
					v-html="icons.toggle.options.close.icon.icon">
				</span>
			</button>			
		</nav>
		
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import { forEach as __forEach, get as __Get } from "lodash";
	
	export default {
		name: "Options",
		data () {
			return {
				loaded: false,
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
				return this.$store.state.api.labels.app.button.options;
			},
			configuration () {
				return this.$store.state.api.config.application.options;
			},
			contact () {
				if (process.env.OPTIONS_CONTACT) return () => import(process.env.OPTIONS_CONTACT);
				else return null;
			},
			dirname () {
				return (process.env.INIT_CWD || process.env.PWD);
			},
			filter () {
				if (process.env.OPTIONS_FILTER) return () => import(process.env.OPTIONS_FILTER);
				else return null;
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
			},
			search () {
				if (process.env.OPTIONS_SEARCH) return () => import(process.env.OPTIONS_SEARCH);
				else return null;
			},
			share () {
				if (process.env.OPTIONS_SHARE) return () => import(process.env.OPTIONS_SHARE);
				else return null;
			},
			subscribe () {
				if (process.env.OPTIONS_SUBSCRIBE) return () => import(process.env.OPTIONS_SUBSCRIBE);
				else return null;
			}
		},
		methods: {
			close (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.close");
				
				let $overlays = this.$el.querySelectorAll('.options-overlay');
				let $buttons = this.$el.querySelectorAll('.options-overlay-button');
				
				__forEach($overlays, (element) => {
					element.classList.add('off');
				});
				__forEach($buttons, (element) => {
					element.classList.remove('active');
				});
				
				this.curroverlay = null;
				
				if (e !== true) {
					this.options.open = false;
						
					this.$el.setAttribute('data-open', 'false');
					this.$el.setAttribute('data-overlay', 'false');
				}
			},
			display (component) {
				if (process.env[component]) return true;
				
				return false;
			},
			onOverlay (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.onOverlay");
				
				this.close(true);
				
				this.curroverlay = e.currentTarget.getAttribute('data-overlay');
											
				this.overlay();				
			},
			overlay () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.overlay");
				
				if (this.curroverlay) {
					let $overlay = this.$el.querySelector(`[role="app ${ this.curroverlay }"]`);
					let $buttons = this.$el.querySelectorAll('.options-overlay-button');
					let $button = this.$el.querySelector(`[data-overlay="${ this.curroverlay }"]`);
					
					__forEach($buttons, (button) => {
						button.classList.remove('active');
					});
					
					if ($overlay) {					
						this.options.open = true;
						this.$el.setAttribute('data-overlay', this.curroverlay);
						
						setTimeout(() => {
							$overlay.classList.remove('off');
							
							if ($button) {
								$button.classList.add('active');
							}							
						}, 300);						
					}
				}
			},
			onToggle () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.onToggle");
								
				if (this.options.open) {
					this.options.open = false;
					
					this.$el.setAttribute('data-open', 'false');
					this.$el.setAttribute('data-overlay', 'false');
				}
				else {
					this.options.open = true;
					
					this.$el.setAttribute('data-open', 'true');
					this.$el.setAttribute('data-overlay', 'false');
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
				
				if ($buttons.length) {
					__forEach($buttons, (button, index) => {
						let currindex = $buttons.length - (index);
						
						button.style.transform = `translateY(${ transform * currindex }px)`;
						button.style.transitionDelay = `${ tdelay * currindex }ms`;
					});
				}
				
				if ($buttons.length && $icons.length && delay) {
					this.rendered = true;
				}
				
				this.overlay();				
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.mounted");
						
			this.loaded = this.$store.state.app.loaded;
						
			this.$router.afterEach((to, from) => {				
				this.close();
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
					this.curroverlay = mutation.payload.data;

					this.overlay();						
				}												
			});
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#options[role="app options"] {
		button {
			&.options-overlay-button,
			&.options-toggle-button {
				border-radius: 50% !important;
			}
			
			&.options-toggle-button {			
				.options-button-open {
					opacity: 0 !important;
					transition-duration: 2s;
					
					&.active {
						opacity: 1 !important;
					}
				}				
			}
			
			&.options-overlay-button {
				transition-duration: 800ms;
			}
		}
		
		.options-overlay {
			transition-duration: 800ms;
		}
		
		@transform: 74px;
		
		&:not([data-overlay="false"]) {
			.options-menu {
				transform: translateY(50%);
				transition-delay: 50ms;
				transition-duration: 600ms;
				opacity: 0;
			}
		}
		
		&[data-open="true"] {
			.options-overlay-button {
				transform: translateY(0) !important;
				opacity: 1;
			}
			.options-button-open {
				display: none;
			}
			.options-button-close {
				display: inline;
			}
		}
		
		&[data-open="false"] {
			.options-overlay-button {
				opacity: 0;
			}
			.options-button-open {
				display: inline;
			}
			.options-button-close {
				display: none;
			}
		}
	}
</style>