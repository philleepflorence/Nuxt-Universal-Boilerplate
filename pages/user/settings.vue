<template>
	<div>
		<UserWrapper v-bind:content="content">
			<div class="max-w-540px mx-auto my-4 plain-form">
				<Form v-bind:id="form.id" v-bind:path="form.path" v-bind:autocomplete="form.autocomplete" v-bind:options="form.options" v-bind:formdata="formdata" v-bind:skipEmpty="form.skipEmpty">
					<input type="hidden" class="input" name="form.id" v-bind:value="content.user.id">
					<input type="hidden" class="input" name="redirect" v-bind:value="redirect">
					<div class="row">
						<div class="col-span col-md-6" v-for="input in inputs" v-bind:key="input.slug">
							<div class="form-group">
								<b-form-group 
									v-bind:id="`form-group-${ input.slug }`" 
									v-bind:label="input.plaintext" 
									v-bind:label-for="`form-${ input.slug }`" 
									class="form-no-label">
									<b-form-input 
										class="input"
										v-bind:id="`form-${ input.slug }`" 
										v-bind:type="input.input_type" 
										v-bind:placeholder="input.plaintext"
										v-bind:name="`form.${ input.slug }`" 
										v-bind:value="user(input)" 
										v-b-tooltip.focus v-bind:title="input.hint"
										v-bind="attributes(input.attributes)">
									</b-form-input>
								</b-form-group>
							</div>
						</div>
						<div class="col-span col-md-12" v-if="labels.label.image">
							<div class="form-group">
								<FileInput 
									v-bind:id="`form-group-${ labels.label.image.slug }`" 
									v-bind:label="labels.label.image.plaintext" 
									v-bind:placeholder="labels.label.image.plaintext"
									v-bind:model="`form.${ labels.label.image.slug }`" 
									v-bind:title="labels.label.image.hint" 
									v-bind:attributes="attributes(labels.label.image.attributes)">
								</FileInput>
							</div>
						</div>
						<div class="col-span col-md-12" v-if="labels.label.bio">
							<div class="form-group">
								<MediumEditor 
									v-bind:id="labels.label.bio.slug" 
									v-bind:label="labels.label.bio.plaintext" 
									v-bind:placeholder="labels.label.bio.plaintext"
									v-bind:model="`form.${ labels.label.bio.slug }`"
									v-bind:attributes="attributes(labels.label.bio.attributes)" 
									v-bind:title="labels.label.bio.hint" 
									v-bind:value="user(labels.label.bio)">
								</MediumEditor>
							</div>
						</div>
					</div>					
					<div class="form-group form-footer text-center">
						<b-button type="submit" variant="primary" class="w-100 text-uppercase font-weight-book form-button">{{ labels.label.submit.plaintext }}</b-button>
					</div>
				</Form>
			</div>
		</UserWrapper>
	</div>
</template>

<script>	
	import _ from 'lodash';	
	import UserWrapper from "~/components/core/wrappers/User.vue";
	import MediumEditor from "~/components/core/forms/MediumEditor.vue";
	import FileInput from "~/components/core/forms/FileInput.vue";
	import Form from "~/components/core/forms/Form.vue";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "SettingsProfile",
		components: {
			Form, UserWrapper, MediumEditor, FileInput
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			formdata () {
				let inputs = this.$store.state.api.labels['settings-profile'].form.label;
				let data = {};
				
				_.forEach(inputs, (input) => {
					let password = typeof input.attributes === 'string' && input.attributes.includes('new-password');
					
					if (!password && ['input', 'textarea', 'select'].includes(input.form_type)) _.set(data, input.slug, _.get(this.content.user, input.slug));
				});
				
				return { form: data };
			},
			inputs () {
				let inputs = this.$store.state.api.labels['settings-profile'].form.label;
				
				inputs = _.filter(inputs, (row) => {
					return row.form_type === 'input';
				});
				
				return inputs;
			},
			labels () {
				return this.$store.state.api.labels['settings-profile'].form;
			},
			page () {
				return Page.get(this.pages, true, 'profile');
			},
			pages () {
				return this.$store.state.api.pages;
			},
			path () {
				return this.$route.path;
			},
			redirect () {
				return this.$store.state.api.redirects.route.settings.url
			}
		},
		async asyncData ({ params, error, req }) {
			
			if (req && req.contents) {
				return {
					content: req.contents
				};
			}
			else if (!process.server) {																
				let content = await store.dispatch('contents/LOAD', {
					url: '/api/contents/profile',
					collection: 'users',
					cache: false
				});
				
				if (!content) return error(500);
				
				let cache = from.path.indexOf(route.path) === 0;
						
				return {
					content: content,
					cache: cache
				};
			}
		},
		data () {
			return {
				form: {
					autocomplete: 'off',
					id: 'user-settings-form',
					options: true,
					path: this.$store.state.app.endpoints.user.settings,
					skipEmpty: true
				}
			};
		},
		methods: {
			attributes (attributes) {
				return Page.utils.attributes(attributes);
			},
			user (input) {
				if (typeof input.attributes === 'string' && input.attributes.includes('new-password')) return '';
				
				return _.get(this.content.user, input.slug);
			}
		},
		mounted () {		
			if (window.DEBUG) console.log("debug - app.pages.user.settings.mounted");
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.pages.user.settings.updated");
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