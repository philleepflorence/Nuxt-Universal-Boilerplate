<template>
	<div id="wrapper" class="animated off bg-dark">
		<Navigation></Navigation>
		<div id="content" class="vh-100 position-relative bg-dark" role="app content">
			<nuxt />
		</div>
	</div>
</template>

<script>
	import Navigation from "~/components/core/layouts/Navigation.vue";
	
	export default {
		components: {
			Navigation
		},
		data() {
			return {
				
			};
		},
		methods: {
			render () {
				this.$el.classList.remove('off');
				this.$el.classList.add('fadeIn');
			}
		},
		beforeMount () {
			console.log("debug - app.layouts.default.beforeMount - ENVIRONMENT", process.env.SERVER_ENVIRONMENT);
			
			if (process.env.SERVER_ENVIRONMENT === 'development') window.DEBUG = true;
		},
		mounted () {			
			window.addEventListener('load', () => {
				this.render();
				
				window.LOADED = true;
			});
			
			if (window.LOADED) this.render();
			
			if (window.DEBUG) console.log("debug - app.layouts.default.mounted");
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.layouts.default.updated");
			
			this.render();
		}
	}	
</script>

<style lang="less">
	html {
		body {
			#wrapper {
				&.off {
					opacity: 0;
					pointer-events: none;
				}
				
				.spinner-grow {
					border-radius: 50% !important;
				}
				
				#content[role="app content"] {
					z-index: 2;
				}
				
				#navigation[role="app navigation"] {
					z-index: 10;
				}
			}
		}
	}	
</style>