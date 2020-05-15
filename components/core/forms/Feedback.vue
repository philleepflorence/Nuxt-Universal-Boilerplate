<template>
	<div class="form-feedback plain-form form-line form-no-label" v-bind:key="keys.element">
		<div v-bind:class="container" v-if="form">
			<app-component-form-form 
				v-bind:id="`forms-${ form.slug }-form`" 
				v-bind:formname="form.slug"
				v-bind:formtemplate="form.template"
				v-bind:formnotification="notification"
				v-bind:inputs="inputs.inputs"
				v-bind:button="inputs.submit"
				path="/api/form/submit" 
				captcha="true" 
				options="true" 
				clearonsuccess="true" 
				autocomplete="off"
				data-tooltip-container="width">
					
				<template v-slot:header>
					<div class="lead p pb-4" v-html="form.content"></div>
				</template>
																				
			</app-component-form-form>
		</div>	
	</div>
</template>

<script>
	import { forEach, get } from "lodash";
	
	import ComponentFormForm from "~/components/core/forms/Form.vue";
	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "FeedbackForm",
		props: [
			"container"
		],
		components: {
			'app-component-form-form': ComponentFormForm
		},
		computed: {
			form () {
				let feedback;
				
				forEach(this.forms, (form) => {
					if (form.feedback && form.privilege <= this.privilege) feedback = form;
				});
				
				return feedback;
			},
			forms () {
				return this.$store.state.api.forms;
			},
			inputs () {
				let inputs;
				
				if (this.form && this.form.inputs) inputs = Page.inputs(this.form.inputs);
				
				return inputs;
			},
			notification () {
				if (!this.form.notifications) return null;
				
				let notification;
				
				forEach(this.form.notifications, (row) => {
					if (row.status === "published") notification = row.slug;
				});	
				
				return notification;
			},
			privilege () {
				if (this.$store.state.user) return this.$store.state.user.privilege;
				
				return 0;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.forms.Feedback.mounted");
		}
	}
</script>