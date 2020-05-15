<template>
	<div class="form-container position-relative" v-bind:key="keys.element">
		<b-form 
			v-on:submit.prevent="submit" 
			v-on:reset="reset" 
			v-on:change="change" 
			v-bind:id="id"  
			v-bind:key="keys.form" 
			v-bind:data-path="path" 
			v-if="show.form" 
			class="form position-relative form-slim" 
			v-bind:autocomplete="autocomplete"
			v-bind:autofill="autocomplete" 
			disabled>
			<header class="form-header pr-4">
				<slot name="header"></slot>
			</header>
			<nav class="dropdown position-absolute position-top position-right" v-if="options">
				<b-dropdown v-bind:id="`dropdown-${ id }`" class="dropdown-icon" dropleft menu-class="text-right">
					<template slot="button-content">
						<span class="text-white dropdown-icon" v-html="icons.toggle.options.open.icon.icon"></span>
					</template>
					<b-dropdown-item href="#" v-on:click="resetForm">{{ reset.value }}</b-dropdown-item>
					<b-dropdown-item href="#" v-on:click="toggleForm">{{ toggle.value }}</b-dropdown-item>
					<slot name="dropdown"></slot>
				</b-dropdown>				
			</nav>
			<div class="form-content">
				<slot name="content"></slot>
			</div>
			<div class="form-contents">				
				
				<slot name="hidden">
					<input type="hidden" v-bind:value="formname" name="form.form" class="input" v-if="formname">
					<input type="hidden" v-bind:value="formuser" name="form.user" class="input" v-if="formuser">
					<input type="hidden" v-bind:value="formtemplate" name="form.template" class="input" v-if="formtemplate">
					<input type="hidden" v-bind:value="formnotification" name="form.notification" class="input" v-if="formnotification">
				</slot>
				
				<slot name="inputs"></slot>
				
				<div class="form-inputs row" v-if="inputs">
								
					<div v-bind:id="`${ formname }-${ id }-${ input.slug }-container`" 
						v-bind:class="classname(input)" 
						v-for="input in forminputs" 
						v-bind:data-input-type="input.input_type" 
						v-bind:data-form-type="input.form_type"
						v-bind:key="`${ formname }-${ id }-${ input.slug }-container`"
						data-tooltip-container="width">
							
						<input type="hidden" v-bind:value="row.value" v-bind:name="row.name" class="input" v-if="input.inputs" v-for="row in input.inputs">
							
						<label class="form-label" v-bind:for="`${ formname }-${ id }-${ input.slug }`" v-html="input.value" v-bind:data-required="`${ required(input.attributes) }`"></label>
						
						<!-- Tooltip -->
						
						<b-tooltip 
							v-if="tooltip"
							v-bind:target="`${ formname }-${ id }-${ input.slug }`" 
							triggers="focus"
							v-bind:container="`${ formname }-${ id }-${ input.slug }-container`"
							v-bind:boundary="`${ formname }-${ id }-${ input.slug }-container`"
							placement="top">
							{{ striptags(input.hint, input.value) }}
						</b-tooltip>
						
						<!-- Checkbox -->
						
						<div class="form-checkbox-container form-group form-confirm p-2 cursor-hand position-relative" v-if="input.input_type == 'checkbox'">
							<b-form-checkbox 
								class="input"
								v-bind:id="`${ formname }-${ id }-${ input.slug }`" 
								v-bind:v-model="`form.${ property(input) }`" 
								v-bind:name="`form.${ property(input) }`"
								v-on:change="onCheckbox($event, `form.${ property(input) }`, input)" 
								v-bind="attributes(input.attributes)"
								switch>
								<div class="d-inline-block p" v-html="input.value"></div>
							</b-form-checkbox>
						</div>
						
						<!-- Input -->
						
						<div class="form-input-container position-relative" v-else-if="input.form_type == 'input'">
							<b-form-input 
								class="input"
								v-bind:id="`${ formname }-${ id }-${ input.slug }`" 
								v-bind:type="input.input_type" 
								v-bind:v-model="`form.${ property(input) }`"
								v-bind:value="input.defaultValue" 
								v-bind:placeholder="input.value" 
								v-bind:name="`form.${ property(input) }`"
								v-bind="attributes(input.attributes)"
								v-on:change="onEmit($event, input)">
							</b-form-input>
						</div>
						
						<!-- Select -->
						
						<div class="form-select-container position-relative" v-else-if="input.form_type == 'select'">
							
							<!-- Select - Options -->
							
							<b-form-select
								v-if="optionsMode(input) == 'options'"
								class="input"
								v-bind:id="`${ formname }-${ id }-${ input.slug }`"
								v-bind:v-model="`form.${ property(input) }`"
								v-bind:name="`form.${ property(input) }`"
								v-on:change="onSelect($event, `form.${ property(input) }`, input.slug, input)" 
								v-bind="attributes(input.attributes)">		
								<b-form-select-option 
									v-for="(option, key) in input.options"
									v-bind:key="`${ formname }-${ id }-${ input.slug }-option-${ key }`"
									v-bind:value="option.value"
									v-bind:selected="option.value == input.defaultValue"
									v-html="option.text">
								</b-form-select-option>
							</b-form-select>
							
							<!-- Select - Options Group -->
							
							<b-form-select
								v-else-if="optionsMode(input) == 'group'"
								class="input"
								v-bind:id="`${ formname }-${ id }-${ input.slug }`"
								v-bind:v-model="`form.${ property(input) }`"
								v-bind:name="`form.${ property(input) }`"
								v-on:change="onSelect($event, `form.${ property(input) }`, input.slug, input)" 
								v-bind="attributes(input.attributes)">		
								<b-form-select-option-group 
									v-for="(group, index) in input.options"
									v-bind:key="`${ formname }-${ id }-${ input.slug }-option-group-${ index }`"
									v-bind:label="group.label">									
									<b-form-select-option
										v-for="(option, key) in group.options"
										v-bind:key="`${ formname }-${ id }-${ input.slug }-option-${ key }`"
										v-bind:value="option.value"
										v-bind:selected="option.value == input.defaultValue"
										v-html="option.text">
									</b-form-select-option>									
								</b-form-select-option-group>
							</b-form-select>
							<input class="form-control position-absolute position-full pointer-events-none" v-bind:value="input.defaultValue" v-bind:placeholder="input.value" v-bind:ref="input.slug" v-bind:v-model="`form.${ property(input) }`">
							<span class="form-icon position-absolute position-right-center text-muted pr-2" v-html="icons.dropdown.icon.icon.icon"></span>
						</div>
						
						<!-- Textarea -->
						
						<div class="form-textarea-container position-relative" v-else-if="input.form_type == 'textarea'">
							<b-form-textarea 
								class="input form-textarea"
								v-bind:id="`${ formname }-${ id }-${ input.slug }`" 
								v-bind:type="input.input_type" 
								v-bind:v-model="`form.${ property(input) }`" 
								v-bind:value="input.defaultValue"
								v-bind:placeholder="input.value"  
								v-bind:name="`form.${ property(input) }`"
								v-on:change="onEmit($event, input)" 
								v-bind="attributes(input.attributes)">
							</b-form-textarea>
						</div>
						
						<!-- HTML WYSIWYG Editor -->
						
						<div class="form-textarea-container position-relative" v-else-if="input.form_type == 'editor'">
							<app-component-form-medium-editor 
								v-bind:id="`${ formname }-${ id }-${ input.slug }`" 
								v-bind:label="input.value" 
								v-bind:placeholder="input.hint"
								v-bind:model="`form.${ input.slug }`"
								v-bind:attributes="attributes(input.attributes)" 
								v-bind:title="input.hint" 
								v-bind:value="input.defaultValue">
							</app-component-form-medium-editor>
						</div>
						
						<!-- File Upload -->
						
						<div class="form-textarea-container position-relative" v-else-if="input.form_type == 'file'">
							<app-component-form-file-input 
								v-bind:id="`${ formname }-${ id }-${ input.slug }`" 
								v-bind:label="input.value" 
								v-bind:placeholder="input.value"
								v-bind:model="`form.${ input.slug }`"
								v-bind:attributes="attributes(input.attributes)" 
								v-bind:title="input.hint"
								v-on:value="onFileChange($event, `form.${ input.slug }`)"
								v-on:upload="onFileUpload($event, `form.${ input.slug }`)">
							</app-component-form-file-input>
						</div>
						
						<p class="form-hint fs-12px pt-1 font-weight-book no-wrap text-truncate" v-if="input.hint" v-html="input.hint"></p>
					</div>
					
				</div>
			</div>			
			<footer class="form-options my-4" v-if="captcha">
				<div class="form-group form-confirm p-2 position-relative">
					<b-form-checkbox 
						v-bind:id="`form-captcha-${ formname }-${ id }-${ id }`" 
						name="form-captcha"
						value="1" 
						v-on:change="confirmForm"
						v-bind:placeholder="disclaimer.confirm.name"
						switch
						required>{{ disclaimer.confirm.value }}
					</b-form-checkbox>
				</div>
			</footer>
			<slot name="footer" v-if="show.submit">
				<div class="form-group form-footer text-center" v-if="button">
					<button 
						type="submit"
						class="h-50px w-50px bg-primary text-white plain form-submit rounded-circle mt-4" 
						v-if="button.icon" 
						v-html="button.icon.icon">
					</button>
					<b-button 
						type="submit" 
						variant="primary" 
						class="w-100 text-uppercase font-weight-book form-button form-submit text-white"
						v-else><div v-html="button.value"></div></b-button>
				</div>
			</slot>
		</b-form>
	</div>
