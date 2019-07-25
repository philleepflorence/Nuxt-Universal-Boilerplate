<template>
	<div data-file-container>
		<b-form-group 
			v-bind:key="key" 
			v-bind:id="`form-group-${ id }`" 
			v-bind:label="label" 
			v-bind:label-for="id" 
			class="form-no-label">
			<b-form-file 
				class="input form-control" 
				v-bind:id="id" 
				v-bind:placeholder="placeholder" 
				v-bind:name="model"
				v-bind:state="Boolean(file)" 
				v-model="file"
				v-b-tooltip.hover v-bind:title="title" 				 
				v-on:input="onChange"
				v-bind="attributes">
			</b-form-file>
		</b-form-group>
		<footer class="form-file-details animated fadeIn" v-show="updated">
			<b-form-input 
				class="form-file-input"
				v-bind:id="`form-${ id }-file-title`" 
				type="text" 
				v-on:input="onTitle"
				v-bind:placeholder="`${ labels.title.plaintext } - ${ label }`"
				v-model="fileTitle" 
				v-b-tooltip.focus v-bind:title="labels.title.hint">
			</b-form-input>
			<b-form-textarea 
				class="form-file-input"
				v-bind:id="`form-${ id }-file-caption`" 
				v-bind:placeholder="`${ labels.caption.plaintext } - ${ label }`"
				v-on:input="onCaption"
				v-model="fileCaption" 
				v-b-tooltip.focus v-bind:title="labels.caption.hint">
			</b-form-textarea>
		</footer>
	</div>
</template>

<script>
import Page from "~/helpers/core/page.js";

export default {
	name: 'FileInput',
	components: {},
	computed: {
		labels () {
			return this.$store.state.api.labels.app.form.file;
		}
	},
	data () {
		return {
			fileID: this.$props.id,
			key: 0,
			file: {},
			fileTitle: '',
			fileCaption: '',
			updated: false
		};
	},
	props: ['id', 'label', 'placeholder', 'model', 'attributes', 'title'],
	methods: {
		onChange (e) {
			this.input = document.getElementById(this.fileID);
			
			let max = this.input.parentNode.getAttribute('max');
			
			if (max && Number(max) < this.file.size) {
				this.key += 1;
				return false;
			}
			
			var reader  = new FileReader();
			
			reader.addEventListener('load', () => {
				this.input.parentNode.setAttribute('data-file-url', reader.result);
				this.input.parentNode.setAttribute('data-file-size', this.file.size);
				this.input.parentNode.setAttribute('data-file-type', this.file.type);
				this.input.parentNode.setAttribute('data-file-name', this.file.name);
				this.input.parentNode.setAttribute('data-name', this.input.name);
				
				this.updated = true;
			});
			
			if (this.file.size) reader.readAsDataURL(this.file);
		},
		onCaption () {
			this.input = document.getElementById(this.fileID);
			
			this.input.parentNode.setAttribute('data-file-caption', this.fileCaption);
		},
		onTitle () {
			this.input = document.getElementById(this.fileID);
			
			this.input.parentNode.setAttribute('data-file-title', this.fileTitle);
		}
	}
}
</script>

<style lang="less" scoped>
[data-file-container] {
	input.form-file-input {
		margin-bottom: 0.6rem;
	}
	textarea.form-file-input {
		height: 5rem !important;
		resize: none;
		overflow: hidden;
	}
}
</style>