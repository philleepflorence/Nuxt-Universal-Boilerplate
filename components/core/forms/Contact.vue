<template>
	<div class="form-contact" v-bind:key="keys.element">
		<Form 
			v-bind:id="`${ name }-form`" 
			path="/api/form/submit" 
			captcha="true" 
			options="true" 
			clearonsuccess="true" 
			autocomplete="off"
			data-tooltip-container="width">
				
			<template v-slot:header>
				<div class="p pb-4 text-white" v-html="headline"></div>
			</template>
			
			<template v-slot:inputs>
				<div class="form-inputs">
					<input type="hidden" value="contact" name="form.form" class="input">
					<div v-bind:id="`${ name }-form-group-${ input.slug }`" class="form-group" v-for="input in inputs">
						<label class="form-label form-no-label" v-bind:for="`${ name }-form-${ input.slug }`" v-html="input.plaintext"></label>
						<b-form-input 
							class="input"
							v-if="input.form_type == 'input'"
							v-bind:id="`${ name }-form-${ input.slug }`" 
							v-bind:type="input.input_type" 
							v-bind:placeholder="placeholder(input)"
							v-bind:v-model="`form.${ input.slug }`"
							v-bind:value="input.defaultValue" 
							v-bind:name="`form.${ input.slug }`" 
							v-bind="attributes(input.attributes)"
							autocomplete="off">
						</b-form-input>
						<b-form-textarea 
							class="input form-textarea"
							v-if="input.form_type == 'textarea'"
							v-bind:id="`${ name }-form-${ input.slug }`" 
							v-bind:type="input.input_type" 
							v-bind:placeholder="placeholder(input)"
							v-bind:v-model="`form.${ input.slug }`" 
							v-bind:value="input.defaultValue" 
							v-bind:name="`form.${ input.slug }`" 
							v-bind="attributes(input.attributes)"
							autocomplete="off">
						</b-form-textarea>
					</div>
				</div>
			</template>
			
			<template v-slot:footer>
				<div class="form-group form-footer text-center">
					<b-button type="submit" variant="primary" class="w-100 text-uppercase font-weight-book form-button">{{ submit }}</b-button>
				</div>
			</template>	
																			
		</Form>		
	</div>
</template>

<script>
	import _ from "lodash";
	import Handlebars from 'handlebars/dist/handlebars.min.js';
	import Page from "~/helpers/core/page.js";
	import Form from "~/components/core/forms/Form.vue";
	
	export default {
		name: "ContactForm",
		props: [
			"button",
			"information",
			"name",
			"subject"
		],
		components: {
			Form
		},
		computed: {
			configuration () {
				return this.$store.state.api.config.application;
			},
			headline () {
				return this.information || this.$store.state.api.labels.app.header['contact-overlay'].information.value;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			inputs () {
				let curruser = this.$store.state.user;
				let inputs = _.cloneDeep(this.$store.state.api.labels.app.form['contact-overlay']);
				
				if (curruser) {
					_.forEach(inputs, (input) => {
						if (input.source) {
							let template = Handlebars.compile(input.source);
							
							input.defaultValue = template(curruser);
						}
						if (input.slug === "subject" && this.$props.subject) {
							input.defaultValue = this.$props.subject;
						}
					});
				}
				
				return inputs;
			},
			labels () {
				return this.$store.state.api.labels;
			},
			submit () {
				return this.button || this.$store.state.api.labels.app.button['contact-overlay'].submit.plaintext;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		methods: {
			attributes (attributes) {
				return Page.utils.attributes(attributes);
			},
			placeholder (input) {
				return `${ input.plaintext } - ${ input.hint }`;
			}			
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.forms.Contact.mounted");
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	.form-contact {
		.form-group {
			.form-control {
				color: white !important;
				background: fade(white, 10) !important;
				
				&:focus {
					border-bottom: 1px solid @colorprimary !important;
				}
				
				&.error {
					border-bottom: 1px solid @colordanger !important;
				}
			}
		}
	}
</style>