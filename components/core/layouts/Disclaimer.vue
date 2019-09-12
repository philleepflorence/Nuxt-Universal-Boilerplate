<template>
	<div id="disclaimer" class="pointer-events-none position-fixed position-bottom" role="app disclaimer" v-bind:key="keys.element">
		
		<aside class="disclaimer-container position-fixed position-full pointer-events-none animated fadeIn" v-if="display()">
		
			<div class="position-fixed position-bottom w-100 bg-primary text-white d-flex justify-content-center pointer-events-auto animated fadeInUpSmall">
				<div class="disclaimer-content p lead spacer flex-grow-1 cursor-hand" v-if="display() === 'gdpr'" v-html="gdpr" v-on:click.stop.prevent="onclick"></div>
				<div class="disclaimer-content p lead spacer flex-grow-1 cursor-hand" v-if="display() === 'update'" v-html="update" v-on:click.stop.prevent="onclick"></div>
				<button class="plain spacer text-white" v-html="icons.toggle.options.close.icon.icon" v-on:click.stop.prevent="onclick"></button>
			</div>
			
		</aside>
		
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import { forEach as __forEach, get as __Get } from "lodash";
	
	export default {
		name: "Disclaimer",
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			gdpr () {
				return __Get(this.configuration.application, "disclaimer.gdpr");
			},
			icons () {
				return this.$store.state.api.icons;
			},
			update () {
				return __Get(this.configuration.application, "disclaimer.update");
			},
			version () {
				return __Get(this.configuration.application, "app.version");
			}
		},
		methods: {
			display () {
				let gdpr = window.localStorage.getItem('app:gdpr');
				let version = window.localStorage.getItem('app:version');
				
				if (!gdpr) return 'gdpr';
				else if (this.version !== version) return 'update';
				else return null;
			},
			onclick (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Disclaimer.onclick");
				
				if (this.display() === "gdpr") {
					window.localStorage.setItem('app:gdpr', Date.now());
					
					this.keys.element = Page.utils.rand();
				}
				else if (this.display() === "update") {
					window.localStorage.setItem('app:version', this.version);
					
					window.location.reload(true);
				}
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Disclaimer.mounted");			
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#disclaimer[role="app disclaimer"] {
		.disclaimer-container {
			background-image: linear-gradient(fade(black, 0), fade(black, 65));
			
			.disclaimer-content {
				a {
					border-bottom: 1px solid white; 
					
					&:hover, &:active, &:visited {
						color: white;
					}
				}
			}
		}		
	}
</style>