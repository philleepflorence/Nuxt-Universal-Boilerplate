<template>
	<div id="introduction" class="position-fixed position-full bg-primary animated fadeIn d-flex align-items-center pointer-events-none transform" role="app introduction" v-bind:key="keys.element">
		<div class="introduction-content position-relative text-center text-white flex-grow-1 spacer">
			<div class="p animated fadeInUpSmall a-delay" v-for="element in elements" v-html="element.value"></div>
			<span class="filter-white animated fadeInUpSmall a-delay mt-2 position-relative d-inline-block"><img v-bind:src="logo" class="introduction-logo"></span>
		</div>	
	</div>
</template>

<script>
	import _ from "lodash";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "Introduction",
		props: [
			"delay",
			"elements"
		],
		computed: {
			logo () {
				return this.$store.state.api.config.application['logo-splash'] || this.$store.state.api.config.application.favicon;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		methods: {
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Introduction.render");
				
				if (this.delay) {
					setTimeout(() => {
						this.$el.classList.add('off');
						this.$el.classList.remove('fadeIn');						
					}, this.delay);
				}							
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Introduction.mounted");
									
			this.render();
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#introduction[role="app introduction"] {
		&.off {
			opacity: 0 !important;
			z-index: 0 !important;
			pointer-events: none !important;
		}
		
		.introduction-content {
			.introduction-logo {
				width: 30vw;
				max-width: 300px;
			}
			
			.p {
				h1, h2, h3, h4, h5 {
					font-size: 3rem !important;
					text-transform: none !important;
				}
				p {
					font-size: 1rem !important;
					font-weight: 300 !important;
				}
			}
			
			.a-delay {
				animation-duration: 1000ms !important;
			}
		}
	}
</style>