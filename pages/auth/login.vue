<template>
	<div class="page-container" v-bind:key="keys.page">
		<AuthWrapper>
			<div class="max-w-280px mx-auto my-4 plain-form form-no-hint form-no-label">
				<Form 
					v-bind:button="inputs.submit"
					v-bind:formname="form.slug" 
					v-bind:id="form.slug" 
					v-bind:inputs="inputs.inputs" 
					v-bind:path="endpoint">
					<template v-slot:hidden>
						<input type="hidden" class="input" v-bind:value="form.template" name="form.template" v-if="form.template">
						<input type="hidden" class="input" v-bind:value="notification" name="notification" v-if="notification">	
						<input type="hidden" class="input" v-bind:value="redirect" name="redirect" v-if="redirect">						
					</template>
				</Form>
			</div>
		</AuthWrapper>
	</div>
</template>

<script>
	import _ from "lodash";	
	import AuthWrapper from "~/components/core/wrappers/Auth.vue";
	import Form from "~/components/core/forms/Form.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PageLogin",
		components: {
			AuthWrapper,
			Form
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			endpoint () {
				return this.$store.state.app.endpoints.auth.login;
			},
			form () {
				return this.$store.state.api.forms.login;
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
				return Page.get(this.pages, true, 'login');
			},
			pages () {
				return this.$store.state.api.pages;
			},
			path () {
				return this.$route.path;
			}
		},
		data () {
			return {
				keys: {
					page: Page.utils.rand()
				}
			};
		},
		async asyncData ({ params, error, req, store, route, from }) {
			if (req && req.session) {
				return {
					redirect: req.session.redirect
				};
			}
		},
		created () {
			if (!this.redirect) this.redirect = this.$store.state.app.redirect;
			else this.redirect = _.get(this.$store.state, 'api.redirects.route.authenticated.url');
		},
		mounted () {		
			if (window.DEBUG) console.log("debug - app.pages.auth.login.mounted - Redirect:", this.redirect);
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.pages.auth.login.updated");
		}
	}
</script>