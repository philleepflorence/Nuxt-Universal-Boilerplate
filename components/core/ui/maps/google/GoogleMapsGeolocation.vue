<template>
	<div v-if="labels">
		<aside class="google-maps-controls z-index-3 pointer-events-none" v-if="options.google">
			<div class="position-absolute position-full animated fadeIn bg-black-20" v-show="options.address">
				<div class="google-maps-control d-flex align-items-center h-100">
					<div class="flex-item form form-slim mx-auto max-w-480px w-90 animated fadeInUp">
						<header class="text-center text-white p-4">
							<div class="p" v-html="labels.information.value"></div>
						</header>
						<div class="form-group pointer-events-auto">
							<b-form-input 
								v-model="form.address" 
								v-bind:placeholder="labels.address.value" 
								class="form-control" 
								v-b-tooltip.focus v-bind:title="labels.address.hint">
							</b-form-input>
						</div>
						<div class="form-group pointer-events-auto mb-0" v-show="options.geolocation">
							<b-form-checkbox 
								v-model="form.geolocation" 
								switch>{{ labels.geolocation.value }}
							</b-form-checkbox>
						</div>
						<hr class="w-50 border-white opacity-50 my-4">
						<div class="form-group pointer-events-auto">
							<b-form-checkbox 
								v-model="form.cookie" 
								switch>{{ labels.cookie.value }}
							</b-form-checkbox>
						</div>
						<div class="form-group form-footer text-center pointer-events-auto">
							<b-button type="button" variant="primary" class="w-100 text-uppercase font-weight-book form-button font-accent" v-on:click="onSubmit">{{ labels.submit.value }}</b-button>
						</div>
					</div>
				</div>
			</div>
		</aside>
	</div>
</template>

<script>
	export default {
		name: "GoogleMapsGeolocation",
		computed: {
			labels () {
				return this.$store.state.api.labels.form.maps;
			},
			geolocation () {
				return this.$store.state.app.options.geolocation;
			}
		},
		data () {
			return {
				form: {}
			};
		},
		methods: {
			cookies (coords) {
				if (this.$cookie && this.form.cookie) {
					this.$cookie.set('options.geolocation', {
						latitude: coords.latitude,
						longitude: coords.longitude,
						address: coords.address
					}, {
						maxAge: 60 * 60 * 24 * 7
					});
				}
			},
			onSubmit (e) {
				if (this.form.geolocation && this.geolocation) {
					this.$emit('maps-google-render', this.geolocation.coords);					
					this.cookies(this.geolocation.coords);
				}
				else if (this.form.address) {
					this.$emit('maps-google-geocode', {
						address: this.form.address,
						done: (coords) => {
							this.$emit('maps-google-render', coords);
							this.cookies(coords);
						}
					});
				}
			}
		},
		props: ['options']
	}
</script>

<style lang="less">
	.google-maps-controls {
		.google-maps-control {
			.form-control,
			.custom-switch {
				border: none !important;
				background: fade(white, 80) !important;
				font-size: 0.875rem !important;
				font-weight: 500;
			}
			.form-control {
				height: 40px !important;
			}
			.form-button {
				font-size: 0.875rem !important;
			}
			.custom-switch {
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
				padding-left: 2.75rem;
			}
		}
	}
</style>