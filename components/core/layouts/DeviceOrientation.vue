<template>
	<div id="device-orientation" class="position-fixed" role="app device-orientation" v-bind:key="keys.element">
		<div class="position-fixed position-full bg-dark animated fadeIn d-flex align-items-center" v-if="landscape">
			<div class="device-orientation-content position-relative text-center text-white flex-grow-1">
				<div class="p animated fadeInUpSmall a-delay max-w-768px mx-auto spacer" v-html="label.icon.icon"></div>
			</div>	
		</div>
		<footer class="p position-fixed position-bottom w-100 p-3 text-muted text-center font-weight-book animated fadeInUpSmall a-delay" v-html="label.value" v-if="landscape"></footer>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "DeviceOrientationComponent",
		computed: {
			label () {
				return this.$store.state.api.labels.content.disclaimer.orientation;
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
				font-size: 20vh;
				line-height: 15vh;
			}
		}
	}
</style>