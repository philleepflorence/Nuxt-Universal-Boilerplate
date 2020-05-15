<template>
	<div v-bind:class="`page-${ page.slug } vh-100 vh-fixed page-wrapper`" role="wrapper" v-bind:key="keys.element">
		<div class="page-container vh-100 vh-fixed position-relative row no-gutters">
			
			<!-- Element: Left Column -->
			
			<aside class="col-lg-5 col-xl-6 page-container-header bg-dark position-relative vh-fixed">
				
				<!-- Component: Image Loader -->
				
				<app-component-ui-image-loader 
					v-bind:src="page.image.name" 
					size="cdn" 
					format="background" 
					classname="position-absolute position-full bg-cover-center bg-cover-dark"
					container="page-container-image position-fixed"
					v-if="background">
					
					<!-- Element: Page Header Overlay -->
					
					<slot name="overlay">
						<aside class="page-container-image-overlay opacity-20 bg-primary-gradient position-absolute position-full"></aside>
					</slot>
					
					<!-- Element: Page Header Contents -->
					
					<slot name="header">
						<header class="d-flex h-100 align-items-center text-shadow position-relative">
							<section class="w-100 text-center text-white p-4">
								<h1 class="cursor-hand page-container-headline" v-on:click="reloadPage" v-html="page.headline"></h1>
								<h5 class="opacity-90 page-container-subheadline" v-if="subheadline" v-html="subheadline"></h5>
								<span class="position-relative pt-2 d-inline-block" v-html="page.icon.icon" v-if="page.icon"></span>
								<footer></footer>
							</section> 
						</header>					
					</slot>
				</app-component-ui-image-loader>
				
				<!-- Element: Page Header Navigation -->
				
				<footer class="page-container-navigation position-fixed p-2">
					<app-component-ui-nav-link
						v-for="(nav, index) in navigation"
						v-bind:nav="nav" 
						v-bind:key="nav.slug" 
						v-bind:index="nav.slug"
						class="navigation-item">
						<button class="plain h-24px w-24px my-2 mx-3 text-white" v-html="getIcon(nav).icon"></button>
					</app-component-ui-nav-link>
				</footer>
				
			</aside>
			
			<!-- Element: Right Column -->
			
			<div class="col-lg-7 col-xl-6 page-container-contents bg-container pb-10" v-bind:data-subnavigation="parseBoolean(subnavigation)">
				
				<!-- Element: Page Content Head or Main Slideshow -->
				
				<slot name="head">
					<div class="position-relative p-letterbox" v-if="slideshow">
						<app-component-ui-image-loader 
							v-bind:src="slideshow.image.name" 
							size="cdn" 
							format="background" 
							classname="position-absolute position-full bg-cover-center bg-cover-dark-md"
							container="position-full position-absolute">
						</app-component-ui-image-loader>
					</div>
				</slot>
				
				<!-- Element: Page Sub Navigation -->
				
				<nav class="d-flex flex-row page-container-subnavigation bg-content border-bottom" v-if="subnavigation">
					<nuxt-link 
						v-bind:class="`d-flex align-items-center justify-content-center h-50px text-muted flex-fill text-primary-active border-left ${ parseActive(row) ? 'active' : '' }`" 
						v-for="row in subnavigation"
						v-bind:key="`subnavigation-${ row.slug }`"
						v-html="row.icon.icon"
						v-bind:to="row.path">
					</nuxt-link>
				</nav>
				
				<!-- Element: Page Content -->
				
				<div v-bind:class="`page-container-content d-flex ${ fluid ? 'content-fluid align-items-start' : 'align-items-center' }`">
					<div class="d-flex-item w-100">
						<section class="page-container-section" v-if="isContent">
							<header class="lead bg-content p-4 mb-2" v-html="synopsis" v-if="synopsis"></header>
							<div class="p bg-content p-4 mb-2" v-html="contents" v-if="contents"></div>
						</section>
						<slot name="contents"></slot>					
					</div>					
				</div>
				
				<!-- Component: Page Resources -->
				
				<div class="position-relative mb-2" v-if="resources">
					<app-component-page-resources 
						v-bind:resources="resources" 
						v-bind:header="true">
					</app-component-page-resources>
				</div>
				
				<!-- Component: Application Feedback Form -->
				
				<app-component-form-feedback
					container="page-container-row bg-content p-4 mb-2">
				</app-component-form-feedback>
				
				<!-- Element: Next Page -->
				
				<nav class="bg-content text-center mb-2" v-if="next">
					<nuxt-link class="d-block position-relative" v-bind:to="next.path">
						<app-component-ui-image-loader
							v-bind:src="next.image.name" 
							size="cdn" 
							format="background"
							classname="position-absolute position-full bg-cover-center bg-cover-dark-md"
							container="position-absolute position-full">
						</app-component-ui-image-loader>	
						<div class="position-relative p-4">
							<span 
								class="h-60px w-60px bg-white text-primary m-auto rounded-circle d-flex align-items-center justify-content-center"
								v-html="next.icon.icon">
							</span>
							<h2 class="my-4 text-white">{{ next.headline }}</h2>
							<span class="text-white" v-html="icons.page.next.icon.icon"></span>
						</div>					
					</nuxt-link>					
				</nav>
				
				<!-- Element: Footer Navigation -->
								
				<footer class="page-container-footer">
					<slot name="footer"></slot>					
				</footer>
								
			</div>
			
		</div>
	</div>
