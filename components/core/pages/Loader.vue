<template>
	<div class="page-loader position-absolute position-full pointer-events-auto d-flex align-items-center max-z animated fast">
		<div class="flex-item w-100 text-center">
			<b-spinner type="border" v-bind:variant="mode"></b-spinner>
			<div class="p lead text-primary text-shadow mt-2" v-html="message" v-if="message"></div>
		</div>		
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "Loader",
		props: [
			'page',
			'message'
		],
		computed: {
			mode () {
				if (this.page) return this.page.mode;
				
				return 'primary';
			}
		},
		data () {
			return {
				
			};
		},
		mounted () {
			this.$el.classList.add('mounted');	
		},
		beforeDestroy () {
			this.$el.classList.add('fadeOut');	
		}
	}
</script>

<style lang="less" scoped>
	.page-loader {
		.spinner-border {
			animation-duration: 1s !important;
			border-radius: 50% !important;
			position: relative;
			
			&:before {
				content: '';
				border-right: 0.25rem solid fade(#808080, 60);
				border-radius: 50% !important;
				position: absolute;
				width: 2rem;
				height: 2rem;
				top: -0.25rem;
				left: -0.25rem;
			}
		}
	}
</style>