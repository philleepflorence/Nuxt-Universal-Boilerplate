<template>
	<div v-bind:id="`page-${ page.name }`" class="container-fluid vh-100 auth-container" role="wrapper" v-bind:key="keys.element">
		<ImageLoader 
			classname="position-fixed position-full bg-cover-center bg-cover-dark" 
			format="background" 
			size="cdn" 
			v-bind:src="page.image.name">
		</ImageLoader>
		<div class="d-flex align-items-center vh-100 spacer">
			<section class="p w-100 max-w-640px mx-auto spacer animated fadeInUp">
				<span class="p-3 text-center d-block text-white" v-html="page.icon.icon"></span>
				<h1 class="text-center fs-2rem text-white mb-4 cursor-hand" v-on:click="reload">{{ page.headline }}</h1>
				<div class="p text-white empty text-center font-weight-book" v-html="page.synopsis"></div>
				<div class="page-container pt-3">
					<slot></slot>
				</div>
				<footer class="my-4 text-center transition auth-navigation text-white">
					<nuxt-link v-for="nav in navigation" v-bind:key="nav.slug" v-bind:to="nav.path" class="auth-navigation text-primary-hover mx-2 fs-12px font-weight-book">{{ nav.title }}</nuxt-link>
				</footer>
			</section>
		</div>		
	</div>
</template>

<script>
	import _ from 'lodash';		
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "UserCoreWrapper",
		props: ['content'],
		components: {
			ImageLoader
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
				let path = this.$route.path;
				
				navigation = _.filter(navigation, function (row) {
					return row.path !== path;
				});
				
				return navigation;
			},
			page () {
				let page = Page.get(this.pages, this.$route.path);
				
				if (this.$props.content) page = Page.content(page, this.$props.content);
				
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
			reload () {
				this.keys.element = Page.utils.rand();
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
			return Page.metadata(this.page, this.configuration);
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.User.mounted");
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