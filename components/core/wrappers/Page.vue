<template>
	<div v-bind:id="`page-${ page.name }`" class="vh-100 page-wrapper" role="wrapper" v-bind:key="keys.element">
		<slot></slot>	
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PageWrapper",
		props: [
			'parent',
			'page'
		],
		computed: {
			configuration () {
				return this.$store.state.api.config;
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