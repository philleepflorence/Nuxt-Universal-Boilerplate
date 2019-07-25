<template>
	<div class="page-loader position-absolute position-full pointer-events-none d-flex align-items-center max-z animated fast">
		<div class="flex-item w-100 text-center">
			<b-spinner type="grow"></b-spinner>
		</div>
		<footer class="position-absolute position-bottom w-100 text-primary font-accent text-center animated fadeInUp" v-if="page">
			<span>{{ page }}</span>
		</footer>		
	</div>
</template>

<script>
import Page from "~/helpers/core/page.js";

export default {
	name: "Loader",
	props: ['page'],
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
		footer {
			font-size: 8vh;
			span {
				opacity: 0.15;
			}
		}
	}
</style>