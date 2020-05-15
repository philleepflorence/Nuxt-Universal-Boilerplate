<template>
	<div class="profile-component animated fadeIn" v-bind:key="keys.element">
		<div class="position-relative">
			<section class="bg-content mb-2">
				<header class="py-4">
					<h6 class="fancy fancy-left px-4">
						<span class="text-muted">{{ headers.privilege.value }}</span>
					</h6>
					<p class="text-muted small px-4">{{ headers.privilege.hint }}</p>
				</header>
				<div class="profile-component-permissions pb-4">
					<div class="d-flex align-items-center px-4 py-2">
						<div class="p font-weight-book flex-grow-1">
							<strong>{{ user.permission.name }}</strong>
							<p class="p">{{ user.permission.description }}</p>
						</div>
						<div class="p flex-shrink-1">
							<span class="lead text-primary font-accent font-weight-book">{{ user.permission.privilege }}</span>
						</div>
					</div>
				</div>
			</section>
			<section class="bg-content mb-2">
				<header class="py-4">
					<h6 class="fancy fancy-left px-4">
						<span class="text-muted">{{ headers.permissions.value }}</span>
					</h6>
					<p class="text-muted small px-4">{{ headers.permissions.hint }}</p>
				</header>
				<div class="profile-component-permissions pb-4">
					<div class="d-flex align-items-center px-4 py-2" v-for="permission in user.permissions">
						<div class="p font-weight-book flex-grow-1">
							<strong>{{ permission.name }}</strong>
							<p class="p">{{ permission.description }}</p>
						</div>
						<div class="p flex-shrink-1">
							<span class="lead text-primary font-accent font-weight-book">{{ permission.privilege }}</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	import { cloneDeep, forEach, get } from 'lodash';
	
	import Page from "~/helpers/core/page.js";
	
	import moment from 'moment';
	
	export default {
		name: "ComponentsProfilePermissions",
		props: [
			'user'
		],
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
			},
			headers () {
				return this.page.labels.header.permissions;
			},
			page () {
				return Page.get(this.$store.state.api.pages, true, 'profile');
			}
		},
		methods: {
			formatDatetime (input) {
				let format = get(this.configuration, 'application.format.datetime');
				
				if (input && format) return moment(input).format(format);
				
				return input;
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.profile.permissions.mounted");
		}
	}
</script>