</template>

<script>
	import {
		cloneDeep, 
		forEach, 
		get, 
		merge,
		set, 
		size
	} from 'lodash';	
	import { form2js } from 'form2js';
	
	import ComponentFormFileInput from "~/components/core/forms/FileInput.vue";
	import ComponentFormMediumEditor from "~/components/core/forms/MediumEditor.vue";
	
	import Alert from '~/helpers/core/alert.js';
	import Page from '~/helpers/core/page.js';
	
	export default {
		name: "Form",
		components: {
			'app-component-form-file-input': ComponentFormFileInput,
			'app-component-form-medium-editor': ComponentFormMediumEditor
		},
		props: [
			'id', 
			'captcha',
			'clearonsuccess',
			'path', 
			'elements', 
			'autocomplete', 
			'skipEmpty', 
			'confirm', 
			'options', 
			'formdata',
			'formname',
			'formtemplate',
			'formnotification',
			'inputs',
			'defaults',
			'button',
			'redirect',
			'tooltip',
			'navigate'
		],
		computed: {
			disclaimer () {
				return this.$store.state.api.labels.form.disclaimer;
			},
			forminputs () {
				let data = {
					path: this.$route.path, 
					user: cloneDeep(this.$store.state.user),
					page: cloneDeep(this.$store.state.api.pages),
					labels: cloneDeep(this.$store.state.api.labels)
				};
				let defaults = this.defaults ? merge(data, cloneDeep(this.defaults)) : data;
				let inputs = cloneDeep(this.inputs);
				
				if (typeof window === "object") data.userAgent = window.navigator.userAgent;
				
				if (inputs && defaults) {
					forEach(inputs, (input) => {
						if (input.source) {
							input.defaultValue = Page.template(input.source, defaults);
						}
						else if (input.default_value) {
							input.defaultValue = input.default_value;							
						}
						
						let property = input.property || input.slug;
						
						if (property && input.defaultValue) set(this.form, property, input.defaultValue);
					});
				}
				
				return inputs;
			},
			formuser () {
				return get(this.$store.state.user, 'id');
			},
			icons () {
				return this.$store.state.api.icons;
			},
			toggle () {
				return this.$store.state.api.labels.form.option['toggle-form-labels'];
			},
			reset () {
				return this.$store.state.api.labels.form.option['reset-form'];
			},
			responses () {
				return this.$store.state.api.responses.form.responses;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand(),
					form: Page.utils.rand()
				},
				show: {
					form: false,
					submit: true
				},
				form: {},
				formID: this.$props.id,
				formConfirm: this.$props.confirm,
				formConfirmed: false,
				formPath: this.$props.path,
				formSelector: typeof this.$props.elements === 'string' ? this.$props.elements : 'input.input, textarea.input, select.input, div.custom-file.input'
			};
		},
		methods: {
			attributes (attributes) {
				return Page.utils.attributes(attributes);
			},
			classname (input) {
				return Page.classname(input.params, ["form-group"]);
			},
			change (e) {				
				this.$store.commit('app/SET', {
					key: 'form.changed',
					data: true
				});
				
				this.formElement = this.$el.querySelector('form.form');
				
				this.formElement.changed = true;
				
				let button = this.formElement.querySelector('.form-button[disabled]');
				
				if (button) {
					button.removeAttribute('disabled');
					button.classList.remove('disabled');
				}
			},
			clear () {				
				this.formProcessing = false;
				
				this.form = {};
				
				this.keys.form = Page.utils.rand();
							
				this.$store.commit('app/SET', {
					key: 'form.changed',
					data: false
				});
			},
			confirmForm (e) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.confirmForm");
				
				this.formElement = this.$el.querySelector('form.form');
				
				if (!this.formCaptcha && document.body.getAttribute('data-device-control')) {
					this.formCaptcha = true;
					this.formElement.classList.add('form-captcha');
				}				
			},
			onCheckbox (value, model, input) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.onCheckbox");
				
				if (typeof model === "string") {
					set(this, model, value);
					
					this.onEmit(value, input);
				}
			},
			onEmit (value, input) {
				this.$emit('change', value, input);
			},
			onFileChange (value, model) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.onFileChange", value);
				
				if (typeof model === "string") set(this, model, value);				
			},
			onFileUpload (value, model) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.onFileUpload", value);
				
				this.show.submit = value;			
			},
			onSelect (value, model, element, input) {	
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.onSelect", value);
				
				if (typeof model === "string") set(this, model, value);	
				
				let $element = get(this.$refs, `${ element }.0`);
							
				if (element && value && $element) $element.value = value;
			},
			optionsMode (input) {
				if (!Array.isArray(input.options)) return false;
				
				let type = 'options';
				
				input.options.forEach((option) => {
					if (Array.isArray(option.options)) type = "group";
				});
				
				return type;
			},
			property (input) {
				return input.property || input.slug;
			},
			toggleForm (e) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.toggleForm");
				
				this.formElement = this.$el.querySelector('form.form');
				
				if (this.formElement.classList.contains('form-slim')) {
					this.formElement.classList.remove('form-slim');
					this.formElement.classList.add('form-expanded');
				}				
				else {
					this.formElement.classList.add('form-slim');
					this.formElement.classList.remove('form-expanded');
				}
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.render");
				
				this.formElement = this.$el.querySelector('form.form');
			
				if (!this.formElement) return false;
					
				this.formInputs = this.$el.querySelectorAll(this.formSelector);
			
				if (this.formElement && this.formInputs && this.$props.autocomplete === "off") this.clear();
			},
			required (attributes) {
				if (typeof attributes === 'string') return attributes.indexOf('required') >= 0;
				
				return false;
			},
			resetForm (e) {
				e.preventDefault();
				
				this.clear();
			},
			serialize (elements, delimiter) {
				delimiter = delimiter || '.';
				
				let skipEmpty = typeof this.$props.skipEmpty === 'boolean' ? this.$props.skipEmpty : false;
				
				return form2js(elements, delimiter, skipEmpty, function (node) {
					if (node.getAttribute && node.getAttribute('data-value')) 
					{
						return {
							name: node.getAttribute('name'),
							value: node.getAttribute('data-value')
						};
					}
		
					else if (node.getAttribute && node.getAttribute('data-serialize-array')) 
					{
						return {
							name: node.getAttribute('name'),
							value: (node.value || node.innerHTML || "").split(node.getAttribute('data-serialize-array') === 'linebreak' ? /\r\n|\n/ : node.getAttribute('data-serialize-array'))
						};
					}
		
					else if (node.getAttribute && node.hasAttribute('data-serialize-json')) 
					{
						var value = node.value || node.innerHTML || "";
						
						return {
							name: node.getAttribute('name'),
							value: JSON.parse(value)
						};
					}
		
					else if (node.getAttribute && node.hasAttribute('data-serialize-linebreak') && node.value) 
					{
						return {
							name: node.getAttribute('name'),
							value: node.value.replace(/\n/g, "<br>")
						};
					}
		
					else if (node.getAttribute && node.getAttribute('contenteditable')) 
					{
						return {
							name: node.getAttribute('name'),
							value: node.innerHTML
						};
					}
		
					else if (node.getAttribute && node.getAttribute('data-file-url') && node.getAttribute('data-name')) 
					{
						return {
							name: node.getAttribute('data-name'),
							value: {
								data: node.getAttribute('data-file-url'),
								type: node.getAttribute('data-file-type'),
								name: node.getAttribute('data-file-name'),
								title: node.getAttribute('data-file-title'),
								caption: node.getAttribute('data-file-caption')
							}
						};
					}
				}, true);
			},
			async send () {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.send");
				
				this.formProcessing = true;	
				
				let processing = get(this.responses, 'submit-form-processing.value');
				
				this.formInputs = this.$el.querySelectorAll(this.formSelector);
				
				Alert.show(processing);
				
				let post = this.serialize(this.formInputs);	
				let source = this.$props.formdata;
				
				if (size(this.form)) post = merge(post, {
					form: this.form
				});
				
				if (!this.formElement.changed && source) {
					post = merge(post, source);
				}
				
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.send - post", post);
										
				this.$store.commit('app/SET', {
					key: 'form.changed',
					data: false
				});
				
				let response = await Page.post(this.formPath, post);
				
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.send - response", response);
				
				let message;
				let list = response.list;
					list = list ? list.join('</li><li>') : list;
				
				if (typeof response.error === "string") message = response.error;
				else if (typeof response.success === "string") message = response.success;
				else message = response.message;
				
				if (response.message && message !== response.message && !response.response) response.response = response.message;
				
				this.formProcessing = false;
				
				if (typeof response.response === 'string') message = `${ message }<p><em>${ response.response }</em></p>`;
				
				if (list) message = `${ message }<ul><li>${ list }</li></ul>`;
				
				let alert = response.error ? 'error' : 'success';
				
				if (window.DEBUG) console.log(`debug - app.components.core.forms.Form.send - message: ${ message }`);
				
				if (response.success && this.clearonsuccess) {
					this.clear();
				}
							
				if (message) {
					Alert.show(message, alert);
					if (response.error) return false;
				}
				
				if (response.reload) {
					window.location.reload(true);
					return false;
				} 
				
				let redirect = response.redirect || this.redirect;
				
				if (window.DEBUG) console.log(`debug - app.components.core.forms.Form.send - redirect: ${ redirect }`);
				
				if (redirect) {
					window.location.href = redirect;
					return false;
				}
				
				let navigate = response.navigate || this.navigate;
				
				if (window.DEBUG) console.log(`debug - app.components.core.forms.Form.send - navigate: ${ navigate }`);
				
				if (navigate) {
					this.$router.push({
						path: navigate
					});
					return false;
				}
			},
			submit (e) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.submit");
				
				if ((this.captcha && !this.formCaptcha) || !document.body.getAttribute('data-device-control')) return false;
				
				e.preventDefault();		
				
				let processing = get(this.responses, 'submit-form-processing.value');
				
				if (this.formProcessing) {
					Alert.show(processing);
					return false;
				}
				
				if (this.formConfirm) {
					Alert.show(this.formConfirm, 'alert', {
						callback () {
							this.send();
						}
					});
				}
				else this.send();			
			},
			striptags (hint, value) {
				return Page.utils.striptags(hint || value);
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.forms.Form.mounted");
			
			this.show.form = true;
						
			this.render();
		}
	}
