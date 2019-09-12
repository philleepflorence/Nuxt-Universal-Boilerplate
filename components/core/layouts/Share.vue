<template>
	<div id="share" class="options-overlay position-fixed position-full bg-dark off" role="app share" v-bind:key="keys.element">
		<a href="#" class="position-absolute position-full" v-on:click.prevent.stop="close"></a>
		<div class="share-container d-flex position-absolute position-full align-items-center justify-content-center pointer-events-none" v-if="buttons">
			<section class="d-flex-item position-relative">
				<header class="share-contents-header spacer transform t-delay">
					<span 
						class="d-flex align-items-center justify-content-center bg-white text-secondary h-70px w-70px mx-auto rounded-circle" 
						v-html="labels.app.button.options.share.icon.icon">
					</span>
				</header>
				<div class="share-row max-w-600px w-100 row no-gutters justify-content-center mx-auto">
					<a class="share-anchor col-lg-4 col-sm-6 t-delay pointer-events-auto transition"
						v-for="nav in buttons"
						v-bind:href="nav.url"
						v-bind:key="nav.id"
						target="_blank">
						<div class="bg-primary px-2 py-4 text-center text-white">
							<button class="plain bg-white-40 h-40px w-40px rounded-circle text-primary" v-html="nav.icon.icon"></button>
							<p class="p lead pt-3">{{ nav.description }}</p>
						</div>
					</a>
				</div>
				
			</section>
		</div>
		<footer class="share-footer position-absolute position-bottom w-100 spacer" v-if="description">
			<p class="p lead text-center text-white">{{ description }}</p>
		</footer>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import Handlebars from 'handlebars/dist/handlebars.min.js';
	import { forEach as __forEach, get as __Get, cloneDeep as __cloneDeep } from "lodash";
	
	export default {
		name: "ShareOverlay",
		computed: {
			configuration () {
				return this.$store.state.api.config.application;
			},
			description () {
				return __Get(this.labels, 'app.button.options.share.hint');
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
			close (e) {
				this.$emit('close', 'share');
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Share.render");
				
				let description = document.querySelector('[name="share:description"]').getAttribute('content');
				let title = document.querySelector('[name="share:title"]').getAttribute('content');
				let image = document.querySelector('[name="share:image"]').getAttribute('content');
				let url = window.location.href.replace('/#!/share', '');
				let buttons = __Get(this.icons, 'social.share');
					buttons = buttons ? __cloneDeep(buttons) : buttons;
				
				let data = {
					title: title,
					description: description,
					image: image,
					url: url
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
	
	#share[role="app share"] {
		.share-container {
			.share-row {
				padding: 1px;
				
				.share-anchor {
					padding: 1px;
				}
			}		
		}
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.share-container {
				.share-row {
					.t-delay {
						opacity: 0;
						transform: translateY(150%);
					}
				}
			}
			
			.pointer-events-auto {
				pointer-events: none !important;
			}
		}
	}
</style>