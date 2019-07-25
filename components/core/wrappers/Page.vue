<template>
	<div v-bind:id="`page-${ page.name }`" class="container-fluid p-0 vh-100 page-wrapper" role="wrapper" v-bind:key="keys.page">
		<ImageLoader 
			v-bind:src="page.image.name" 
			size="cdn" 
			format="background" 
			classname="position-fixed position-full bg-cover-center bg-cover-dark"
			v-if="background">
		</ImageLoader>
		<div class="page-container">
			<slot></slot>
		</div>	
	</div>
</template>

<script>
	import _ from 'lodash';	
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PageWrapper",
		props: ['background', 'content', 'mode'],
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
		data () {
			return {
				keys: {
					page: Page.utils.rand()
				},
				timer: 0
			};
		},
		methods: {
			reload () {
				this.key = Page.utils.rand();
			},
			render () {
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
			}
		},
		head () {
			return Page.metadata(this.page, this.configuration);
		},
		mounted () {		
			if (window.DEBUG) console.log("debug - app.components.wrappers.Page.mounted");
			
			this.render();	
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.wrappers.Page.updated");
			
			this.render();		
		}
	}
</script>

<style lang="less" scoped>
	.page-wrapper {
		box-shadow: 0 -3px 0 0 fade(black, 30);
	}
</style>