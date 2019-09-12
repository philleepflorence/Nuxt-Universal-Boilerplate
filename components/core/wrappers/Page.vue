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
			'page', 
			'mode'
		],
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			loaded () {
				return this.$store.state.app.loaded;
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
			reload () {
				this.keys.element = Page.utils.rand();
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.render", this.$props.parent);
				
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
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.mounted", this.$props.parent);
			
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
			if (window.DEBUG) console.log("debug - app.components.core.wrappers.Page.updated", this.$props.parent);
			
			if (!this.rendered) this.render();	
		},
		beforeDestroy () {
			if (this.$reload) this.$reload();
		}
	}
</script>