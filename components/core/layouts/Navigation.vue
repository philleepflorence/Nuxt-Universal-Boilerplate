<template>
	<div id="navigation" role="app navigation" class="position-relative off" v-bind:key="keys.element">
		<nav class="navigation-controls transition position-fixed mt-2 h-50px w-100 pointer-events-none d-flex">
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-primary-active text-white navigation-controls-open" 
				v-html="icons.menu.open.icon.icon" 
				v-on:click="controls('open')">
			</button>
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-primary-active text-white navigation-controls-close position-absolute position-top position-left" 
				v-html="icons.menu.close.icon.icon" 
				v-on:click="controls('close')">
			</button>
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-primary-active text-white animated fadeIn"
				v-show="options.logo">
				<span class="filter-white"><img v-bind:src="configuration.application.favicon" class="icon-logo"></span>
				<a class="position-absolute position-full" href="/"></a>
			</button>
			<button 
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-primary-active text-white navigation-controls-back animated fadeIn animated fadeInRight delay-1s faster" 
				v-html="icons.history.back.icon.icon" 
				v-on:click="navigate(-1)" 
				v-show="goback">
			</button>
		</nav>
		<nav class="navigation-controls secondary transition position-fixed position-right mt-2 h-50px w-100 pointer-events-none d-flex justify-content-end">
			<button 
				v-for="(button, key, index) in buttons"
				class="position-relative plain h-50px w-50px bg-primary bg-secondary-hover bg-secondary-active text-white animated fadeInRightSmall a-delay"
				v-html="button.icon.icon" 
				v-bind:data-overlay="button.url"
				v-bind:key="button.url"
				v-on:click="onOverlay">
			</button>
			<button 
				class="position-relative navigation-controls-fullscreen plain h-50px w-50px bg-primary bg-secondary-hover bg-secondary-active text-white animated fadeInRightSmall a-delay" 
				v-html="icons.toggle.fullscreen.icon.icon" 
				v-on:click="fullscreen()">
			</button>
		</nav>
		<nav id="navigation-container" class="navigation-container position-fixed position-full bg-white transform">
			<CustomScroll name="navigation">
				<div class="row no-gutters vh-100 navigation-row">
					
					<div class="col-lg-4 col-md-5 vh-100 navigation-column">
						<div class="d-flex flex-column align-items-center vh-100 pt-10">
							<header class="navigation-column-header spacer w-100 pb-5">
								<a class="position-relative d-block w-50" href="/">
									<img v-bind:src="configuration.application.logo" class="navigation-logo d-block w-100">
								</a>
							</header>
							<section v-for="(section, index) in navigation" v-bind:key="index" class="text-secondary navigation-section spacer w-100">
								<h4 class="navigation-header fancy fancy-left fancy-sm fs-1rem font-weight-book text-primary">
									<span class="text-primary">{{ index }}</span>
								</h4>
								<nav class="navigation-group">
									<NavLink
										v-for="(nav, key) in section"
										v-bind:nav="nav" 
										v-bind:key="nav.slug" 
										v-bind:index="`${index}.${key}`"
										class="navigation-item d-flex align-items-center mb-2 position-relative text-primary-hover text-primary-active">
										<span 
											class="navigation-text lead font-weight-book" 
											v-on:mouseover.stop="onMouseover" 
											v-on:mouseleave.stop="onMouseleave"
											v-bind:data-index="`${index}.${key}`">
											{{ nav.title }}
										</span>
									</NavLink>
								</nav>
							</section>
						</div>
					</div>
					
					<div class="col-lg-5 col-md-7 vh-100 border-lg-right navigation-column navigation-details d-none d-md-block">
						<div class="d-flex align-items-center vh-100">
							<div class="lead navigation-message text-center w-100" v-show="options.nav.id">
								<span 
									class="navigation-icon d-inline-flex justify-content-center align-items-center h-80px w-80px rounded-circle text-white animated fadeIn" 
									v-html="options.nav.icon.icon" 
									v-bind:style="style(options.nav, 'background-color')">
								</span>
								<p class="navigation-description spacer animated fadeIn" v-html="options.nav.description"></p>
							</div>
						</div>
					</div>
					
					<div class="col-lg-3 col-md-7 vh-100 border-md-left navigation-column">
						<div class="d-flex align-items-end flex-column vh-100 position-relative">
							<footer class="navigation-footer mt-auto w-100 text-secondary bg-white">
								<div class="p small spacer m-0" v-html="configuration.application.tagline"></div>
								<div class="p small spacer border-top m-0" v-html="configuration.application.disclaimer.contents" v-if="configuration.application.disclaimer.contents"></div>
								<p class="p spacer border-top m-0 text-primary"><small>{{ `${ date() } &mdash; ${ configuration.application.name } &mdash; v${ configuration.application.app.version }` }}</small></p>
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
	import CustomScroll from "~/components/core/ui/CustomScroll.vue";	
	import NavLink from "~/components/core/ui/NavLink.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "Navigation",
		components: {
			CustomScroll,
			NavLink
		},
		computed: {
			buttons () {
				return this.$store.state.api.labels.app.button.options;
			},
			configuration () {
				return this.$store.state.api.config;
			},
			domain () {
				return process.env.SERVER_DOMAIN || window.location.origin;
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
			},
			path () {
				return Page.path(this.$route.path);
			},
			routes () {
				return this.$store.state.app.routes;
			}
		},
		data () {
			return {
				components: {
					hash: '/#!/:overlay'
				},
				keys: {
					element: Page.utils.rand()
				},
				goback: false,
				routed: false,
				options: {
					logo: true,
					menu: false,
					info: true,
					content: {
						description: '',
						color: 'fff',
						icon: {
							icon: ''
						}
					},
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
				
				if (nav.internal) {
					attributes['to'] = nav.path;
				}
				else if (nav.path.indexOf(this.domain) === 0) {
					attributes['href'] = nav.path;
					attributes['target'] = "_self";
				}
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
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Navigation.navigate");
				
				direction = Number(direction);
				
				let page = Page.get(this.pages, this.path);
				
				if (this.routes.parent && this.routes.history.length === 1) {
					this.$router.push({
						path: this.routes.parent
					});
					
					this.$store.commit("app/HISTORY", false);
				}
				else if (this.routed) {
					this.$router.go(direction);
				}
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
			onOverlay (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Navigation.onOverlay");
				
				this.$store.commit("app/SET", {
					key: "app:options:overlay",
					data: e.currentTarget.getAttribute('data-overlay')
				});
				
				this.controls('close');			
			},
			paths (path) {
				path = typeof path === 'string' ? path : this.path;
				
				return path.replace(/^\/+/, '').split('/');
			},
			render (to) {
				to = to || this.$route || window.location;
				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Navigation.render");
				
				const home = (!to.path || this.path === '/') && (!to.hash || to.hash === '');
				
				this.controls('close');
				
				if (home) {
					this.goback = false;
					this.routed = false;
					
					if (process.env.LOGO_HIDE) {
						this.options.logo = true;
					}
				}
				else {
					this.goback = true;
					this.routed = true;
					
					if (process.env.LOGO_HIDE) {
						this.options.logo = false;
					}
				}
				
				this.routedActive();
			},
			routedActive () {
				let elements = document.querySelectorAll('.navigation-item');
				let currpath = this.path;
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
									
			this.options.nav.id = 0;	
			
			if (this.path !== '/' && this.$route.hash) this.goback = true;
			
			this.render();
						
			this.$store.commit("app/ROUTES", this.path);
			
			this.$store.subscribe((mutation, state) => {
				if (mutation.type === 'app/CONTENT' && !this.options.nav.id) {
					this.options.nav = {
						id: mutation.payload.id,
						color: mutation.payload.color,
						description: mutation.payload.headline,
						icon: mutation.payload.icon
					};
					this.options.content = this.options.nav;					
				}												
			});
			
			this.$router.afterEach((to, from) => {
				this.$store.commit("app/ROUTES", to.path);
				
				this.render(to);
			});	
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Navigation.updated");
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
	    .navigation-details {
		    position: fixed;
		    height: 100vh;
		    width: 58.33333333% !important;
	        left: 41.666667% !important;
	    }
	    
        footer.navigation-footer {
	        position: fixed;
	        bottom: 0;
	        right: 0;
	        width: ~"calc(58.33333333% - 1px)" !important;
        }
    }
	
    @media (min-width: @breakpoint-lg)
    {
	    .navigation-details {
		    position: fixed;
		    height: 100vh;
		    left: ~"calc(33.333333% - 1px)" !important;
	        width: ~"calc(41.666667% - 1px)" !important;
	    }
	    
        footer.navigation-footer {
	        position: fixed;
	        bottom: 0;
	        right: 0;
	        width: ~"calc(25% + 2px)" !important;
        }
    }
	
    @media (max-width: @breakpoint-sm)
    {
	    .navigation-controls.secondary {
		    top: auto !important;
		    bottom: 1rem !important;
        }
        
        footer.navigation-footer {
	        padding-bottom: 10rem !important;
        }
    }	
</style>