<template>
	<div class="page-container" v-bind:key="keys.page">
		<AuthWrapper>
			<div class="max-w-540px mx-auto my-4 plain-form">
				<Form v-bind:id="form.id" v-bind:path="form.path" autocomplete="off">
					<template v-slot:inputs>
						<div class="row">
							<div class="col-span col-md-6" v-for="input in inputs" v-bind:key="input.slug">
								<div class="form-group">
									<b-form-group 
										v-bind:id="`register-form-group-${ input.slug }`" 
										v-bind:label="input.plaintext" 
										v-bind:label-for="`form-${ input.slug }`" class="form-no-label">
										<b-form-input 
											class="input"
											v-bind:id="`register-form-${ input.slug }`" 
											v-bind:type="input.input_type" 
											v-bind:placeholder="input.plaintext"
											v-bind:v-model="`form.${ input.slug }`" 
											v-bind:name="`form.${ input.slug }`" 
											v-b-tooltip.focus v-bind:title="input.hint"
											v-bind="attributes(input.attributes)">
										</b-form-input>
									</b-form-group>
								</div>
							</div>
						</div>
						<div class="row mb-3">
							<div class="col-span col-md-12">
								<div class="form-group bg-white-50 p-2">
									<b-form-checkbox 
										v-bind:id="`register-form-${ labels.register.form.label.disclaimer.slug }`" 
										v-bind:v-model="`form.${ labels.register.form.label.disclaimer.slug }`" 
										v-bind:name="`form.${ labels.register.form.label.disclaimer.slug }`" 
										switch required>{{ labels.register.form.label.disclaimer.plaintext }}
									</b-form-checkbox>
								</div>
							</div>						
						</div>
					</template>
					<template v-slot:footer>
						<div class="form-group form-footer text-center">
							<b-button type="submit" variant="primary" class="w-100 text-uppercase font-weight-book form-button">{{ labels.register.form.label.submit.plaintext }}</b-button>
						</div>
					</template>
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
		name: "Register",
		components: {
			Form, AuthWrapper
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			inputs () {
				let inputs = this.$store.state.api.labels.register.form.label;
				
				inputs = _.filter(inputs, function (row) {
					return row.form_type === 'input';
				});
				
				return inputs;
			},
			labels () {
				return this.$store.state.api.labels;
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
				form: {
					id: 'register-form',
					path: this.$store.state.app.endpoints.auth.register
				},
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

<style lang="less" scoped>
	@spacer: 5px;
	.row {
		margin-right: -@spacer;
		margin-left: -@spacer;
		
		.col-span {
			padding-right: @spacer;
			padding-left: @spacer;
		}
	}
</style>