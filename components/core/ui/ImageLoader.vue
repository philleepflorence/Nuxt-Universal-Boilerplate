<template>
	<div v-bind:key="keys.wrapper" v-bind:class="parent">
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
		props: [
			'src', 
			'size', 
			'format', 
			'callback',
			'container', 
			'classname', 
			'visible', 
			'preview', 
			'height', 
			'width'
		],
		computed: {
			parent () {
				let container = this.container;
				
				if (!container && this.format === 'background') {
					container = "position-absolute position-full";
				}
				else if (!container && this.format === 'image') {
					container = "d-block";
				}
				
				return container;
			},
			options () {
				return this.$store.state.api.config.application.cdn.images;
			},
			rendered () {
				return this.$store.state.app.rendered;
			},
			ratio () {
				if (this.width && this.height) return this.height / this.width;
				
				return 0;
			}			
		},
		methods: {
			done () {
				if (typeof this.$props.callback === "function") {
					this.$store.commit('event/SET', ["image:loaded", "ImageLoader", this.src]);
					this.$props.callback(this.$el)
				}
				if (this.ratio) {
					this.$el.style.minHeight = '';
				}
			},
			load () {
				let elements = this.$el.querySelectorAll('[data-image-load]');
				
				if (this.ratio && this.$el.offsetWidth) {
					let height = this.$el.offsetWidth * this.ratio;
					
					this.$el.style.minHeight = `${ height }px`;
				}
				
				Image.load(this.options, elements, (len) => {
					this.done();
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
			if (!this.rendered) {
				const subscription = this.$store.subscribe((mutation, state) => {
					if (mutation.payload.key === 'rendered') {												
						this.load();						
						setTimeout(subscription, 300);
					}												
				});	
			}
			else {
				this.load();
			}
			
			if (this.visible === "true") {
				const infinite = this.$store.subscribe((mutation, state) => {
					if (mutation.payload.key === 'infinite') {												
						this.load();						
						setTimeout(infinite, 300);
					}												
				});
			}
		}
	}
</script>