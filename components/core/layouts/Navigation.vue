<template>
	<div id="navigation" role="app navigation" class="position-relative off">
		<nav class="navigation-controls transition position-fixed mt-2 h-50px w-100 pointer-events-none d-flex">
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-secondary-active text-white navigation-controls-open" 
				v-html="icons.menu.open.icon.icon" 
				v-on:click="controls('open')">
			</button>
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-secondary-active text-white navigation-controls-close position-absolute position-top position-left" 
				v-html="icons.menu.close.icon.icon" 
				v-on:click="controls('close')">
			</button>
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-secondary-active text-white animated fadeIn"
				v-show="options.logo">
				<span class="filter-white"><img v-bind:src="configuration.application.favicon" class="icon-logo"></span>
				<a class="position-absolute position-full" href="/"></a>
			</button>
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-secondary-active text-white navigation-controls-back animated fadeIn animated fadeInRight delay-1s faster" 
				v-html="icons.history.back.icon.icon" 
				v-on:click="navigate(-1)" 
				v-show="goback">
			</button>
		</nav>
		<nav class="navigation-controls secondary transition position-fixed position-right mt-2 h-50px w-100 pointer-events-none navigation-controls-fullscreen d-flex justify-content-end">
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-secondary-active text-white animated fadeInRight" 
				v-html="icons.toggle.fullscreen.icon.icon" 
				v-on:click="fullscreen()">
			</button>
		</nav>
		<nav id="navigation-container" class="navigation-container position-fixed position-full bg-white transform">
			<CustomScroll name="navigation">
				<div class="row no-gutters vh-100 navigation-row">
					<div class="col-lg-4 col-md-4 vh-100 navigation-column">
						<div class="d-flex flex-column align-items-center vh-100 pt-10">
							<section v-for="(section, index) in navigation" v-bind:key="index" class="text-secondary navigation-section spacer w-100">
								<h4 class="navigation-header fancy fancy-left fancy-sm fs-1rem font-weight-book text-primary">
									<span class="text-primary">{{ index }}</span>
								</h4>
								<nav class="navigation-group">
									<nuxt-link 
										v-for="(nav, key) in section" 
										v-bind:to="nav.path" 
										v-bind:key="nav.slug" 
										v-bind:data-index="`${index}.${key}`"
										v-bind="attributes(nav)" 
										class="navigation-item d-flex align-items-center mb-2 position-relative text-primary-hover text-primary-active">
										<span 
											class="navigation-text lead font-weight-book" 
											v-on:mouseover.stop="onMouseover" 
											v-on:mouseleave.stop="onMouseleave"
											v-bind:data-index="`${index}.${key}`">{{ nav.title }}</span>
									</nuxt-link>
								</nav>
							</section>
						</div>
					</div>
					<div class="col-lg-5 col-md-5 vh-100 border-md-left navigation-column">
						<div class="d-flex align-items-center vh-100">
							<div class="lead navigation-message text-center w-100 animated fadeIn" v-show="options.nav.id">
								<span 
									class="navigation-icon d-inline-flex justify-content-center align-items-center h-80px w-80px rounded-circle text-white" 
									v-html="options.nav.icon.icon" 
									v-bind:style="style(options.nav, 'background-color')">
								</span>
								<p class="navigation-description spacer" v-html="options.nav.description"></p>
							</div>
						</div>
					</div>
					<div class="col-lg-3 col-md-3 vh-100 border-md-left navigation-column">
						<div class="d-flex align-items-end flex-column vh-100 position-relative">
							<footer class="navigation-footer mt-auto w-100 text-secondary bg-white">
								<p class="p small spacer m-0">{{ configuration.application.tagline }}</p>
								<p class="p small spacer border-top m-0">{{ `&copy; ${ date() } ${ configuration.application.name }` }}</p>
							</footer>
						</div>
					</div>
				</div>
			</CustomScroll>
		</nav>
	</div>
</template>

