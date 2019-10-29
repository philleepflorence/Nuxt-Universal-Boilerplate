<template>
	<div class="page-loader position-absolute position-full pointer-events-none d-flex align-items-center max-z animated fast">
		<div class="flex-item w-100 text-center">
			<b-spinner type="grow"></b-spinner>
		</div>		
	</div>
</template>

<script>
import Page from "~/helpers/core/page.js";

export default {
	name: "Loader",
	props: [
		'page',
		'mode'
	],
	data () {
		return {
			
		};
	},
	mounted () {
		console.log("debug - development");
		
		this.$el.classList.add('mounted');	
	},
	beforeDestroy () {
		this.$el.classList.add('fadeOut');	
	}
}
</script>

<style lang="less" scoped>
	.page-loader {
		footer {
			font-size: 2.25rem;
			
			span {
				opacity: 0.5;
			}
		}
	}
</style>