</script>

<style lang="less">		
	@import '../../../assets/styles/mixins/mixins.less';
	
	html {
		body {
			form.form {
				.form-component {
					margin-left: -1.5rem;
					margin-right: -1.5rem;
				}				
				.custom-switch {
					.custom-control-label {
						&:before, &:after {
							border-radius: 0.5rem !important;
						}
					}
					.custom-control-input:checked ~ .custom-control-label::before {
						border-color: @colorprimary;
						background-color: @colorprimary;
					}
				}
				.form-select-container {
					select {
						opacity: 0 !important;
					}
				}	
				[data-input-type="checkbox"] {
					label.form-label {
						display: none !important;
					}
				}
				.form-inputs {
					@spacer: 5px;
					margin-right: -@spacer;
					margin-left: -@spacer;
					
					.form-group {
						padding-right: @spacer;
						padding-left: @spacer;
					}
				}
				label[data-required="true"]	{
					p {
						display: inline-block;
					}
					&:after {
						content: ' *';
					}
				}
				label[data-required="false"] {
					opacity: 0.75 !important;
				}
				.custom-control-label {
					cursor: pointer !important;
				}		
			}
			.plain-form {
				.form-group {
					label:not(.custom-control-label) {
						color: white !important;
						font-weight: 500 !important;
					}
				}
				.form-control, 
				.form-checkbox-container,
				.custom-file-label,
				.custom-select {
					border: none !important;
					background: fade(white, 70) !important;
					
					&:focus {
						background: fade(white, 90) !important;
						outline: none !important;
					}
				}
				
				.form-confirm {
					background-color: fade(@maintextcolor, 15) !important;
				}
				
				&.form-line {
					.form-icon {
						padding-right: 0 !important;
					}
					button.dropdown-toggle * {
						color: @maintextcolor !important;
					}
					.form-group {
						.custom-select option,
						label:not(.custom-control-label),
						.text-white:not(.form-submit) {
							color: @maintextcolor !important;
						}
					}
					.form-control, 
					.custom-file-label,
					.custom-select {
						background-color: transparent !important;
						border-bottom: 1px solid fade(@maintextcolor, 70) !important;
						padding-left: 0 !important;
						
						&:focus {
							border-bottom-color: fade(@maintextcolor, 70) !important;
						}
					}
				}
				
				&.form-white {
					button.dropdown-toggle * {
						color: white !important;
					}
					.form-group {
						.custom-select option,
						label:not(.custom-control-label),
						.text-white {
							color: white !important;
						}
						
						.form-hint {
							color: fade(white, 60) !important;
						}
					}
					.form-control, 
					.custom-file-label,
					.custom-select {
						color: white !important;
						border-bottom-color: fade(white, 80) !important;
						
						&[readonly] {
							color: fade(white, 60) !important;
						}
					}
					.form-confirm {
						background-color: fade(white, 15) !important;
						
						label {
							color: fade(white, 60) !important;
						}
					}
					
					.form-select-container {
						.form-icon {
							color: fade(white, 60) !important;
						}
					}
				}
			}
			.form-no-hint {
				.form-hint {
					display: none !important;
				}
			}
			.form-no-label {
				.form-label {
					display: none !important;
				}
			}
			.form-dark {
				.custom-control-label {
					color: white !important;
				}
			}
		}
	}		
</style>