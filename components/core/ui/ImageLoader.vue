<template>
	<div v-bind:key="keys.wrapper">
		<figure 
			v-bind:class="classname" 
			v-bind:data-image-format="format" 
			v-bind:data-image-size="size" 
			v-bind:data-image-load="src" 
			v-bind:data-image-visible="visible"
			v-bind:key="keys.figure" 
			v-if="format === 'background'">
			<slot></slot>
		</figure>
		<img
			v-bind:class="classname" 
			v-bind:data-image-format="format" 
			v-bind:data-image-size="size" 
			v-bind:data-image-load="src" 
			v-bind:data-image-visible="visible"
			v-bind:key="keys.figure" 
			v-else-if="format === 'image'">
	</div>
</template>

<script>
	import _ from 'lodash';
	import Image from "~/helpers/core/image.js";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "ImageLoader",
		props: ['src', 'size', 'format', 'classname', 'visible', 'preview'],
		computed: {
			options () {
				return this.$store.state.api.config.application.cdn.images;
			}			
		},
		methods: {
			done () {
				if (window.DEBUG) console.log("debug - app.components.core.ui.ImageLoader.done", this.src);
			},
			load () {
				let elements = this.$el.querySelectorAll('[data-image-load]');
				
				Image.load(this.options, elements, (len) => {
					this.done(len);
				});
			}
		},
		data () {
			return {
				keys: {
					figure: Page.utils.rand(),
					wrapper: Page.utils.rand()
				}
			};
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.ImageLoader.mounted", this.src);
			
			this.load();	
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.ImageLoader.updated", this.src);
			
			this.load();
		}
	}
</script>

<style lang="less">
	
</style>