</template>

<script>	
	import { get, size } from 'lodash';
	
	import ComponentFormFeedback from "~/components/core/forms/Feedback.vue";
	import ComponentUIImageLoader from "~/components/core/ui/ImageLoader.vue";	
	import ComponentUINavLink from "~/components/core/ui/NavLink.vue";
	import ComponentPageResources from "~/components/core/pages/Resources.vue";
	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PageCoreWrapper",
		props: [
			'background',
			'content',
			'contents',
			'fluid',
			'page',
			'parent',
			'slideshow',
			'subheadline',
			'subnavigation',
			'synopsis'
		],
		components: {
			'app-component-form-feedback': ComponentFormFeedback,
			'app-component-ui-image-loader': ComponentUIImageLoader,
			'app-component-ui-nav-link': ComponentUINavLink,
			'app-component-page-resources': ComponentPageResources
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				timer: 0,
				rendered: false
			};
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			hash () {
				if (!this.$route.hash.length) return null;
				
				let hash = this.$route.hash.replace('#!/', '').split('/');
				
				return hash;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			isContent () {
				return this.contents || this.synopsis;
			},
			loaded () {
				return this.$store.state.app.loaded;
			},
			navigation () {
				return this.$store.state.api.navigation.header;
			},
			next () {
				if (this.page.next_page) return get(this.pages, this.page.next_page.slug);
				
				return null;
			},
			pages () {
				return this.$store.state.api.pages;
			},
			path () {
				let path = Page.path(this.$route.path);
				let page = Page.get(this.pages, path);

				if (page.name === this.page.name) return path;
				
				return null;
			},
			resources () {
				if (!this.page || !this.page.resources.length) return null;
				
				return this.page.resources;
			}
		},
		methods: {
			getIcon (nav) {
				if (nav.icon) return nav.icon;
				
				return nav.page.icon;
			},
			getMetadata () {
				let path = Page.path(this.$route.path);
				let page = Page.get(this.pages, path);
				let metadata = this.path ? this.$store.state.app.metadata[path] : null;
				
				if (metadata) return metadata;
				
				metadata = Page.metadata(this.$props.page, this.configuration);
				
				return metadata;
			},
			onScrollTop () {
				Page.scrollTo(null, 0);
			},
			parseBoolean (input) {
				if (!input || input === "undefined" || input === null) return false;
				
				return size(input) > 0;
			},
			parseActive (input) {
				if (input.url) return input.url === this.$route.path;
				
				return this.$route.path === input.path;
			},
			reloadPage () {
				this.keys.element = Page.utils.rand();
			},
			renderPage () {
				if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.render");
				
				window.document.body.setAttribute('data-page-mode', 'app');
				
				if (this.page) Page.color(this.page.mode);
				
				if (this.path) {
					this.$store.commit('app/METADATA', {
						key: this.path,
						data: this.getMetadata()
					});	
				}
				
				this.rendered = true;
			}
		},
		head () {
			return this.getMetadata();
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.mounted");
			
			this.customscroll = this.$el.closest('[data-custom-scroll]');
			
			if (this.loaded) this.renderPage();	
			else {
				const subscription = this.$store.subscribe((mutation, state) => {
					if (mutation.payload.key === 'loaded') {						
						this.renderPage();						
						setTimeout(subscription, 300);
					}												
				});
			}
			
			this.$reload = this.$store.subscribe((mutation, state) => {
				if (Array.isArray(mutation.payload) && mutation.payload[0] === 'app:page:reload') {
					if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.subscribe - app:page:reload");
					
					this.keys.element = Page.utils.rand();
				}												
			});
			
			this.$router.afterEach((to, from) => {
				if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.afterEach");
				
				if (!this.customscroll && to.path.indexOf(from.path) < 0) {
					Page.scrollTo(null, 0, 0);
				}
			});
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.updated");
			
			if (!this.rendered) this.renderPage();	
		},
		beforeDestroy () {
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.beforeDestroy");
			
			window.document.body.removeAttribute('data-page-mode');
			
			if (typeof this.$reload === "function") this.$reload();
		}
	}
