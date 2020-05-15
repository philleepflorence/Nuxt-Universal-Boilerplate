<template>
	<div v-bind:class="`page-${ page.slug } vh-100 vh-fixed page-wrapper bg-dark`" role="wrapper" v-bind:key="keys.element">
		<div class="page-container vh-100 vh-fixed position-relative row no-gutters bg-dark animated fadeIn">
			
			<div class="d-flex flex-wrap vh-100 vh-fixed page-previews" 
				v-bind:data-count="count" 
				v-if="previews">
				<div class="page-previews-item flex-grow-1 position-relative a-delay animated fadeInUpSmall"
					v-for="row in rows"
					v-bind:key="row.slug"
					v-bind:data-color-mode="row.mode">
					<NavLink
						classname="d-block h-100 bg-primary position-relative"
						v-bind:internal="true"
						v-bind:nav="row"
						v-bind:index="`${ page.slug }-previews-${ row.slug }`">
						<ImageLoader
							v-bind:src="row.image.name" 
							size="cdn" 
							format="background" 
							classname="position-absolute position-full bg-cover-center bg-cover-dark-md"
							container="page-previews-image position-absolute position-full">
							<span class="page-previews-overlay bg-primary position-absolute position-full"></span>
						</ImageLoader>
						<div class="d-flex align-items-center position-absolute position-full">
							<section class="flex-item lead p-3 w-100 text-white page-previews-name">
								<h6 class="font-weight-book page-previews-hover page-previews-name">{{ row.headline }}</h6>
								<span class="page-previews-hover" v-html="row.icon.icon"></span>
							</section>
						</div>
					</NavLink>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>	
	import _ from 'lodash';
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";	
	import NavLink from "~/components/core/ui/NavLink.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PagePreviewWrapper",
		props: [
			'page',
			'previews'
		],
		components: {
			ImageLoader,
			NavLink
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			count () {
				if (this.rows) return _.size(this.rows);
				
				return 0;
			},
			hash () {
				if (!this.$route.hash.length) return null;
				
				let hash = this.$route.hash.replace('#!/', '').split('/');
				
				return hash;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			loaded () {
				return this.$store.state.app.loaded;
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
			rows () {
				let rows = {};
				
				_.forEach(this.previews, (row) => {
					if (_.size(rows) < this.max) _.set(rows, row.slug, row);
				});
				
				return rows;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				timer: 0,
				rendered: false,
				max: 6
			};
		},
		methods: {
			metadata () {
				let path = Page.path(this.$route.path);
				let page = Page.get(this.pages, path);
				let metadata = this.path ? this.$store.state.app.metadata[path] : null;
				
				if (metadata) return metadata;
				
				metadata = Page.metadata(this.$props.page, this.configuration);
				
				return metadata;
			},
			reload () {
				this.keys.element = Page.utils.rand();
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.wrappers.Previews.render");
				
				if (this.page) Page.color(this.page.mode);
				
				if (this.$props.mode) {
					clearTimeout(this.timer);
					
					this.timer = setTimeout(() => {
						document.body.setAttribute('data-mode', this.$props.mode);
					}, 300);
				}
				else {
					clearTimeout(this.timer);
					
					this.timer = setTimeout(() => {
						document.body.removeAttribute('data-mode');
					}, 300);
				}
				
				if (this.path) {
					this.$store.commit('app/METADATA', {
						key: this.path,
						data: this.metadata()
					});	
				}
				
				this.rendered = true;
			}
		},
		head () {
			return this.metadata();
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Previews.mounted");
			
			this.customscroll = this.$el.closest('[data-custom-scroll]');
			
			if (this.loaded) this.render();	
			else {
				const subscription = this.$store.subscribe((mutation, state) => {
					if (mutation.payload.key === 'loaded') {						
						this.render();						
						setTimeout(subscription, 300);
					}												
				});
			}
			
			this.$reload = this.$store.subscribe((mutation, state) => {
				if (Array.isArray(mutation.payload) && mutation.payload[0] === 'app:page:reload') {
					if (window.DEBUG) console.log("debug - app.components.core.wrappers.Previews.subscribe - app:page:reload");
					
					this.keys.element = Page.utils.rand();
				}												
			});
			
			this.$router.afterEach((to, from) => {
				if (!this.customscroll && to.path.indexOf(from.path) < 0) {
					Page.scrollTo(null, 0, 0);
				}
			});	
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Previews.updated");
			
			if (!this.rendered) this.render();	
		},
		beforeDestroy () {
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Previews.beforeDestroy");
			
			if (this.$reload) this.$reload();
		}
	}
</script>

<style lang="less">	
	
	@import '../../../assets/styles/mixins/mixins.less';
	
	.page-wrapper {
		box-shadow: 0 -3px 0 0 fade(black, 30);
		
		.page-container {
			.page-previews {
				padding: 1px;
				
				.page-previews-item {
					padding: 1px;
					min-height: ~"calc(100vh - 2px)";
					min-width: ~"calc(100vw - 2px)";
					text-align: right;
					
					&:nth-child(2n) {
						text-align: left;
					}
					
					.page-previews-overlay {
						opacity: 0.5;
					}
					
					.page-previews-name {
						@media (min-width: @breakpoint-xl) {
							.page-previews-name {
								font-size: 2rem !important;
								font-weight: 300 !important;
							}
						}
						@media (min-width: @breakpoint-lg) {
							.page-previews-name {
								font-size: 1.75rem !important;
								font-weight: 300 !important;
							}
						}
					}
				}
				
				&[data-count="2"] {
					.page-previews-item {
						min-height: ~"calc(50vh - 2px)";
					}
				}
				&[data-count="3"] {
					.page-previews-item {
						min-height: ~"calc(33.33333vh - 2px)";
					}
				}
				&[data-count="4"] {
					.page-previews-item {
						min-height: ~"calc(50vh - 2px)";
						min-width: ~"calc(50vw - 2px)";
					}
				}
				&[data-count="5"],
				&[data-count="6"] {
					.page-previews-item {
						min-height: ~"calc(33.33333vh - 2px)";
						min-width: ~"calc(50vw - 2px)";
					}
				}
				&[data-count="5"] {
					.page-previews-item {
						&:nth-child(3) {
							min-width: ~"calc(100vw - 2px)";
							text-align: center;
						}
					}
				}
				
				@media screen and (orientation:landscape) {
					&[data-count="2"] {
						.page-previews-item {
							min-width: ~"calc(50vw - 2px)";
							min-height: ~"calc(100vh - 2px)";
						}
					}
					&[data-count="3"],
					&[data-count="4"] {
						.page-previews-item {
							min-width: ~"calc(50vw - 2px)";
							min-height: ~"calc(50vh - 2px)";
						}
					}
					&[data-count="5"],
					&[data-count="6"] {
						.page-previews-item {
							min-width: ~"calc(33.3333333vw - 2px)";
							min-height: ~"calc(50vh - 2px)";
						}
					}
					&[data-count="3"] {
						.page-previews-item {
							&:nth-child(3) {
								min-width: ~"calc(100vw - 2px)";
							}
						}
					}
					&[data-count="5"] {
						.page-previews-item {
							&:nth-child(1),
							&:nth-child(2) {
								min-width: ~"calc(50vw - 2px)";
							}
						}
					}
				}
			}
		}
	}
	
	[data-device-control="mouse"] {
		.page-previews-item {
			&:hover, &:active {
				.page-previews-hover {
					&, * {
						color: white !important;
					}
				}
				.page-previews-overlay {
					opacity: 0.8 !important;
				}				
			}
		}
	}
</style>