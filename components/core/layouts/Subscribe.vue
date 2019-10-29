<template>
	<div id="subscribe" class="options-overlay position-fixed position-full bg-dark bg-overlay off" role="app subscribe" v-bind:key="keys.element">
		<PreventScroll classname="position-fixed position-full">
			<a href="#" class="position-absolute position-full" v-on:click.prevent.stop="close"></a>
			<div class="page-subscribe-container position-fixed position-full d-flex align-items-center pointer-events-none">
				<div class="page-subscribe-content page-subscribe-form pointer-events-auto max-w-540px w-90 spacer mx-auto transition text-center t-delay">
					<section class="page-subscribe-header spacer transform t-delay">
						<header class="share-contents-header spacer transform t-delay">
							<span 
								class="d-flex align-items-center justify-content-center bg-white text-secondary h-70px w-70px mx-auto rounded-circle" 
								v-html="labels.app.button.options.subscribe.icon.icon">
							</span>
						</header>
						<div class="position-relative page-subscribe-form-container t-delay">
							<Subscribe name="subscribe-overlay"></Subscribe>
						</div>
					</section>
					
				</div>
			</div>
		</PreventScroll>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import PreventScroll from "~/components/core/ui/PreventScroll.vue";
	import Handlebars from 'handlebars/dist/handlebars.min.js';
	import Subscribe from "~/components/core/forms/Subscribe.vue";
	import _ from "lodash";
	
	export default {
		name: "SubscribeOverlay",
		components: {
			Subscribe,
			PreventScroll
		},
		computed: {
			icons () {
				return this.$store.state.api.icons;
			},
			labels () {
				return this.$store.state.api.labels;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		methods: {
			close (e) {
				this.$emit('close', 'subscribe');
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Subscribe.mounted");
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#subscribe[role="app subscribe"] {		
		.page-subscribe-container {			
			.page-subscribe-content {				
				
			}		
		}
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.page-subscribe-container {
				.t-delay {
					opacity: 0;
					transform: translateY(5rem);
				}
			}
			
			.pointer-events-auto {
				pointer-events: none !important;
			}		
		}
	}
</style>