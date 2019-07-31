<template>
	<div class="form-container">
		<b-form 
			v-on:submit.prevent="submit" 
			v-on:reset="reset" 
			v-on:change="change" 
			v-bind:id="id" 
			v-bind:data-path="path" 
			v-if="show" 
			class="form form-slim" 
			v-bind:autocomplete="autocomplete"
			v-bind:autofill="autocomplete" 
			disabled>
			<header class="form-options mb-2" v-if="options">
				<div class="form-group bg-secondary p-2 cursor-hand position-relative">
					<b-form-checkbox 
						v-bind:id="`form-${ toggle.slug }`" 
						v-bind:name="`form.${ toggle.slug }`"
						v-bind:value="`form.${ toggle.slug }`" 
						v-on:change="toggleForm"
						switch>{{ toggle.plaintext }}
					</b-form-checkbox>
				</div>
			</header>
			<slot></slot>
			<footer class="form-options" v-if="captcha">
				<div class="form-group bg-secondary p-2 cursor-hand position-relative">
					<b-form-checkbox 
						v-bind:id="`form-captcha-${ id }`" 
						name="form-captcha"
						value="1" 
						v-on:change="confirmForm"
						v-bind:placeholder="disclaimer.confirm.name"
						switch
						required>{{ disclaimer.confirm.plaintext }}
					</b-form-checkbox>
				</div>
			</footer>
		</b-form>
	</div>
</template>

<script>
	import { get as __Get, merge as __Merge } from 'lodash';	
	import { form2js } from 'form2js';
	
	import Alert from '~/helpers/core/alert.js';
	import Page from '~/helpers/core/page.js';
	
	export default {
		name: "Form",
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
			'formdata'
		],
		computed: {
			disclaimer () {
				return this.$store.state.api.labels.app.form.disclaimer;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			labels () {
				return this.$store.state.api.labels.app.form.responses;
			},
			toggle () {
				return this.$store.state.api.labels.app.form.option['toggle-form-labels'];
			}
		},
		data () {
			return {
				show: true,
				formID: this.$props.id,
				formConfirm: this.$props.confirm,
				formConfirmed: false,
				formPath: this.$props.path,
				formSelector: typeof this.$props.elements === 'string' ? this.$props.elements : 'input.input, textarea.input, select.input, div.custom-file.input',
				formProcessing: false
			};
		},
		methods: {
			change (e) {				
				this.$store.commit('app/SET', {
					key: 'form.changed',
					data: true
				});
				
				this.formElement = document.getElementById(this.formID);
				
				this.formElement.changed = true;
				
				let button = this.formElement.querySelector('.form-button[disabled]');
				
				if (button) {
					button.removeAttribute('disabled');
					button.classList.remove('disabled');
				}
			},
			clear () {				
				this.formProcessing = false;
							
				this.$store.commit('app/SET', {
					key: 'form.changed',
					data: false
				});
				
				for (let input of this.formInputs) {
					var type = input.type || input.getAttribute('data-type');
				
					if (type == 'hidden') return false;
					
					if (type === 'radio' || type === 'checkbox') input.checked = false;
					else if (input.value || input.type) input.value = '';
					else if (input.selectedIndex) input.selectedIndex = -1;
					else if (input.hasAttribute('contenteditable')) input.innerHTML = '';
				}
				
				this.form = {};
				
				this.show = false;
				this.$nextTick(() => {
					this.show = true;
				});
			},
			confirmForm (e, a) {
				this.formElement = document.getElementById(this.formID);
				
				if (this.formCaptcha) {
					this.formCaptcha = true;
					this.formElement.classList.add('form-captcha');
				}				
			},
			toggleForm (e) {
				this.formElement = document.getElementById(this.formID);
				
				if (this.formElement.classList.contains('form-slim')) {
					this.formElement.classList.remove('form-slim');
					this.formElement.classList.add('form-expanded');
				}				
				else {
					this.formElement.classList.add('form-slim');
					this.formElement.classList.remove('form-expanded');
				}
			},
			reset (e) {
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
				
				let processing = __Get(this.labels, 'submit-form-processing.value');
				
				this.formInputs = this.formElement.querySelectorAll(this.formSelector);
				
				Alert.show(processing);
				
				let post = this.serialize(this.formInputs);	
				let source = this.$props.formdata;
				
				if (!this.formElement.changed && source) {
					post = __Merge(post, source);
				}
				
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.send - post", post);
										
				this.$store.commit('app/SET', {
					key: 'form.changed',
					data: false
				});
				
				let response = await Page.post(this.formPath, post);
				
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.send - response", response);
				
				let message;
				
				if (typeof response.error === "string") message = response.error;
				else if (typeof response.success === "string") message = response.success;
				else message = response.message;
				
				if (response.message && message !== response.message && !response.response) response.response = response.message;
				
				this.formProcessing = false;
				
				if (typeof response.response === 'string') message = `${ message }<p><em>${ response.response }</em></p>`;
				
				let alert = response.error ? 'error' : 'success';
				
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
				
				if (response.redirect) {
					window.location.href = response.redirect;
					return false;
				}
				
				if (response.navigate) {
					this.$router.push({
						path: response.navigate
					});
					return false;
				}
			},
			submit (e) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Form.submit");
				
				if (this.captcha && !this.formCaptcha) return false;
				
				e.preventDefault();		
				
				let processing = __Get(this.labels, 'submit-form-processing.value');
				
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
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.forms.Form.mounted");
						
			this.formElement = document.getElementById(this.formID);
			
			if (!this.formElement) return false;
					
			this.formInputs = this.formElement.querySelectorAll(this.formSelector);
			
			if (this.formElement && this.formInputs && this.$props.autocomplete === "off") this.clear();
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.core.forms.Form.updated");
		},
		watch: {}
	}
</script>

<style lang="less">
	html {
		body {
			.custom-switch {
				.custom-control-label {
					&:before, &:after {
						border-radius: 0.5rem !important;
					}
				}
				.custom-control-input:checked ~ .custom-control-label::before {
					border-color: #808080;
					background-color: #808080;
				}
			}
			.plain-form {
				.form-group {
					label {
						color: white !important;
						font-weight: 500 !important;
					}
				}
				.form-control, .custom-file-label {
					border: none !important;
					background: fade(white, 70) !important;
					
					&:focus {
						background: fade(white, 90) !important;
						outline: none !important;
					}
				}
			}
		}
	}		
</style>