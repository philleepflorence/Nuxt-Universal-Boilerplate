<template>
	<div id="notifications" 
		class="position-relative pointer-events-none" 
		role="app notifications" 
		v-bind:key="keys.element">
		<div class="position-fixed position-full bg-dark animated fadeIn d-flex align-items-center pointer-events-auto" v-if="display">
			
			<div class="notifications-content position-relative text-center text-white flex-grow-1 p-4">
				<header class="d-flex align-items-center justify-content-center w-60px h-60px bg-primary rounded-circle mx-auto mb-4">
					<span class="text-white" v-html="content.icon.icon"></span>
				</header>
				<div class="p max-w-640px mx-auto spacer" v-html="content.value"></div>				
			</div>	
			
		</div>
	</div>
</template>

<script>
	import Alert from "~/helpers/core/alert.js";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "NotificationsComponent",
		computed: {
			button () {
				return this.$store.state.api.icons.form.submit;
			},
			content () {
				return this.$store.state.api.labels.content.disclaimer['notifications'];
			}
		},
		data () {
			return {
				display: false,
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		methods: {
			init () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Notifications.init");
				
				
				this.location = window.localStorage.getItem('app:location:granted');
				this.notifications = window.localStorage.getItem('app:notifications:granted');
				
				this.display = typeof this.content === "object" && ( !this.location || !this.notifications ) && ( process.env.PERMISSIONS_LOCATION === "true" || process.env.PERMISSIONS_NOTIFICATIONS === "true" );
			},
			geoError () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Notifications.geoError");
				
				Alert.show(this.content.hint);
				
				this.renderNotifications();
			},
			geoSuccess (position) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Notifications.geoSuccess", position);
				
				window.localStorage.setItem('app:location:granted', Date.now());
				
				this.renderNotifications();
			},
			renderNotifications () {	
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Notifications.renderNotifications");
				
				this.init();
				
				if (!this.location && process.env.PERMISSIONS_LOCATION === "true") {
					navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
				}
				else if (!this.notifications && process.env.PERMISSIONS_NOTIFICATIONS === "true") {
					Notification.requestPermission().then((permission) => {
						if (permission === "granted") window.localStorage.setItem('app:notifications:granted', Date.now());
												
						this.renderNotifications();
					});
				}				
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Notifications.mounted");
			
			this.init();
			
			if (this.display) this.renderNotifications();
			else if (this.location) navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
		}
	}
</script>