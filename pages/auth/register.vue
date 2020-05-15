<template>
	<div class="page-container" v-bind:key="keys.page">
		<AuthWrapper>
			<div class="max-w-540px mx-auto my-4 plain-form form-no-hint form-dark">
				<Form 
					v-bind:button="inputs.submit"
					v-bind:formname="form.slug" 
					v-bind:formtemplate="form.template"
					v-bind:formnotification="notification"
					v-bind:id="form.slug" 
					v-bind:inputs="inputs.inputs" 
					v-bind:path="endpoint" 
					v-bind:captcha="true"
					autocomplete="off">					
				</Form>				
			</div>
		</AuthWrapper>
	</div>
</template>

<script>	
	import _ from 'lodash';	
	import AuthWrapper from "~/components/core/wrappers/Auth.vue";
	import Form from "~/components/core/forms/Form.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PageRegister",
		components: {
			Form, AuthWrapper
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			endpoint () {
				return this.$store.state.app.endpoints.auth.register;
			},
			form () {
				return this.$store.state.api.forms.register;
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
				return Page.get(this.pages, true, 'register');
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
		methods: {
			attributes (attributes) {
				return Page.utils.attributes(attributes);
			}
		}
	}
</script>