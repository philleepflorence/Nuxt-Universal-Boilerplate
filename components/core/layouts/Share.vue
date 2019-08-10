<template>
	<div id="share" class="options-overlay position-fixed position-full bg-gray-90 off" role="app share" v-bind:key="keys.element">
		<div class="share-container position-relative position-absolute position-center" v-if="buttons">
			<button 
				class="plain bg-white text-primary h-50px w-50px position-absolute position-center animated fadeIn"
				v-html="labels.app.button.options.share.icon.icon">
			</button>
			<a class="position-relative transform" 
				v-bind:href="nav.url" 
				v-for="nav in buttons" 
				v-bind:key="nav.id"
				target="_blank"
				data-on-circle="share">
				<button 
					class="plain bg-primary bg-primary-active bg-secondary-hover text-white h-50px w-50px"
					v-html="nav.icon.icon"
					v-b-tooltip.hover v-bind:title="nav.description">
				</button>
			</a>
		</div>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import Handlebars from 'handlebars/dist/handlebars.min.js';
	import { forEach as __forEach, get as __Get, cloneDeep as __cloneDeep } from "lodash";
	
	export default {
		name: "Share",
		computed: {
			configuration () {
				return this.$store.state.api.config.application;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			labels () {
				return this.$store.state.api.labels;
			}
		},
		data () {
			return {
				buttons: null,
				keys: {
					element: Page.utils.rand()
				},
				rendered: false
			};
		},
		methods: {
			circle () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Share.circle");
				
				let $buttons = this.$el.querySelectorAll('[data-on-circle="share"]');
				let len = $buttons.length;
				let size = 50;
				let circlesize = 300;
				let angle = ( 360 / len );
				
				if (len) {
					__forEach($buttons,  (button, index) => {
						let rotate = Math.ceil( index * angle );
						
						button.style.transform = `rotate(${ rotate * 1 }deg) translate(${ circlesize / 2 }px) rotate(-${ rotate * 1 }deg)`;
					});
				}
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Share.render");
				
				let description = document.querySelector('[name="share:description"]').getAttribute('content');
				let title = document.querySelector('[name="share:title"]').getAttribute('content');
				let image = document.querySelector('[name="share:image"]').getAttribute('content');
				let buttons = __Get(this.icons, 'social.share');
					buttons = buttons ? __cloneDeep(buttons) : buttons;
				
				let data = {
					title: title,
					description: description,
					image: image,
					url: window.location.href
				};
				
				__forEach(data, (row, property) => {
					if (row) data[`${ property }_encoded`] = encodeURI(row);
				});
				
				if (buttons) {
					__forEach(buttons, (button) => {
						let template = Handlebars.compile(button.url);
						
						button.url = template(data);
					});
					
					this.buttons = buttons;
					
					this.rendered = true;
					
					setTimeout(() => { this.circle() }, 300);
				}
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Share.mounted");
			
			this.render();			
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Share.updated");
			
			if (!this.rendered) this.render();	
		},
		watch: {
			$route (to, from) {
				this.rendered = false;
				
				this.render();
			}
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	@circle-size: 300px;
	@item-size: 50px;
	
	#share[role="app share"] {
		.share-container {
			width:  @circle-size;
			height: @circle-size;
			padding: 0;
			border-radius: 50%; 
			list-style: none;       
  
			[data-on-circle] 
			{
				border-radius: 50%; 
				display: block;
				position: absolute !important;
				top:  50%; 
				left: 50%;
				width:  @item-size;
				height: @item-size;
				margin: -(@item-size / 2);
				transition-duration: 900ms !important;
		    }
				
			button {
				border-radius: 50% !important; 
			}			
		}
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.share-container {
				[data-on-circle] {
					opacity: 0 !important;
					transform: rotate(0) translate(0) rotate(0) !important;
				}
			}
		}
	}
</style>