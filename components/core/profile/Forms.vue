<template>
	<div class="profile-component animated fadeIn" v-bind:key="keys.element">
		<div class="position-relative" v-if="content">
			<section class="bg-content mb-2" v-for="(rows, date) in user.forms">
				<h6 class="fancy fancy-left p-4">
					<span class="text-muted">{{ formatDatetime(date) }}</span>
				</h6>
				<div class="profile-component-list-groups">
					<div class="profile-list-item px-4 pb-4" 
						v-for="(row, index) in rows">
						<strong class="text-muted">{{ row.key }}</strong>
						<div class="p placeholder" data-placeholder="--" v-html="row.value"></div>
					</div>
				</div>
			</section>
		</div>
		<section class="bg-content mb-2 py-6" v-else-if="!content">
				<header class="d-flex align-items-center justify-content-center bg-primary w-60px h-60px rounded-circle mx-auto mb-4">
					<span class="text-white" v-html="empty.icon.icon"></span>
				</header>
				<div class="p lead text-center" v-html="empty.value"></div>
			</section>
		</section>
	</div>
</template>

<script>
	import { cloneDeep, forEach, get } from 'lodash';
	
	import Page from "~/helpers/core/page.js";
	
	import moment from 'moment';
	
	export default {
		name: "ComponentsProfileForms",
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
			content () {
				return this.user.forms;
			},
			empty () {
				return this.$store.state.api.labels.content.items.empty;
			},
			page () {
				return Page.get(this.pages, true, 'profile');
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
			if (window.DEBUG) console.log("debug - app.components.core.profile.forms.mounted");
		}
	}
</script>

<style lang="less">	
	
	@import '../../../assets/styles/mixins/mixins.less';
	
	.profile-component-list-groups {		
		.profile-list-item {
			position: relative;
			
			img {
				border-top: 2px solid @colorprimary;
				border-bottom: 2px solid @colorprimary;
				margin: 0.5rem -1.5rem;
				max-width: ~"calc(100% + 3rem)";
			}
		}
	}
</style>