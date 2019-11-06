<template>
	<div id="contact" class="options-overlay position-fixed position-full bg-gray-70 off" role="app contact" v-bind:key="keys.element">
		<div class="contact-container position-absolute position-full">
			<CustomScroll name="contact">
				<a href="#" class="position-fixed position-full pointer-events-auto" v-on:click.prevent.stop="close"></a>
				<div class="position-relative contact-wrapper d-flex align-items-center vh-100 vh-fixed pointer-events-auto">
					<div class="contact-parent max-w-480px mx-auto py-10">
						<div class="flex-item w-100">
							<header class="contact-contents-header spacer transform t-delay">
								<span 
									class="d-flex align-items-center justify-content-center bg-white text-secondary h-70px w-70px rounded-circle mx-auto" 
									v-html="labels.app.button.options.contact.icon.icon">
								</span>
							</header>
							<section class="contact-contents plain-form w-100 bg-dark bg-overlay spacer transform t-delay">
								<Contact name="contact-overlay"></Contact>
							</section>
						</div>						
					</div>
				</div>
			</CustomScroll>
		</div>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import Form from "~/components/core/forms/Form.vue";
	import Contact from "~/components/core/forms/Contact.vue";
	import CustomScroll from "~/components/core/ui/CustomScroll.vue";
	import _ from "lodash";
	
	export default {
		name: "ContactOverlay",
		props: [
		
		],
		components: {
			Contact,
			CustomScroll,
			Form
		},
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
				keys: {
					element: Page.utils.rand()
				},
				rendered: false
			};
		},
		methods: {
			close (e) {
				this.$emit('close', 'contact');
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Contact.mounted");	
		},
		updated () {			
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Contact.updated");
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	@circle-size: 300px;
	@item-size: 50px;
	
	#contact[role="app contact"] {
		
		.contact-parent {
			width: 96vw;
		}
		
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.contact-wrapper {			
				.contact-contents,
				.contact-contents-header {
					transform: translateY(20vh);
					opacity: 0;
				}
			}
			
			.pointer-events-auto {
				pointer-events: none !important;
			}
		}
	}
</style>