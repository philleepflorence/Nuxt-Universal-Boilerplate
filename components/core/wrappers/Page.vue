<template>
	<div v-bind:class="`page-${ page.slug } vh-100 page-wrapper`" role="wrapper" v-bind:key="keys.element">
		<ImageLoader 
			v-bind:src="page.image.name" 
			size="cdn" 
			format="background" 
			classname="position-absolute position-full bg-cover-center bg-cover-dark"
			container="position-fixed position-full page-image-overlay"
			v-if="background">
		</ImageLoader>
		<div class="page-container vh-100 position-relative">
			<slot></slot>
		</div>
	</div>
</template>

<script>	
	import _ from 'lodash';
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PageCoreWrapper",
		props: [
			'background',
			'content',
			'mode',
			'page',
			'parent'
		],
		components: {
			ImageLoader
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
			}
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
				if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.render");
				
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
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.mounted");
			
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
					this.keys.element = Page.utils.rand();
				}												
			});
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.updated");
			
			if (!this.rendered) this.render();	
		},
		beforeDestroy () {
			if (this.$reload) this.$reload();
		}
	}
</script>

<style lang="less">
	.page-wrapper {
		box-shadow: 0 -3px 0 0 fade(black, 30);
	}
</style>