<template>
	<div id="options" class="position-relative" role="app options" v-bind:key="keys.element" data-open="false">
		
		<component v-bind:is="contact"></component>
		<component v-bind:is="share"></component>
		
		<nav class="position-fixed position-bottom position-right w-50px m-4" v-if="buttons">
			
			<div class="options-overlay-buttons">
				<button 
					class="shadow-sm plain h-50px w-50px bg-primary bg-secondary-hover bg-secondary-active transition position-relative options-overlay-button mb-4"
					v-for="(button, key, index) in buttons"
					v-on:click="onOverlay"
					v-bind:key="button.slug"
					v-bind:data-overlay="button.slug">
					<span 
						class="text-white"
						v-html="button.icon.icon">
					</span>
				</button>
			</div>
			
			<button 
				id="options-button" 
				class="shadow-sm plain h-50px w-50px bg-primary bg-secondary-hover bg-primary-active transition animated zoomIn position-relative options-toggle-button"
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
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import { forEach as __forEach, get as __Get } from "lodash";
	
	export default {
		name: "Options",
		components: {
			
		},
		data () {
			return {
				components: {
					hash: '/#!/:overlay'
				},
				loaded: false,
				keys: {
					element: Page.utils.rand()
				},
				rendered: false,
				options: {
					open: false
				}
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
				return () => import(process.env.OPTIONS_CONTACT);
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
				return Page.get(this.pages, this.$route.path);
			},
			pages () {
				return this.$store.state.pages;
			},
			path () {
				return this.$route.path;
			},
			share () {
				return () => import(process.env.OPTIONS_SHARE);
			}
		},
		methods: {
			close (mode = "overlays") {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.close", mode);
				
				let $overlays = this.$el.querySelectorAll('.options-overlay');
				
				if (mode === "overlays") {
					__forEach($overlays, (element) => {
						element.classList.add('off');
					});
				}
			},
			onOverlay (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.onOverlay");
				
				this.close();
				
				let overlay = e.currentTarget.getAttribute('data-overlay');
				let path = this.components.hash.replace(':overlay', overlay);
				
				this.$router.push({
					path: path
				});				
			},
			overlay (location) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.overlay");
				
				location = location || window.location;
				
				if (location.hash) {
					let overlay = location.hash.replace('#!/', '');
					
					overlay = overlay.split('/').shift();
					
					let $overlay = this.$el.querySelector(`[role="app ${ overlay }"]`);
					let $buttons = this.$el.querySelectorAll('.options-overlay-button');
					let $button = this.$el.querySelector(`[data-overlay="${ overlay }"]`);
					
					__forEach($buttons, (button) => {
						button.classList.remove('active');
					});
					
					if ($overlay) {					
						this.options.open = true;
						
						setTimeout(() => {
							$overlay.classList.remove('off');
							$button.classList.add('active');							
						}, 300);						
					}
				}
				else {
					this.options.open = false;
					
					this.$el.setAttribute('data-open', 'false');
					
					this.close();
				}
			},
			onToggle () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.onToggle");
								
				if (this.options.open) {
					this.$router.push({
						path: window.location.pathname
					});
				}
				else {
					this.options.open = true;
					
					this.$el.setAttribute('data-open', 'true');
				}
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.render");
				
				let delay = this.configuration.delay;
				let index = 0;
				let transform = 74;
				let tdelay = 150;
				
				let $buttons = this.$el.querySelectorAll('.options-overlay-button');
				let $icons = this.$el.querySelectorAll('.options-button-open');
								
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
			this.loaded = this.$store.state.app.loaded;
			
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.mounted");
						
			this.$router.afterEach((to, from) => {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.afterEach");
				
				this.close();				
				this.overlay(to);
			});	
			
			if (this.loaded && this.configuration.overlay && !this.rendered) {
				this.render();
			}	
			else if (this.configuration.overlay) {
				const subscription = this.$store.subscribe((mutation) => {
					if (mutation.type = 'app/SET' && mutation.payload.key === 'loaded') {
						this.loaded = true;						
						
						if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.loaded");
												
						if (!this.rendered) this.render();
						
						setTimeout(subscription, 300);
					}												
				});
			}
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Options.updated");
			
			if (!this.rendered) this.render();
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