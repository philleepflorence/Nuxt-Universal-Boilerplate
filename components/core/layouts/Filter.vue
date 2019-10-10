<template>
	<div id="filter" class="pointer-events-none position-fixed position-bottom" role="app disclaimer" v-bind:key="keys.element"></div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "FilterOverlay",
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			}
		},
		methods: {
			
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Filter.mounted");			
		}
	}
</script>