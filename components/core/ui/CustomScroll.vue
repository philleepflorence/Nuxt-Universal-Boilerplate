<template>
	<div class="custom-scroll position-absolute position-full" data-custom-scroll="name">
		<div class="custom-scroll-content position-relative">
			<slot></slot>
			<footer class="position-relative custom-scroll-footer spacer text-center" v-if="scrollable">
				<button class="btn w-80px h-80px rounded-circle bg-primary bg-primary-active bg-secondary-hover shadow text-white" v-html="icons.scroll.up.icon.icon" v-on:click="scrollup"></button>
			</footer>
		</div>
	</div>
</template>

<script>
	import { cloneDeep as __cloneDeep } from 'lodash';
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "CustomScroll",
		props: ['name', 'options', 'overlay'],
		computed: {
			icons () {
				return this.$store.state.api.icons;
			}
		},
		methods: {
			render (prop) {
				if (prop === true && this.overlay && this.$content) {
					this.scrollable = true;
				}
				else if (prop === false && this.overlay && this.$content) {
					this.scrollable = true;
				}
				else if (!prop && this.overlay && this.$content) {
					let rect = this.$content.getBoundingClientRect();
					let Rect = this.$el.parentElement;
					
					if (Rect.height < rect.height) {
						this.scrollable = true;
					}
					else {
						this.scrollable = false;
					}
				}				
			},
			scrollup (e) {
				let duration = 600;
				let rect = e.currentTarget.getBoundingClientRect();
				
				if (window.innerHeight < rect.top) {
					duration = Math.floor(rect.top * 0.80);
				}
				
				this.$el.OverlayScrollbars.scroll({ y: 0 }, duration);
			}
		},
		data () {
			return {
				keys: {
					element: 0
				},
				scrollable: false
			};
		},
		mounted () {
			this.$content = this.$el.querySelector('.custom-scroll-content');
			
			let input = this.options || {};
			const options = __cloneDeep(this.$store.state.app.scrollBar.options, input);
			
			if (this.overlay) {
				options.onContentSizeChanged = () => { this.render() };
			}
			
			if (this.$el && window.OverlayScrollbars) {
				this.$el.OverlayScrollbars = OverlayScrollbars(this.$el, options);	
				this.$el.OverlayScrollbars.addExt('scroll-chain', { vertical: false, horizontal: false });
				
				if (this.overlay) {
					this.$el.OverlayScrollbars.options('callbacks.onOverflowChanged', (e) => {
						this.render(e.clipped);
					});
				}
				
				this.render();	
			}
		},
		beforeDestroy () {
			this.$el.OverlayScrollbars = null;
		}
	}
</script>

<style lang="less">
	.custom-scroll {
		transition-property: none;
		
		.custom-scroll-content {
			transition-property: none;			
		}
		
		.custom-scroll-footer {
			padding-bottom: 15rem;
			z-index: 100;
		}		
	}
</style>