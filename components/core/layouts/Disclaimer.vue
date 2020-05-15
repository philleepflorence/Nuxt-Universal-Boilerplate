<template>
	<div id="disclaimer" class="pointer-events-none position-fixed position-bottom pointer-events-none" role="app disclaimer" v-bind:key="keys.element">
		
		<app-component-ui-prevent-scroll classname="disclaimer-container position-fixed position-full pointer-events-none animated fadeIn pointer-events-auto" v-if="display()">
			
			<button class="plain position-absolute position-full" v-on:click="onClick"></button>
			
			<div class="position-fixed position-bottom w-100 text-white d-flex justify-content-center text-left pointer-events-auto p-1 shadow">
				<div class="disclaimer-content flex-grow-1 mx-auto cursor-hand animated fadeInUpSmall a-delay" v-on:click="onClick">
					<div class="p bg-primary py-3 d-flex align-items-center">
						<div class="flex-grow-1 border-right border-disclaimer-content py-1 px-4" v-html="display().value"></div>
						<div class="flex-grow-0 px-4" v-html="display().icon.icon"></div>
					</div>
				</div>
			</div>
			
		</app-component-ui-prevent-scroll>
		
	</div>
</template>

<script>
	import { get } from "lodash";
	
	import ComponentUIPreventScroll from "~/components/core/ui/PreventScroll.vue";
	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "DisclaimerLayoutsComponent",
		components: {
			'app-component-ui-prevent-scroll': ComponentUIPreventScroll
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				loaded: null,
				installed: null
			};
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			labels () {
				return this.$store.state.api.labels;
			},
			version () {
				return get(this.configuration.application, "app.version");
			}
		},
		methods: {	
			display () {
				let loaded = window.localStorage.getItem('app:loaded');	
				let gdpr = window.localStorage.getItem('app:gdpr');
				let version = window.localStorage.getItem('app:version');
				let format = get(this.configuration, 'components.display');
				let $gdpr = get(this.labels, "content.disclaimer.gdpr");
				let $update = get(this.labels, "content.disclaimer.update");
				let string = '';
				
				if ($gdpr && !gdpr) {
					string = $gdpr.value;
					
					if (string && format) string = Page.utils.format(string, format);
					
					return {
						name: 'gdpr',
						value: string,
						icon: $gdpr.icon
					};
				}
				else if (this.loaded && $update && this.version !== version) {
					string = $update.value;
					
					if (string && format) string = Page.utils.format(string, format);
					
					return {
						name: 'update',
						value: string.replace('{{version}}', this.version),
						icon: $update.icon
					};
				}
				else return null;			
			},		
			onClick (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Disclaimer.onClick");
				
				e.preventDefault();
				
				const href = e.target.getAttribute('href');
				
				if (href && href.charAt(0) === '/') {
					this.$router.push({
						path: href
					});
				}
				else if (href) {
					window.location.href = href;
				}
				else if (this.display().name === "gdpr") {
					window.localStorage.setItem('app:gdpr', Date.now());
					
					this.keys.element = Page.utils.rand();
				}
				else if (this.display().name === "update") {
					window.localStorage.setItem('app:version', this.version);
					
					window.location.reload(true);
				}
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Disclaimer.mounted");
			
			this.installed = window.localStorage.getItem('app:installed');
			this.loaded = window.localStorage.getItem('app:loaded');
			
			if (window.location.search.indexOf('source=pwa') && !this.installed) window.localStorage.setItem('app:installed', Date.now());
			
			if (!this.loaded) window.localStorage.setItem('app:loaded', Date.now());
			else if (this.version) window.localStorage.setItem('app:version', this.version);		
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#disclaimer[role="app disclaimer"] {
		.disclaimer-container {
			background-image: linear-gradient(fade(black, 0), fade(black, 65));
			
			.disclaimer-content {
				
				div.p {
					p:not(:last-child) {
						margin-bottom: 0.5rem;
					}
					
					.border-disclaimer-content {
						border-color: fade(white, 30) !important;
					}
				}				
				a {
					border-bottom: 1px solid white; 
					display: inline-block;
					
					&:hover, &:active, &:visited {
						color: white;
					}
				}
				* {
					font-weight: 500 !important;
				}
				
				@media (min-width: @breakpoint-md) {
					max-width: 540px !important;
				}
			}
		}		
	}
</style>