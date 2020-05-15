<template>
	<div class="form-file-container form-no-label" v-bind:key="keys.element" data-file-container>
		<div class="position-relative" v-show="!updated">
			<b-form-file 
				class="input form-control" 
				v-bind:id="id" 
				v-bind:placeholder="placeholder" 
				v-bind:name="model"
				v-bind:state="Boolean(file)" 
				v-bind:v-model="file"
				v-on:input="onChange"
				v-bind="attributes">
			</b-form-file>
			<span 
				class="position-absolute position-right-center text-muted pointer-events-none" 
				v-html="icons.file.browse.icon.icon">
			</span>
		</div>
		<footer class="form-file-details animated fadeIn" v-show="updated">
			<figure class="form-file-image bg-dark position-relative mb-2" v-if="form.data">
				<img 
					class="d-block mx-auto mb-2" 
					v-bind:src="form.data">
				<button 
					class="position-absolute position-top position-right m-4 w-40px h-40px plain bg-primary rounded-circle" 
					v-html="icons.cancel.icon.icon" 
					v-show="!uploaded"
					v-on:click.stop.prevent="onCancel">
				</button>
				<button 
					class="position-absolute position-bottom position-left m-4 w-40px h-40px plain bg-primary rounded-circle" 
					v-html="labels.submit.icon.icon"
					v-show="!uploaded" 
					v-on:click.stop.prevent="onUpload">
				</button>
			</figure>
			<div class="position-relative" v-show="!uploaded">
				<b-form-input 
					class="form-file-input"
					v-bind:id="`form-${ id }-file-title`" 
					type="text" 
					v-on:input="onTitle"
					v-bind:placeholder="labels.title.value"
					v-bind:v-model="form.title">
				</b-form-input>
				<b-form-textarea 
					class="form-file-input"
					v-bind:id="`form-${ id }-file-caption`" 
					v-bind:placeholder="labels.caption.value"
					v-on:input="onCaption"
					v-bind:v-model="form.description">
				</b-form-textarea>
				<b-button 
					type="submit" 
					variant="primary" 
					class="w-100 text-uppercase font-weight-book form-button form-submit text-white mt-3 mb-2"
					v-on:click.stop.prevent="onUpload">
					<span class="text-white-100">{{ labels.submit.value }}</span>	
				</b-button>
			</div>
		</footer>
		<app-component-page-loader v-if="loading" v-bind:message="responses['submit-form-processing'].value"></app-component-page-loader>
	</div>
</template>

<script>
	import { get } from 'lodash';
	
	import ComponentPageLoader from "~/components/core/pages/Loader.vue";
	
	import Alert from '~/helpers/core/alert.js';
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: 'FileInput',
		components: {
			'app-component-page-loader': ComponentPageLoader
		},
		props: [
			'id', 
			'label', 
			'placeholder', 
			'model', 
			'attributes', 
			'title',
			'output'
		],
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			labels () {
				return this.$store.state.api.labels.form.file;
			},
			mode () {
				let mode = this.input.getAttribute('data-image-mode');
				
				if (mode) return mode;
				
				return 'id';
			},
			responses () {
				return this.$store.state.api.responses.form.responses;
			}
		},
		data () {
			return {
				defaults: {
					output: '<img src="{{cdn}}" alt="{{title}}">'
				},
				fileID: this.$props.id,
				keys: {
					element: Page.utils.rand()
				},
				form: {},
				file: [],
				loading: false,
				updated: false,
				uploaded: false
			};
		},
		methods: {
			onCancel (e) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.FileInput.onCancel");
				
				this.form = {};
				this.file = [];
				this.updated = false;
				
				this.keys.element = Page.utils.rand();
				
				this.$emit('upload', true);
			},
			onChange (file) {
				if (!this.input) return false;
				
				if (window.DEBUG) console.log("debug - app.components.core.forms.FileInput.onChange");
				
				this.$emit('upload', false);
				
				let max = this.input.getAttribute('max');
				
				if (max && Number(max) < file.size) {
					this.keys.element = Page.utils.rand();
					
					return false;
				}
				
				var reader  = new FileReader();
				
				reader.addEventListener('load', () => {
					this.input.parentNode.setAttribute('data-file-size', file.size);
					this.input.parentNode.setAttribute('data-file-type', file.type);
					this.input.parentNode.setAttribute('data-file-name', file.name);
					this.input.parentNode.setAttribute('data-name', this.input.name);
					
					this.form.data = reader.result;
					this.form.filename_disk = file.name;
					this.form.filename_download = file.name;
					
					this.updated = true;
										
					if (this.labels.submit.hint) Alert.show(this.labels.submit.hint);
				});
				
				if (file.size) reader.readAsDataURL(file);
			},
			onCaption (input) {
				this.form.description = input;
				
				if (this.input) this.input.setAttribute('data-file-description', this.form.description);
			},
			onTitle (input) {
				this.form.title = input;
				
				if (this.input) this.input.setAttribute('data-file-title', this.form.title);
			},
			async onUpload (e) {
				if (window.DEBUG) console.log("debug - app.components.core.forms.FileInput.onUpload");
				
				this.$emit('upload', true);
				
				this.loading = true;
				
				this.uploaded = true;
								
				Alert.show(this.responses['submit-form-processing'].value, 'alert', {
					delay: 30000
				});
								
				let response = await Page.post('/api/form/upload', {
					file: this.form
				});
				
				this.loading = false;
				
				if (response && response.success) {
					Alert.show(this.responses['success-upload'].value);
				}
				else {
					let error = this.responses['error'].value;
					
					if (response && response.message) error = `${ error }<br>${ response.message }`;
					
					return Alert.show(error);
				}
				
				if (window.DEBUG) console.log("debug - app.components.core.forms.FileInput.onUpload - response", response);
				
				let value = this.input.getAttribute('data-value') === "name" ? response.file.filename_disk : response.file.id;
				
				if (this.mode === "id") return this.$emit('value', value);
				
				let cdn = get(this.configuration, 'application.cdn.url');
				let file = {
					title: get(response, 'file.title'),
					description: get(response, 'file.description'),
					url: get(response, 'file.data.full_url'),
					cdn: get(response, 'file.data.url', '').replace('/uploads/', `${ cdn }/`)
				};
				let output = this.output || this.defaults.output;
				
				if (this.mode === "url" && output) value = Page.template(output, file);
				else if (this.mode) value = get(response.file, this.mode);
				
				if (window.DEBUG) console.log("debug - app.components.core.forms.FileInput.onUpload - image", value);
				
				this.$emit('value', value);
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.forms.FileInput.mounted");
			
			this.input = this.$el.querySelector('[type="file"]');
		}
	}
</script>

<style lang="less">
	[data-file-container] {
		input.form-file-input {
			margin-bottom: 0.6rem;
		}
		textarea.form-file-input {
			height: 5rem !important;
			resize: none;
			overflow: hidden;
		}
		.custom-file-label {
			cursor: pointer !important;
			
			&:after {
				display: none !important;
			}
		}
		.form-file-image {
			margin: auto -1.5rem;
			
			button {
				color: white !important;
			}
			
			img {
				max-width: 100%;
				height: auto;
				max-height: 50vh !important;
			}
		}
	}
</style>