<template>
	<div class="page-container" v-bind:key="keys.page">
		<AuthWrapper v-bind:content="content" v-if="content">
			<div class="max-w-540px mx-auto my-4 plain-form form-no-hint form-dark">
				<Form 
					v-bind:button="inputs.submit"
					v-bind:formname="form.slug" 
					v-bind:id="form.slug" 
					v-bind:inputs="inputs.inputs" 
					v-bind:path="endpoint" 
					v-bind:captcha="true"
					v-bind:defaults="content"
					autocomplete="off">	
					<template v-slot:hidden>
						<input type="hidden" class="input" v-bind:value="form.template" name="form.template" v-if="form.template">
						<input type="hidden" class="input" v-bind:value="notification" name="notification" v-if="notification">	
						<input type="hidden" v-bind:value="salt" class="input" name="form.token">
					</template>				
				</Form>				
			</div>
		</AuthWrapper>
		<div class="position-absolute position-full" v-else>
			<Loader v-bind:page="page"></Loader>
		</div>
	</div>
</template>

<script>	
	import _ from 'lodash';	
	import AuthWrapper from "~/components/core/wrappers/Auth.vue";
	import Form from "~/components/core/forms/Form.vue";
	import Loader from "~/components/core/pages/Loader.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PageReset",
		components: {
			AuthWrapper,
			Form,
			Loader
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			endpoint () {
				return this.$store.state.app.endpoints.auth.reset;
			},
			form () {
				return this.$store.state.api.forms.reset;
			},
			inputs () {
				return Page.inputs(this.form.inputs);
			},
			labels () {
				return this.page.labels;
			},
			notification () {
				if (!this.form.notifications) return null;
				
				let notification;
				
				_.forEach(this.form.notifications, (row) => {
					if (row.status === "published") notification = row.slug;
				});	
				
				return notification;
			},
			page () {
				return Page.get(this.pages, true, 'reset');
			},
			pages () {
				return this.$store.state.api.pages;
			},
			path () {
				return this.$route.path;
			},
			salt () {
				return this.$route.params.salt;
			}
		},
		data () {
			return {
				content: null,
				keys: {
					page: Page.utils.rand()
				},
				loading: false
			};
		},
		methods: {
			async load () {
				if (window.DEBUG) console.log("debug - app.pages.auth.reset.load - salt:", this.salt);
			
				this.loading = true;
				
				let user = await this.$store.dispatch('contents/LOAD', {
					url: '/api/auth/user',
					query: {
						form: {
							reset_token: {
								eq: this.salt
							}
						}
					},
					collection: 'users'
				});
				
				this.loading = false;
				
				if (window.DEBUG) console.log("debug - app.pages.auth.reset.loaded - user:", user);
								
				if (!user || !user.id) return window.$nuxt.error({statusCode: 400, message: '--' });
				
				this.content = {
					user: user
				};
								
				this.keys.page = Page.utils.rand();
				
				return this.content;
			}
		},
		mounted () {		
			if (window.DEBUG) console.log("debug - app.pages.auth.reset.mounted");
			
			if (!this.content) this.load();
		}
	}
</script>