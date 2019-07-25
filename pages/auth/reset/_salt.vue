<template>
	<div>
		<AuthWrapper v-bind:content="content">
			<div class="max-w-540px mx-auto my-4 plain-form">
				<Form v-bind:id="form.id" v-bind:path="form.path" autocomplete="off">
					<input type="hidden"v-bind:value="salt" class="input">
					<div class="row">
						<div class="col-span col-md-6" v-for="input in inputs" v-bind:key="input.slug">
							<div class="form-group">
								<b-form-group 
									v-bind:id="`form-group-${ input.slug }`" 
									v-bind:label="input.plaintext" 
									v-bind:label-for="`form-${ input.slug }`" class="form-no-label">
									<b-form-input 
										class="input"
										v-bind:id="`form-${ input.slug }`" 
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
					<div class="form-group form-footer text-center">
						<b-button type="submit" variant="primary" class="w-100 text-uppercase font-weight-book form-button">{{ labels.reset.form.label.submit.plaintext }}</b-button>
					</div>
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
		name: "Reset",
		components: {
			Form, AuthWrapper
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			inputs () {
				let inputs = this.$store.state.api.labels.reset.form.label;
				
				inputs = _.filter(inputs, function (row) {
					return row.form_type === 'input';
				});
				
				return inputs;
			},
			labels () {
				return this.$store.state.api.labels;
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
		async asyncData ({ params, error, req }) {
			
			if (req && req.contents) return {
				content: req.contents
			};
			
			const user = await Page.data('/api/contents/reset', {
				salt: params.salt
			});
			
			if (!user) return error({ statusCode: 400 })
					
			return {
				content: { user: user }
			};
		},
		data () {
			return {
				form: {
					id: 'reset-form',
					path: this.$store.state.app.endpoints.auth.reset
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