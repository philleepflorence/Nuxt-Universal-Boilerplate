<template>
	<div v-bind:class="classname" role="no scroll"  v-bind:key="keys.element">
		<slot></slot>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "PreventScroll",
		props: [
			'classname'
		],
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		methods: {
			add () {
				document.body.addEventListener('touchmove', this.scroll, { passive: false });
				window.addEventListener('wheel', this.scroll, { passive: false });
			},
			remove () {
				document.body.removeEventListener('touchmove', this.scroll, { passive: false });
				window.removeEventListener('wheel', this.scroll, { passive: false });
			},
			scroll (e) {
				if (e) {
					e.stopPropagation();
					e.preventDefault();
					e.returnValue = false;
					
					return false;					
				}
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.PreventScroll.mounted");
			
			this.$el.addEventListener('mouseenter', this.add);	
			this.$el.addEventListener('touchstart', this.add);
					
			this.$el.addEventListener('mouseleave', this.remove);
			this.$el.addEventListener('touchend', this.remove);
		},
		beforeDestroy () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.PreventScroll.beforeDestroy");
			
			this.$el.removeEventListener('mouseenter', this.add);	
			this.$el.removeEventListener('touchstart', this.add);
					
			this.$el.removeEventListener('mouseleave', this.remove);
			this.$el.removeEventListener('touchend', this.remove);
		}
	}
</script>