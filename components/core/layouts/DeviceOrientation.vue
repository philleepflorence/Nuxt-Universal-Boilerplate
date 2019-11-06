<template>
	<div id="device-orientation" class="position-fixed" role="app device-orientation" v-bind:key="keys.element">
		<div class="position-fixed position-full bg-primary animated fadeIn d-flex align-items-center" v-if="landscape">
			<div class="device-orientation-content position-relative text-center text-white flex-grow-1">
				<div class="p animated fadeInUpSmall a-delay max-w-768px mx-auto spacer" v-html="icon.icon.icon"></div>
			</div>	
		</div>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "DeviceOrientation",
		computed: {
			icon () {
				return this.$store.state.api.icons.orientation;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				landscape: false
			};
		},
		methods: {
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.DeviceOrientation.render");
			
				let touchscreen = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
				
				this.landscape = touchscreen && window.innerHeight < 500 && window.innerWidth / window.innerHeight > 1.5;
				console.log("debug - app.components.core.layouts.DeviceOrientation.render", this.landscape);
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.DeviceOrientation.mounted");
			
			this.render();
			
			window.addEventListener("deviceorientation", this.render, true);
			window.addEventListener('resize', this.render);
		},
		beforeDestroy () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.DeviceOrientation.beforeDestroy");
			
			window.removeEventListener("deviceorientation", this.render);
			window.removeEventListener('resize', this.render);
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#device-orientation[role="app device-orientation"] {
		.device-orientation-content {
			.mdi {
				font-size: 45vh;
				line-height: 40vh;
			}
		}
	}
</style>