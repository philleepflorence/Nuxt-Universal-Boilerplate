<template>
	<div v-bind:id="`page-${ page.name }`" class="vh-100 page-wrapper" role="wrapper" v-bind:key="keys.element" v-if="loaded">
		<ImageLoader 
			v-bind:src="page.image.name" 
			size="cdn" 
			format="background" 
			classname="position-fixed position-full bg-cover-center bg-cover-dark"
			v-if="background">
		</ImageLoader>
		<div class="page-container vh-100">
			<slot></slot>
		</div>	
	</div>
</template>

<script>
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PageWrapper",
		props: ['page', 'background', 'mode'],
		components: {
			ImageLoader
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				timer: 0,
				loaded: false,
				rendered: false
			};
		},
		methods: {
			reload () {
				this.keys.element = Page.utils.rand();
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
				
				this.rendered = true;
			}
		},
		head () {
			return Page.metadata(this.page, this.configuration);
		},
		mounted () {
			this.loaded = this.$store.state.app.loaded;
					
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.mounted - loaded:", this.loaded);
			
			if (this.loaded) this.render();	
			else {
				const subscription = this.$store.subscribe((mutation, state) => {
					if (mutation.payload.key === 'loaded') {
						this.loaded = this.$store.state.app.loaded;						
						
						if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.loaded");
						
						this.render();
						
						setTimeout(subscription, 300);
					}												
				});
			}
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.updated");
			
			if (!this.rendered) this.render();	
		}
	}
</script>