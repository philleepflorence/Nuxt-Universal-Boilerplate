<template>
	<div class="custom-scroll position-absolute position-full" data-custom-scroll="name">
		<div class="custom-scroll-content position-relative">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "CustomScroll",
		props: ['name', 'options'],
		data () {
			return {
				keys: {
					element: 0
				}
			};
		},
		mounted () {
			let input = this.options || {};
			const options = _.cloneDeep(this.$store.state.app.scrollBar.options, input);
			
			if (this.$el && window.OverlayScrollbars) {
				this.$el.OverlayScrollbars = OverlayScrollbars(this.$el, options);	
				this.$el.OverlayScrollbars.addExt('scroll-chain', { vertical: false, horizontal: false });
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
	}
</style>