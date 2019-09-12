<template>
	<div class="google-maps-container position-absolute position-full" data-map-container v-if="page">
		
		<div v-bind:id="options.id" class="w-100 h-100 z-index-1" v-bind:key="keys.map"></div>
		
		<div class="position-absolute position-full google-maps-contents z-index-1 pointer-events-none">
			<slot></slot>
		</div>
		
		<GoogleMapsInfoBox v-bind:marker="map.marker" v-if="options.infobox" v-bind:key="keys.infobox"></GoogleMapsInfoBox>	
		
		<GoogleMapsGeolocation v-bind:options="controls" v-if="options.geolocation" v-on:maps-google-render="onRender" v-on:maps-google-geocode="onGeocode" v-bind:key="keys.geolocation"></GoogleMapsGeolocation>	
				
	</div>
</template>

<script>
	import _ from 'lodash';	
	import Alert from '~/helpers/core/alert.js';
	import Page from "~/helpers/core/page.js";
	
	import googleMapsLoader from 'load-google-maps-api';
	
	import GoogleMapsInfoBox from "~/components/core/ui/maps/google/GoogleMapsInfoBox.vue";
	import GoogleMapsGeolocation from "~/components/core/ui/maps/google/GoogleMapsGeolocation.vue";
	
	export default {
		name: "GoogleMaps",
		components: {
			GoogleMapsInfoBox, GoogleMapsGeolocation
		},
		props: [
			'options', 
			'page', 
			'location'
		],
		computed: {
			cdn () {
				return this.$store.state.api.config.application.cdn.url;
			},
			configuration () {
				return this.$store.state.api.config.maps.google;
			},
			geolocation () {
				return this.$store.state.app.options.geolocation;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			labels () {
				return this.$store.state.api.labels.app.form.maps;
			},
			path () {
				return this.$route.path;
			}
		},
		data () {
			return {
				controls: {
					address: false,
					geolocation: false,
					infobox: false
				},
				keys: {
					geolocation: Page.utils.rand(),
					infobox: Page.utils.rand(),
					map: Page.utils.rand()
				},
				map: {
					address: this.$props.options.address,
					id: this.$props.options.id,
					markers: {
						markers: [],
						loaded: 0,
						length: 0
					}
				},
				form: {}
			};
		},
		methods: {
			bounds (map, setBounds) {
				let bounds = new google.maps.LatLngBounds();

				setBounds.forEach((pos) => {
					var latlng = new google.maps.LatLng(pos.latitude, pos.longitude);

					bounds.extend(latlng);
				});

				map.fitBounds(bounds);
			},
			clear () {
				if (this.map.markers.markers) {
					_.forEach(this.map.markers.markers, (marker) => {
						marker.setMap(null);
					});
					this.map.markers.loaded = 0;
					this.map.markers.length = 0;
					delete this.map.markers.markers;
				}
				if (this.map.map) delete this.map.map;
			},
			clusters (map, bounds) {
				Page.require([
					`${ this.cdn }/vendors/markerclustererplus/dist/markerclusterer.min.js`
				], this.$store, () => {
					map.markerCluster = new MarkerClusterer(map, this.map.markers.markers, {
			        	averageCenter: true,
			        	mapID: this.map.id
			        });
			        
			        map.markerCluster.mapID = this.map.id;
			        
			        const maxZoom = this.configuration.maxzoom;
			        let currZoom = map.getZoom();
			        let nextZoom = maxZoom > currZoom ? currZoom++ : maxZoom;
			        
			        map.markerCluster.setMaxZoom(nextZoom);
			        
			        if (this.configuration.fitbounds) map.fitBounds(bounds);
			        		        
			        google.maps.event.addListener(map.markerCluster, 'click', (e) => {
				        let m = e.getMarkers();
				        let c = e.getCenter();
				        
				        currZoom = e.map_.getZoom();
				        
				        if (currZoom < maxZoom) {
					        currZoom++; 
					        map.markerCluster.setMaxZoom(currZoom);
					        map.panTo(c);
				        }
				        else if (zoom >= maxZoom && m.length) {
					        google.maps.event.trigger(m[0], 'click');
				        }
			        });
				});
			},
			draw (coords) {
				if (!_.get(coords, 'latitude')) return false;

	            let homeMarker;
	
	            let params = {
					"latitude": coords.latitude,
					"longitude": coords.longitude,
					"zoom": Number( this.$props.options.zoom || this.configuration.zoom || 16 ),
					"zoomControl": this.$props.options.control,
					"homeMarker": _.get(this.$props.options, 'marker.image') || this.configuration.marker.home
				};
	
	            let saturate = this.configuration.styles.lightgray;
	
				let mapObject = {};
				let mapCenter = new google.maps.LatLng(params.latitude, params.longitude);
				let mapOptions = {
					center: mapCenter,
					zoom: params.zoom,
					disableDefaultUI: true,
					zoomControl: params.zoomControl,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL,
						position: google.maps.ControlPosition.RIGHT_BOTTOM
					},
					mapTypeControlOptions: {
						mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'color_map']
					}
				};
	
				let map = new google.maps.Map(this.map.element, mapOptions);
	
	            if (saturate) this.saturate(map, saturate, this.$props.options.saturate);
	
				let overlay = new google.maps.OverlayView();
					overlay.draw = function () {};
					overlay.setMap(map);
	
				mapObject.map = map;
				mapObject.overlay = overlay;
	
				if (params.homeMarker && this.options.marker) {
					homeMarker = this.marker(map, mapCenter, params.homeMarker, this.map.title);
					homeMarker.setMap(map);
				}
	
				google.maps.event.addListener(map, 'tilesloaded', () => 
				{
					this.rendered(map);
				});
			},
			geocode (address, done) {
				
				let geocoder = new google.maps.Geocoder();
				let coords = {};

	    		geocoder.geocode(
	    		{
	    			'address': address
	    		},
	            function (results, status)
	    		{
	                if (status === google.maps.GeocoderStatus.OK && results.length)
	    			{
    					coords = _.get(results, '0.geometry.location.lat') ? {
		    				address: _.get(results, '0.formatted_address'),
		    				latitude: _.get(results, '0.geometry.location.lat')(),
		    				longitude: _.get(results, '0.geometry.location.lng')()
	    				} : {};
	    				
	    				done(coords);    				
	    			}
	    			else
	    			{
	    				Alert.show(labels['geocode-error'].value, 'error');
	    			}
	    		});
			},
			infobox (marker, e) {
				if (this.configuration.pan) map.panTo(marker.getPosition());
				
				let data = _.find(this.$props.options.markers, (currMarker) => {
					return marker.id === currMarker.id;
				});
				
				if (data) {
					this.map.marker = data;
					this.keys.infobox++;
				}
				
				this.map.markers.markers.forEach((currMarker) => {
					if (currMarker.id === marker.id) currMarker.active = true;
					else if (currMarker.active) currMarker.active = false;
				});
			},
			marker (map, position, image, title) {
				if (!image) return false;
				
				const params = {
					width: _.get(this.$props.options, 'marker.width'),
					height: _.get(this.$props.options, 'marker.height')
				};
	
				const width = Number(params.width || this.configuration.marker.width);
	            const height = Number(params.height || this.configuration.marker.height);
	
	            const icon = {
	    			url: image,
	    			size: new google.maps.Size(width, height),
	    			origin: new google.maps.Point(0, 0),
	    			anchor: new google.maps.Point((width * 0.5), (height * 0.5))
	    		};
	
	    		var marker = new google.maps.Marker({
	    			map: map,
	    			position: position,
	    			title: title,
	    			icon: icon
	    		});
				
	    		return marker;
			},
			markers (map, image, longitude, latitude, title, element, bounds) {				
				longitude = Number(longitude);
				latitude = Number(latitude);
				
				let latLng = new google.maps.LatLng(latitude, longitude);
				
				bounds.extend(latLng);
				
				let marker = this.marker(map, latLng, image, title);
				
				marker.longitude = longitude;
				marker.latitude = latitude;
				marker.path = element.path;
				marker.id = element.id;
								
				let overlap = this.map.markers.markers.filter((currMarker) => {
					if (currMarker.position) return latitude === currMarker.position.lat() && longitude === currMarker.position.lng();
				});
				
				if (overlap.length) marker.setVisible(false);
								
				if (!this.map.markers.markers.includes(marker)) this.map.markers.markers.push(marker);
								
				this.map.markers.loaded++;
				
				if (this.map.markers.loaded === this.map.markers.length && this.map.markers.markers.length) this.clusters(map, bounds);

				google.maps.event.addListener(marker, 'click', () => {
		        	this.infobox(marker);
				});				
			},
			render (geolocation, rerender) {
				if (!window.google) return false;
				
				let address = geolocation || this.map.location || this.map.address || this.$cookie.get('options.geolocation') || _.get(this.geolocation, 'coords');
				
				if (window.DEBUG) console.log("debug - app.components.core.ui.maps.GoogleMaps.render", address);
				
				if (!address && this.options.geolocation) {
					this.controls.address = true;
					this.keys.geolocation = Page.utils.rand();
					return;
				}
				
				if ((this.map.address == address && !rerender) || !address) return;
				
				this.map.address = address;
				this.controls.address = false;
				this.keys.geolocation = Page.utils.rand();
				
				if (typeof address === 'string') {
					this.geocode(geolocation, (coords) => {
						this.draw(coords);
					});
				}	
				else if (address) {
					this.draw(address);
				}
			},
			rendered (map) {				
				this.map.map = map;
				this.map.element.rectangle = this.map.element.getBoundingClientRect();
				this.map.markers.markers = this.map.markers.markers || [];
				
				if (this.$props.options.markers && this.map.markers.markers.length === 0) {
					this.map.markers.length = this.$props.options.markers.length;
					
					this.map.rendered = true;
					
					let bounds = new google.maps.LatLngBounds();
					
					_.forEach(this.$props.options.markers, (child) =>
					{
						var title = child.title || child.name;
		
						if (child.latitude && child.longitude) {
							this.markers(map, child.marker, child.longitude, child.latitude, title, child, bounds);
						}
						else if (typeof address === 'address') {
							app.maps.google.geocode(address, (coords) => {
								if (coords && coords.longitude) this.markers(map, child.marker, index, coords.longitude, coords.latitude, title, child, bounds);
							});
						}
					});
				}
			},
			saturate (map, saturate, style) {
				if (typeof style === 'string') {
					saturate = _.get(this.configuration.styles, style);
				}
				
				if (!Array.isArray(saturate)) return false;
				
				const coloredMapType = new google.maps.StyledMapType(saturate, {
	    			name: "map"
	    		});
	
	    		map.mapTypes.set('color_map', coloredMapType);
	    		map.setMapTypeId('color_map');
	
	    		return coloredMapType;
			},
			onRedraw (coords) {				
				this.clear();
				
				this.keys.map = Page.utils.rand();
				
				this.draw(this.map.address, true);
			},
			onRender (coords) {				
				this.render(coords);
			},
			onGeocode (params) {				
				this.geocode(params.address, (coords) => {
					params.done(coords);
				});
			}			
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.maps.GoogleMaps.mounted");
			
			if (this.location && this.location.latitude && this.location.longitude) {
				this.map.location = {
					latitude: this.location.latitude,
					longitude: this.location.longitude
				};
			}
			else if (this.location && this.location.address) {
				this.map.location = this.location.address;
			}		
			else if (navigator.geolocation && this.configuration.key) {
				navigator.geolocation.getCurrentPosition((position) => {					
					if (position && position.coords) {
						this.$store.commit('app/SET', {
							key: 'options.geolocation',
							data: position
						});
						this.options.geolocation = position;						
						this.render(position.coords);						
					}
				});
			}
						
			this.map.title = this.$props.options.title || this.$props.location.name;			
			this.map.element = document.getElementById(this.map.id);
			
			if (_.get(window, 'google.maps')) {
				this.render();
			}	
			else {		
				googleMapsLoader({
					key: this.configuration.key,
					libraries: ['places']
				}).then((response) => {					
					this.render();
					this.controls.google = true;
				}).catch((error) => {
					Alert.show(error, 'error');
				});				
			}
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.maps.GoogleMaps.updated");
		},
		beforeDestory () {			
			this.clear();
		}
	}
</script>
	
<style lang="less">
	.google-maps-container {
		.opacity-hover {
			&:hover, &:active {
				.mdi {
					display: inline-block;
					animation: fadeInLeft 600ms ease;
				}
			}
		}
	}
</style>