<script>
	import moment from 'moment';
	import Page from "~/helpers/core/page.js";
	import CustomScroll from "~/components/core/ui/CustomScroll.vue";
	
	export default {
		name: "Navigation",
		components: {
			CustomScroll
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			navigation () {
				return this.$store.state.api.navigation.navigation;
			},
			page () {
				return Page.get(this.$store.state.api.pages, true, 'app');
			},
			pages () {
				return this.$store.state.api.pages;
			}
		},
		data () {
			return {
				goback: false,
				routed: false,
				options: {
					logo: true,
					menu: false,
					info: true,
					nav: {
						description: '',
						color: 'fff',
						icon: {
							icon: ''
						}
					}
				},
				logotimer: 0
			};
		},
		methods: {
			attributes (nav) {
				let attributes = {};
				
				if (nav.internal) attributes['to'] = nav.path;
				else {
					attributes['href'] = nav.path;
					attributes['target'] = "_blank";
				}
				
				return attributes;
			},
			controls (mode) {
				if (mode === 'open') {
					this.$el.classList.remove('off');
					this.$el.classList.add('on');
					
					this.options.menu = true;
				}
				else {
					this.$el.classList.remove('on');
					this.$el.classList.add('off');
				}
			},
			fullscreen (e) {		
				const button = e.currentTarget;
				
				/*
					Get the documentElement (<html>) or HTML DOM Element to display the page in fullscreen
				*/
				
				let element = document.documentElement;
				let target = button.getAttribute('data-toggle-target');
				
				if (target) element = document.querySelector(target);
				
				var isFullscreen = document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || false;
				
				element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen || function () { return false; };
				
				document.cancelFullScreen = document.cancelFullScreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen || function () { return false; };
			
				isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();			
			},
			date () {
				return moment().format( this.configuration.application.format.copyright );
			},
			details (nav) {
				nav = nav || this.options.active;
				
				if (nav) {
					this.options.nav = {
						id: nav.id,
						color: nav.color,
						description: nav.description,
						icon: nav.icon
					};
				}
				else this.options.nav.id = null;
			},
			navigate (direction) {
				direction = Number(direction);
				
				let page = Page.get(this.pages, this.$route.path);
				
				if (this.routed) this.$router.go(direction);
				else if (page && page.parent) {
					let parent = Page.get(this.pages, true, page.parent);
					
					this.$router.push({
						path: parent.path
					});
				}
				else this.$router.push({
					path: '/'
				});
			},
			paths (path) {
				path = typeof path === 'string' ? path : this.$route.path;
				
				return path.replace(/^\/+/, '').split('/');
			},
			routedActive () {
				let elements = document.querySelectorAll('.navigation-item');
				let currpath = this.$route.path;
				let active;
				
				_.forEach(elements, (node) => {
					if (node.getAttribute('href') === currpath) active = node;
	
					node.classList.remove('active');
				});
				
				if (!active) return false;
				
				active.classList.add('active');
				
				let index = active.getAttribute('data-index');
				let nav = _.get(this.navigation, index);
								
				if (nav) setTimeout(() => {
					this.details(nav);
					this.options.active = nav;
				}, 100);
			},
			showlogo () {
				clearTimeout(this.logotimer);
				
				setTimeout(() => {
					this.options.logo = false;
				}, 50000);
			},
			style (nav, prop) {
				prop = prop || 'color';
				
				let style = {};			
				style[prop] = `#${ nav.color }`;
							
				return style;
			},
			onMouseover (e) {
				let element = e.currentTarget;
				let index = element.getAttribute('data-index');
				let nav = _.get(this.navigation, index);
				
				this.details(nav);			
			},
			onMouseleave (e) {
				this.details(false);
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Navigation.mounted");
			
			this.options.logo = true;
						
			this.options.nav.id = 0;	
			
			if (this.$route.path !== '/') this.goback = true;
			
			this.routedActive();
			
			this.showlogo();
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Navigation.updated");
		},
		watch: {
			$route (to, from) {
				this.controls('close');
				
				this.options.logo = true;
				
				if (to.path === '/') {
					this.goback = false;
					this.routed = false;
				}
				else {
					this.goback = true;
					this.routed = false;
				}
				
				this.routedActive();
			
				this.showlogo();
			}
		}
	}	
</script>

<style lang="less">	
	
	@import '../../../assets/styles/mixins/mixins.less';	
	
	html {
		body {
			#wrapper {
				#navigation[role="app navigation"] {
					.navigation-bg{
						z-index: 1;
					}
					.navigation-controls{
						z-index: 3;
						
						button {
							pointer-events: auto;
							margin-right: 2px;
							
							.icon-logo {
								width: 24px;
							}
						}
						
						&.secondary {
							button {
								display: none;
							}
						}
					}				
					.navigation-container {
						z-index: 2;
						
						.navigation-row {
							.navigation-column {
								.navigation-section {
									.navigation-group {
										.navigation-item {
											.navigation-text {
												font-weight: 400;
												
												&:before {
													content: '';
													position: absolute;
													left: -1rem;
													width: 4px;
													height: 100%;
													background: transparent;
													.transition();
												}
											}
											
											&.active {
												pointer-events: none;
											}
												
											&:hover, &:active, &.active {
												.navigation-text {
													&:before {
														background: @colorsecondary;
													}													
												}
											}
										}
									}
									
									&:last-child {
										border: none !important;
									}
								}
								.navigation-message {
									.navigation-icon {
										margin-bottom: 1rem;
									}
								}
								.navigation-footer {
									p {
										font-weight: 500;
									}
								}
							}
						}					
					}
						
					&.off {
						.navigation-controls {
							.navigation-controls-close {
								display: none;
							}
						}
						.navigation-container {
							opacity: 0;
							pointer-events: none;
							animation: fadeOutRightSmall 600ms @ease;
						}
					}
						
					&.on {
						.navigation-controls {
							.navigation-controls-close {
								display: inline-block;
							}
							&.secondary {
								button {
									display: block;
								}
							}
						}
						.navigation-container {
							opacity: 1;
							pointer-events: auto;
							animation: fadeInRightSmall 600ms @ease;
						}
					}
				}
			}
		}
	}
	
    @media (min-width: @breakpoint-md)
    {
        footer.navigation-footer {
	        position: fixed;
	        bottom: 0;
	        right: 0;
	        width: ~"calc(25% - 1px)" !important;
        }
    }	
</style>