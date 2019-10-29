<template>
	<div v-bind:id="`page-${ page.name }`" class="container-fluid vh-100 auth-container" role="wrapper" v-bind:key="keys.element">
		<ImageLoader 
			classname="position-fixed position-full bg-cover-center bg-cover-dark" 
			format="background" 
			size="cdn" 
			v-bind:src="page.image.name">
		</ImageLoader>
		<div class="d-flex align-items-center vh-100 spacer">
			<section class="p w-100 mx-auto spacer animated fadeInUp">
				<span class="p-3 text-center d-block text-white" v-html="page.icon.icon"></span>
				<h1 class="text-center fs-2rem text-white mb-4 cursor-hand" v-on:click="reload">{{ format(page.headline) }}</h1>
				<div class="p text-white empty text-center font-weight-book" v-html="format(page.synopsis)"></div>
				<div class="page-container pt-3">
					<slot></slot>
				</div>
				<footer class="my-4 text-center transition auth-navigation text-white">
					<NavLink
						v-for="nav in navigation" 
						v-bind:nav="nav"
						v-bind:key="nav.slug"
						v-bind:index="nav.slug"
						class="auth-navigation text-primary-hover mx-2 fs-12px font-weight-book">
						{{ nav.title }}
					</NavLink>
				</footer>
			</section>
		</div>		
	</div>
</template>

<script>
	import _ from 'lodash';		
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";
	import NavLink from "~/components/core/ui/NavLink.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "UserCoreWrapper",
		props: ['content'],
		components: {
			ImageLoader,
			NavLink
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			labels () {
				return this.$store.state.api.labels;
			},
			navigation () {
				let navigation = this.$store.state.api.navigation.accounts;
				
				navigation = _.filter(navigation, (row) => {
					return row.path !== this.path;
				});
				
				return navigation;
			},
			page () {
				let page = Page.get(this.pages, this.path);
				
				if (this.content) {
					page = Page.content(page, this.content); 					
					this.$store.commit("app/CONTENT", page);
				}
				
				return page;
			},
			pages () {
				return this.$store.state.api.pages;
			},
			path () {
				return this.$route.path;
			}
		},
		methods: {
			format (string) {
				return Page.utils.format (string, this.$store.state.api.config.components.display);
			},
			metadata () {
				let path = this.$route.path;
				let metadata = this.$store.state.app.metadata[path];
				
				if (metadata) return metadata;
				
				metadata = Page.metadata(this.page, this.configuration);
				
				return metadata;
			},
			reload () {
				this.keys.element = Page.utils.rand();
			},
			render () {
				if (this.page.mode) {
					clearTimeout(this.timer);
					
					this.timer = setTimeout(() => {
						document.body.setAttribute('data-mode', this.page.mode);
					}, 300);
				}
				else {
					clearTimeout(this.timer);
					
					this.timer = setTimeout(() => {
						document.body.removeAttribute('data-mode');
					}, 300);
				}
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		head () {
			return this.metadata();
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.User.mounted");
			
			this.render();	
				
			this.$store.commit('app/METADATA', {
				key: this.path,
				data: this.metadata()
			});
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.User.updated");
		}
	}
</script>

<style lang="less" scoped>
	.plain-form {
		.form-control {
			border: none !important;
			background: fade(white, 80);
			
			&:focus {
				background: fade(white, 90);
				outline: none !important;
			}
		}
	}
	.auth-container {
		footer.auth-navigation {
			&:before {
				content: '';
				display: block;
				border-bottom: fade(white, 30) 1px solid;
				width: 25%;
				margin: 2rem auto 2rem auto;
			}
		}
		.form {
			.form-group {
				padding-bottom: 0.5rem !important;
				
				&:last-child {
					padding-bottom: 0 !important;
				}
			}
		}
	}	
</style>