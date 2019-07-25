<template>
	<div v-if="marker">
		<aside class="google-maps-info-container z-index-2 pointer-events-none">
			<div class="position-absolute position-full">
				<div class="google-maps-info-content d-flex align-items-end h-100">
					<div class="google-maps-infobox flex-item mx-auto max-w-480px w-100">
						<div class="bg-black-80 position-relative spacer text-white p box-shadow animated fadeInUpSmall pointer-events-auto">
							<ImageLoader 
								classname="position-absolute position-full bg-cover-dark bg-cover-center" 
								format="background" 
								size="cdn" 
								v-bind:src="marker.media" 
								v-bind:key="keys.image" 
								v-if="marker.media">
							</ImageLoader>
							<section class="position-relative z-index-1 cursor-hand">
								<h2 class="text-primary">{{ marker.name }}</h2>
								<h6 class="mb-3">{{ marker.neighborhood }}</h6>
								<p class="font-weight-book">{{ marker.address }}</p>
								<div class="d-flex flex-wrap font-weight-bold text-uppercase small">
									<p class="flex-fill min-w-25 bg-white-10 py-1 px-2 mb-1 fs-12px" v-b-tooltip.hover v-bind:title="tag.description" v-for="tag in marker.type">{{ tag.name }}</p>
								</div>
							</section>
						</div>						
					</div>
				</div>
			</div>
		</aside>
	</div>
</template>

<script>
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";
	
	export default {
		name: "GoogleMapsInfoBox",
		props: ['marker'],
		components: {
			ImageLoader
		},
		data () {
			return {
				keys: {
					image: Page.utils.rand()
				}
			};
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.maps.google.GoogleMapsInfoBox.mounted");
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.maps.google.GoogleMapsInfoBox.updated");
			
			this.keys.image = Page.utils.rand();
		}
	}
</script>