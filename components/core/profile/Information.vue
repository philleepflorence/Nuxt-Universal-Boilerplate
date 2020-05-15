<template>
	<div class="profile-component animated fadeIn" v-bind:key="keys.element">
		<div class="p mb-2 bg-content row no-gutters py-4">
			<div v-for="(row, index) in rows"
				v-bind:class="getClass(row)"
				v-bind:key="`${ index }-${ row.slug }-container`">
					
				<div class="d-flex align-items-center min-h-100">
					<div class="flex-item flex-grow-1 p-4 position-relative">
						<div class="profile-content-contents p" v-bind:data-placeholder="row.hint" v-html="row.content"></div>
						<div class="d-flex align-items-center">
							<div class="profile-content-label flex-shrink-1 font-weight-book font-accent text-capitalize small text-muted ls-1px pr-2 pt-1" v-html="row.value"></div>
							<p class="fancy fancy-right flex-grow-1">
								<span class="text-muted" v-if="row.icon" v-html="row.icon.icon"></span>
							</p>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	import { cloneDeep, forEach, get } from 'lodash';
	
	import Page from "~/helpers/core/page.js";
	
	import moment from 'moment';
	
	export default {
		name: "ComponentsProfileInformation",
		props: [
			'labels',
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
			privilege () {
				let username = get(this.$store.state.user, 'username');
				
				if (this.user.username === username) return 2;
				
				if (username) return 1;
				
				return 0;
			},
			rows () {
				if (!this.user) return null;
				
				let rows = cloneDeep(this.labels.headline.label);
				let formats = get(this.configuration, 'application.format');
				
				forEach(rows, (row) => {
					let property = row.property || row.slug;
					let content = get(this.user, property);
					let format = Page.utils.datetime(content);
						content = format && formats[format] ? moment(content).format(formats[format]) : content;
											
					if (this.privilege >= row.privilege.privilege) row.content = content;
				});
				
				return rows;
			}
		},
		methods: {
			getClass (input) {
				return Page.classname(input.params, ["profile-group", "mb-2"]);
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.profile.information.mounted");
		}
	}
</script>