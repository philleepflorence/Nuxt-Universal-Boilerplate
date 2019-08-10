<template>
	<div id="contact" class="options-overlay position-fixed position-full bg-gray-70 off" role="app contact" v-bind:key="keys.element">
		<div class="contact-container position-absolute position-full">
			<CustomScroll name="contact" overlay="true">
				<div class="contact-wrapper d-flex align-items-center vh-100 max-w-480px mx-auto">
					<div class="flex-item w-100">
						<header class="contact-contents-header spacer transform t-delay">
							<span 
								class="d-flex align-items-center justify-content-center bg-white text-primary h-50px w-50px rounded-circle mx-auto" 
								v-html="labels.app.button.options.contact.icon.icon">
							</span>
						</header>
						<section class="contact-contents plain-form w-100 bg-dark spacer transform t-delay">
							<Form 
								id="contact-overlay-form" 
								path="/api/form/submit" 
								captcha="true" 
								options="true" 
								clearonsuccess="true" 
								autocomplete="off"
								data-tooltip-container="width">
								<template v-slot:header>
									<div class="p pb-4 text-white" v-html="headline.value"></div>
								</template>
								<template v-slot:inputs>
									<div class="form-inputs">
										<input type="hidden" value="contact" name="form.form" class="input">
										<div v-bind:id="`form-group-${ input.slug }`" class="form-group" v-for="input in inputs">
											<label class="form-label form-no-label" v-bind:for="`form-${ input.slug }`" v-html="input.plaintext"></label>
											<b-form-input 
												class="input"
												v-if="input.form_type == 'input'"
												v-bind:id="`form-${ input.slug }`" 
												v-bind:type="input.input_type" 
												v-bind:placeholder="input.plaintext"
												v-bind:v-model="`form.${ input.slug }`"
												v-bind:value="input.defaultValue" 
												v-bind:name="`form.${ input.slug }`" 
												v-b-tooltip:contact-overlay-form.focus 
												v-bind:title="input.hint" 
												v-bind="attributes(input.attributes)"
												autocomplete="off">
											</b-form-input>
											<b-form-textarea 
												class="input form-textarea"
												v-if="input.form_type == 'textarea'"
												v-bind:id="`form-${ input.slug }`" 
												v-bind:type="input.input_type" 
												v-bind:placeholder="input.plaintext"
												v-bind:v-model="`form.${ input.slug }`" 
												v-bind:value="input.defaultValue" 
												v-bind:name="`form.${ input.slug }`" 
												v-b-tooltip:contact-overlay-form.focus 
												v-bind:title="input.hint"  
												v-bind="attributes(input.attributes)"
												autocomplete="off">
											</b-form-textarea>
										</div>
									</div>
								</template>
								<template v-slot:footer>
									<div class="form-group form-footer text-center">
										<b-button type="submit" variant="primary" class="w-100 text-uppercase font-weight-book form-button">{{ submit.plaintext }}</b-button>
									</div>
								</template>																	
							</Form>
						</section>
					</div>
				</div>
			</CustomScroll>
		</div>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import Handlebars from 'handlebars/dist/handlebars.min.js';
	import Form from "~/components/core/forms/Form.vue";
	import CustomScroll from "~/components/core/ui/CustomScroll.vue";
	import { forEach as __forEach, get as __Get, cloneDeep as __cloneDeep } from "lodash";
	
	export default {
		name: "Contact",
		props: [
		
		],
		components: {
			CustomScroll,
			Form
		},
		computed: {
			configuration () {
				return this.$store.state.api.config.application;
			},
			headline () {
				return this.$store.state.api.labels.app.header['contact-overlay'].information;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			inputs () {
				let curruser = this.$store.state.user;
				let inputs = __cloneDeep(this.$store.state.api.labels.app.form['contact-overlay']);
				
				if (curruser) {
					__forEach(inputs, (input) => {
						if (input.source) {
							let template = Handlebars.compile(input.source);
							
							input.defaultValue = template(curruser);
						}
					});
				}
				
				return inputs;
			},
			labels () {
				return this.$store.state.api.labels;
			},
			submit () {
				return this.$store.state.api.labels.app.button['contact-overlay'].submit;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				rendered: false
			};
		},
		methods: {
			attributes (attributes) {
				return Page.utils.attributes(attributes);
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Contact.mounted");	
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Contact.updated");
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	@circle-size: 300px;
	@item-size: 50px;
	
	#contact[role="app contact"] {
		
		.contact-wrapper {
			width: 90vw;
			
			.contact-contents {
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
		}
		
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.contact-wrapper {			
				.contact-contents,
				.contact-contents-header {
					transform: translateY(20vh);
					opacity: 0;
				}
			}
		}
	}
</style>