<template>
	<div v-bind:key="keys.page">
		<UserProfile v-bind:user="content.user" v-if="content.user" v-bind:key="keys.profile"></UserProfile>
		<Loader v-bind:page="page.name" v-else></Loader>
	</div>
</template>

<script>
	import _ from 'lodash';	
	import Loader from "~/components/core/pages/Loader.vue";	
	import UserProfile from "~/components/core/pages/UserProfile.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "Profile",
		components: {
			UserProfile
		},
		computed: {
			username () {
				return _.get(this.$route.params, 'username');
			}
		},
		methods: {
			async load () {
				this.loading = true;
				
				let content = await this.$store.dispatch('contents/LOAD', {
					url: '/api/contents/profile',
					collection: 'users',
					query: {
						username: this.username
					},
					cache: false
				});
				
				if (!_.get(content, 'user')) return this.$nuxt.error({statusCode: 500, message: this.labels.app.content.error[404].value });
				
				this.content = content;
				
				this.loading = false;
			},
			page () {
				return Page.get(this.pages, this.$route.path);
			},
			pages () {
				return this.$store.state.api.pages;
			}
		},
		async asyncData ({ params, error, req, store, route, from }) {
			if (req && req.contents) {
				return {
					content: req.contents
				};
			}			
		},
		data () {
			return {
				keys: {
					page: Page.utils.rand(),
					profile: Page.utils.rand()
				}
			};
		},
		mounted () {		
			if (window.DEBUG) console.log("debug - app.pages.user.profile.username.mounted");
			
			if (!this.content && !this.loading) this.load();
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.pages.user.profile.username.updated");
			
			if (!this.content && !this.loading) this.load();
		}
	}
</script>