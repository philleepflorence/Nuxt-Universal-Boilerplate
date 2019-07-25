<template>
	<div>
		<AuthWrapper>
			<div class="max-w-280px mx-auto my-4 plain-form">
				<Form v-bind:id="form.id" v-bind:path="form.path">
					<input type="hidden" class="input" v-bind:value="redirect" name="redirect" v-if="redirect">
					<div class="form-group">
						<b-form-input 
							class="input"
							v-bind:id="`form-${ labels.login.form.label.username.slug }`" 
							v-bind:type="labels.login.form.label.username.input_type" 
							v-bind:placeholder="labels.login.form.label.username.name"
							v-bind:v-model="`form.${ labels.login.form.label.username.slug }`" 
							v-bind:name="`form.${ labels.login.form.label.username.slug }`" 
							v-b-tooltip.focus v-bind:title="labels.login.form.label.username.hint"
							required>
						</b-form-input>
					</div>
					<div class="form-group">
						<b-form-input 
							class="input"
							v-bind:id="`form-${ labels.login.form.label.password.slug }`" 
							v-bind:type="labels.login.form.label.password.input_type" 
							v-bind:placeholder="labels.login.form.label.password.name"
							v-bind:v-model="`form.${ labels.login.form.label.password.slug }`" 
							v-bind:name="`form.${ labels.login.form.label.password.slug }`" 
							v-b-tooltip.focus v-bind:title="labels.login.form.label.password.hint"
							required>
						</b-form-input>
					</div>
					<div class="form-group form-footer text-center">
						<b-button type="submit" variant="primary" class="w-100 text-uppercase font-weight-book form-button">{{ labels.login.form.label.submit.plaintext }}</b-button>
					</div>
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
		name: "Login",
		components: {
			Form, AuthWrapper
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			labels () {
				return this.$store.state.api.labels;
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
				form: {
					id: 'login-form',
					path: this.$store.state.app.endpoints.auth.login
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
			if (window.DEBUG) console.log("debug - app.pages.auth.login.mounted -", this.redirect);
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.pages.auth.login.updated");
		}
	}
</script>