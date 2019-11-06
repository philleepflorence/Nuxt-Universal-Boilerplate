<template>
	<div class="ui-ripple position-absolute position-full overflow-hidden cursor-hand" v-on:click="onclick" v-bind:key="keys.element">
		<slot></slot>
		<span class="ui-ripple-span position-absolute d-block"></span>
	</div>
</template>

<script>
	import _ from 'lodash';	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "RippleClick",
		props: [
			'background'
		],
		methods: {
			onclick (e) {
				if (window.DEBUG) console.log("debug - app.components.core.ui.RippleClick.onclick", e.offsetX, e.offsetY);
				
				this.$element.classList.remove('active');
				
				this.$element.style.width = this.$element.style.height = Math.max(this.$el.offsetWidth, this.$el.offsetHeight) + 'px';
				
				this.$element.style.left = (e.offsetX - this.$element.offsetWidth / 2) + 'px';
			    this.$element.style.top = (e.offsetY - this.$element.offsetHeight / 2) + 'px';
			    
			    this.$element.classList.add('active');
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.RippleClick.mounted");
			
			this.$element = this.$el.querySelector('.ui-ripple-span');
			
			if (typeof this.background === 'string') this.$element.style.backgroudColor = this.background;
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	.ui-ripple {
		.ui-ripple-span {
			background-color: rgba(100, 100, 100, 0.3);
			border-radius: 50% !important;
			transform: scale(0);
			
			&.active {
				animation:ripple 0.65s linear !important;
			}
		}
	}
	
	@keyframes ripple {
		100% {
			opacity: 0; 
			transform: scale(2.5);
		}
	}
	
</style>