<template>
	<div class="profile-component animated fadeIn" v-bind:key="keys.element">
		<div class="position-relative">
			
			<section class="bg-content mb-2">
				<header class="py-4">
					<h6 class="fancy fancy-left px-4">
						<span class="text-muted">{{ headers.overview.value }}</span>
					</h6>
					<p class="text-muted small px-4">{{ headers.overview.hint }}</p>
				</header>
				<div class="profile-component-notifications pb-4">
					<div class="d-flex align-items-center px-4 py-2">
						<div class="p font-weight-book flex-grow-1" v-html="headlines.frequency.value"></div>
						<div class="flex-shrink-1">
							<span class="p text-muted font-weight-book" v-html="formatFrequency(user.notifications_frequency)"></span>
						</div>
					</div>
				</div>
				<div class="profile-component-notifications pb-4">
					<div class="d-flex align-items-center px-4 py-2">
						<div class="p font-weight-book flex-grow-1" v-html="headlines.updated.value"></div>
						<div class="flex-shrink-1">
							<span class="p text-muted font-weight-book" v-html="formatDatetime(user.notifications_updated)"></span>
						</div>
					</div>
				</div>
			</section>
			
			<section class="bg-content mb-2">
				<header class="py-4">
					<h6 class="fancy fancy-left px-4">
						<span class="text-muted">{{ headers.settings.value }}</span>
					</h6>
					<p class="text-muted small px-4">{{ headers.settings.hint }}</p>
				</header>
				<div class="profile-component-notifications pb-4">
					<div class="d-flex align-items-center px-4 py-2" v-for="row in settings" v-if="displayRow(row)">
						<div class="p font-weight-book flex-grow-1" v-html="row.description"></div>
						<div class="flex-shrink-1">
							<span class="text-primary" v-html="icons.status.on.icon.icon" v-if="activeNotification(`${ row.slug }.${ row.mode }`)"></span>
							<span class="text-muted" v-html="icons.status.off.icon.icon" v-else></span>
						</div>
					</div>
				</div>
			</section>
			
			<section class="bg-content mb-2">
				<header class="py-4">
					<h6 class="fancy fancy-left px-4">
						<span class="text-muted">{{ headers.options.value }}</span>
					</h6>
					<p class="text-muted small px-4">{{ headers.options.hint }}</p>
				</header>
				<section class="profile-component-notifications pb-4" v-for="(rows, index) in options">
					<h6 class="text-muted text-capitalize px-4">{{ index }}</h6>
					<div class="d-flex align-items-center px-4 py-2" v-for="row in rows" v-if="displayRow(row)">
						<div class="p font-weight-book flex-grow-1" v-html="row.description"></div>
						<div class="flex-shrink-1">
							<span class="text-primary" v-html="icons.status.on.icon.icon" v-if="activeNotification(`${ row.slug }.${ row.mode }`)"></span>
							<span class="text-muted" v-html="icons.status.off.icon.icon" v-else></span>
						</div>
					</div>
				</section>
			</section>
		</div>
	</div>
</template>

<script>
	import { filter, forEach, get, set } from 'lodash';
	
	import Page from "~/helpers/core/page.js";
	
	import moment from 'moment';
	
	export default {
		name: "ComponentsProfileNotifications",
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
			icons () {
				return this.$store.state.api.icons;
			},
			form () {
				return this.$store.state.api.forms.notifications
			},
			headers () {
				return this.page.labels.header.notifications;
			},
			headlines () {
				return this.page.labels.headline.notifications;
			},
			options () {
				let notifications = {};
				
				forEach(this.notifications, (rows, index) => {
					forEach(rows, (row) => {
						if (index !== "settings" && this.user.privilege >= row.privilege) set(notifications, index, rows);
					});
				});
				
				return notifications;
			},
			notifications () {
				return this.$store.state.api.notifications;
			},
			page () {
				return Page.get(this.$store.state.api.pages, true, 'profile');
			},
			settings () {
				return this.notifications.settings
			}
		},
		methods: {
			activeNotification (input) {
				return get(this.user.notifications, input);
			},
			displayRow (input) {
				return this.user.privilege >= input.privilege;
			},
			formatDatetime (input) {
				let format = get(this.configuration, 'application.format.datetime');
				
				if (input && format) return moment(input).format(format);
				
				return input;
			},
			formatFrequency (input) {
				let $input = filter(this.form.inputs, (row) => {
					return row.slug === "frequency";
				});
				let options = get($input, '0.options');
				let text = input;
				
				forEach(options, (option) => {
					if (option.value === input) text = option.text;
				});
				
				return text;
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.profile.notifications.mounted");
		}
	}
</script>