<template>
	<div v-bind:data-editor-container="id">
		<b-form-group 
			v-bind:id="`form-group-${ id }`"
			v-bind:label="label" 
			v-bind:label-for="id" 
			class="form-no-label">
			<b-form-textarea 
				class="input form-control form-medium-editor" 
				v-bind:id="id" 
				v-bind:placeholder="placeholder" 
				v-bind:v-model="model" 
				v-bind:name="model" 
				v-b-tooltip.focus v-bind:title="title"
				data-content-mode="block" 
				v-bind:data-after-content="labels.editor.plaintext" 
				v-html="value"
				v-bind="attributes">
			</b-form-textarea>
		</b-form-group>		
	</div>
</template>

<script>
import Page from "~/helpers/core/page.js";

export default {
	name: 'MediumEditor',
	components: {},
	computed: {
		cdn () {
			return this.$store.state.api.config.application.cdn.url;
		},
		labels () {
			return this.$store.state.api.labels.app.form.medium;
		}
	},
	data () {
		return {
			ID: this.$props.id,
			text: this.$props.title
		};
	},
	mounted () {
		/*
			Clone of medium.com inline editor toolbar.
			http://yabwe.github.io/medium-editor/
		*/
		Page.require([
			`${ this.cdn }/vendors/medium-editor/dist/css/medium-editor.min.css`,
			`${ this.cdn }/vendors/medium-editor/dist/css/themes/beagle.min.css`,
			`${ this.cdn }/vendors/medium-editor/dist/js/medium-editor.min.js`
		], 
		this.$store, 
		(paths, error) => {
			if (window.MediumEditor) this.render();
		});
	},
	beforeDestroy () {
		this.Editor = document.getElementById(this.ID);
		
		if (this.Editor && this.Editor.editor) this.Editor.editor = null;
	},
	methods: {
		render () {
			this.Editor = document.getElementById(this.ID);
			this.EditorContainer = document.querySelector(`[data-editor-container="${ this.ID }"]`);
			
			if (this.Editor.getAttribute('data-medium-editor-rendered')) return false;
			
			this.Editor.editor = new MediumEditor(this.Editor, 
			{
				autoLink: false,
				anchorPreview: false,
				placeholder: {
					text: this.text,
					hideOnClick: true
				},
				targetBlank: true,
				toolbar: {
					buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'orderedlist', 'unorderedlist', 'image'],
					relativeContainer: this.EditorContainer
				}
			});
			
			this.Editor.setAttribute('data-medium-editor-rendered', Date.now());
			
			this.Editable = this.Editor.editor.elements[0];
			
			this.resize();
			
			this.Editor.editor.subscribe('editableInput', function (data, editable)
			{
				if (editable) {
					this.Editor.value = editable.innerHTML;
				};
												
				clearTimeout(this.Editor.inputTimer);
				
				this.Editor.inputTimer = setTimeout(function ()
				{
					resize(editable);
				}, 
				500);
			});
		},
		resize () {
			if (this.Editable.scrollHeight > this.Editable.offsetHeight) {
				this.Editable.style.minHeight = this.Editable.scrollHeight
			}
		}
	},
	props: ['id', 'placeholder', 'model', 'label', 'title', 'attributes', 'value']
}
</script>

<style lang="less"></style>