</script>

<style lang="less">	
	
	@import '../../../assets/styles/mixins/mixins.less';
	
	.page-wrapper {
		box-shadow: 0 -3px 0 0 fade(black, 30);
		
		.page-container {
			.page-container-header {
				.page-container-subheadline {
					line-height: 1.5em;
				}
				
				.page-container-navigation {
					animation-delay: 700ms !important;
				}
				
				@media (min-width: @breakpoint-lg-min) {
					height: 100vh;
					
					.page-container-navigation {
						text-align: center;
						bottom: 0;
					}
				}
				
				@media (max-width: @breakpoint-lg-min) {
					height: 45vh;
					
					.page-container-image {
						width: 100%;
						height: 45vh;
					}
					
					.page-container-navigation {
						text-align: right;
						top: 45%;
						width: 100%;
						margin-top: -4rem;
						margin-right: 2rem;
					}
				}
				
				@media (min-width: @breakpoint-lg) {					
					.page-container-image {
						width: 41.666667%;
						height: 100%;
					}
						
					.page-container-navigation {
						width: 41.666667%;
					}
				}
				
				@media (min-width: @breakpoint-xl) {					
					.page-container-image {
						width: 50%;
						height: 100%;
					}
						
					.page-container-navigation {
						width: 50%;
					}
				}
			}
			.page-container-contents {
				@media (min-width: @breakpoint-lg-min) {
					border-left: 1px solid @mainbordercolor !important;
					min-height: 100vh;
					
					.page-container-content:not(.content-fluid) {
						min-height: 100vh;
					}
				}
				
				@media (max-width: @breakpoint-lg-min) {
					min-height: auto !important;
					
					.page-container-content:not(.content-fluid) {
						min-height: 55vh;
					}
				}
			}
			
			.page-container-subnavigation {
				a:first-child {
					border: none !important;
				}
			}
			
			.page-contents-full {
				@media (min-width: @breakpoint-lg-min) {
					min-height: ~"calc(100vh - 0.5rem)";
				}
				
				@media (max-width: @breakpoint-lg-min) {
					min-height: ~"calc(55vh - 0.5rem)" !important;
				}
			}
			
			.page-container-contents {
				@media (min-width: @breakpoint-lg-min) {
					border: none !important;
				}
			}
			
			[data-subnavigation="true"] {
				.page-contents-full {
					@media (min-width: @breakpoint-lg-min) {
						min-height: ~"calc(100vh - 60px)";
					}
					
					@media (max-width: @breakpoint-lg-min) {
						min-height: ~"calc(55vh - 60px)";
					}
				}				
			}
		}
	}
</style>