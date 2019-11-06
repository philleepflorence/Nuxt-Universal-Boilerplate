<template>
	<div class="page-navigation d-flex">
		<nav class="page-navigation-item position-relative flex-fill text-center py-2 cursor-hand" 
			v-bind:data-selector="row.url"
			v-on:click.stop.prevent="navigate"
			v-for="row in labels">
			<span v-html="row.icon.icon"></span>
			<span class="page-navigation-span fs-10px d-block font-weight-bold" v-html="row.plaintext"></span>
			<RippleClick></RippleClick>
		</nav>	
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import RippleClick from "~/components/core/ui/RippleClick.vue";
	
	export default {
		name: "PageNavigation",
		props: [
			'labels',
			'mode'
		],
		components: {
			RippleClick
		},
		methods: {
			navigate (e) {
				let selector = e.currentTarget.getAttribute('data-selector');
				
				if (!selector) return false;
				
				let element = document.querySelector(selector);
				
				if (element && this.mode === "scroll") Page.scrollTo(element, null, window.scrollY);	
			}
		}
	}
</script>

<style lang="less">	
	@import '../../../assets/styles/mixins/mixins.less';
	
	.page-navigation {
		.page-navigation-item {
			&, &:hover, &:active, &:focus, &:visited {
				color: fade(black, 40) !important;
			}
			
			& + .page-navigation-item {
				border-left: 1px solid @mainbordercolor;
			}
		}
	}
	
	@media (min-width: @breakpoint-md-min)
    {
		.page-navigation {
			.page-navigation-item {
				.page-navigation-span {
					font-size: 0.75rem !important;
				}
			}
		}
    }
</style>