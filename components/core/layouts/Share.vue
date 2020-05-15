<template>
	<div id="share" class="options-overlay position-fixed position-full bg-overlay off" role="app share" v-bind:key="keys.element">
		
		<app-component-ui-prevent-scroll classname="position-fixed position-full">
		
			<a href="#" class="position-absolute position-full" v-on:click.prevent.stop="onClickClose"></a>
			
			<div class="share-container d-flex position-absolute position-full align-items-center justify-content-center pointer-events-none" v-if="buttons">
				<section class="d-flex-item position-relative max-w-640px mx-auto">
					
					<header class="share-header pointer-events-auto transition t-delay" v-if="header">
						<app-component-ui-image-loader
							size="cdn"
							format="background"
							classname="position-absolute position-full"
							container="bg-primary position-relative p-letterbox xs"
							v-bind:src="header.image">
							<div class="position-absolute position-full share-header-content d-flex align-items-end text-white">
								<section class="flex-grow-1 spacer">
									<h4 class="text-capitalize">{{ header.title }}</h4>
									<p class="p font-weight-book">{{ header.description }}</p>
								</section>
							</div>
						</app-component-ui-image-loader>					
					</header>
					
					<header class="share-contents-header spacer transition t-delay" v-else>
						<span 
							class="d-flex align-items-center justify-content-center bg-white text-secondary h-70px w-70px mx-auto rounded-circle" 
							v-html="labels.button.options.share.icon.icon">
						</span>
					</header>
					
					<div class="share-row w-100 row no-gutters justify-content-center" v-if="content">
						<a class="share-anchor col-lg-4 col-6 t-delay pointer-events-auto transition"
							v-for="nav in buttons"
							v-bind:href="nav.url"
							v-bind:key="nav.id"
							target="_blank">
							<div class="bg-primary px-2 py-4 text-center text-white">
								<input type="text" class="position-fixed share-anchor-input" v-bind:value="nav.url">
								<button class="plain bg-white-30 h-40px w-40px rounded-circle text-primary" v-html="nav.icon.icon"></button>
								<p class="p font-weight-book pt-3 d-none d-md-block">{{ nav.description }}</p>
							</div>
						</a>
						<a class="share-anchor col-12 t-delay pointer-events-auto transition"
							v-if="clipboard"
							v-bind:href="url"
							v-on:click.stop.prevent="copy">
							<div class="share-anchor-button bg-primary px-2 py-4 text-center text-white">
								<input type="text" class="position-fixed share-anchor-input" v-bind:value="url">
								<button class="plain bg-white-30 h-40px w-40px rounded-circle text-primary" v-html="clipboard.icon.icon"></button>
								<p class="p font-weight-book pt-3 d-none d-md-block">{{ clipboard.description }}</p>
							</div>
						</a>
					</div>
					
				</section>
			</div>
			<footer class="share-footer position-absolute position-bottom w-100 spacer" v-if="description">
				<p class="p lead text-center text-white">{{ description }}</p>
			</footer>
		</app-component-ui-prevent-scroll>
		
	</div>
</template>

<script>
	import { cloneDeep, forEach, get } from "lodash";
	
	import ComponentUIPreventScroll from "~/components/core/ui/PreventScroll.vue";
	import ComponentUIImageLoader from "~/components/core/ui/ImageLoader.vue";
	
	import Page from "~/helpers/core/page.js";
		
	export default {
		name: "ShareLayoutComponent",
		components: {
			'app-component-ui-image-loader': ComponentUIImageLoader,
			'app-component-ui-prevent-scroll': ComponentUIPreventScroll
		},
		computed: {
			clipboard () {
				if (!document.execCommand) return null;
				
				return get(this.$store.state.api.icons, 'social.copy.clipboard');
			},
			configuration () {
				return this.$store.state.api.config.application;
			},
			description () {
				return get(this.labels, 'button.options.share.hint');
			},			
			icons () {
				return this.$store.state.api.icons;
			},
			labels () {
				return this.$store.state.api.labels;
			},
			metadata () {
				return this.$store.state.app.metadata;
			},
			pages () {
				return this.$store.state.api.pages;
			},
			url () {
				return window.location.href;								
			}
		},
		data () {
			return {
				buttons: null,
				content: null,
				header: null,
				keys: {
					element: Page.utils.rand()
				},
				rendered: false
			};
		},
		methods: {
			onClickClose (e) {
				this.$emit('close', 'share');
			},
			copy (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Share.copy");
				
				let input = e.currentTarget.querySelector('.share-anchor-input');
				
				if (document.execCommand) {
					input.select();
					input.setSelectionRange(0, 99999);
					
					document.execCommand("copy");
				}
			},
			render (path, metadata) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Share.render");
				
				path = path || this.$route.path;
				metadata = metadata || this.$store.state.app.metadata[this.$route.path];
				
				if (!path || !metadata) return false;
				
				let description = metadata.meta.filter( (row) => row.hid === "share:description" ).map( (row) => row.content ).shift();
				let imagename = metadata.meta.filter( (row) => row.hid === "share:image:name" ).map( (row) => row.content ).shift();
				let imageurl = metadata.meta.filter( (row) => row.hid === "share:image" ).map( (row) => row.content ).shift();
				let title = metadata.title;
			
				let buttons = get(this.icons, 'social.share');
					buttons = buttons ? cloneDeep(buttons) : buttons;
					
				let data = {
					title: title,
					description: description,
					image: imageurl,
					url: this.url
				};
				
				this.content = {...data};
				
				forEach(data, (row, property) => {
					if (row) data[`${ property }_encoded`] = encodeURI(row);
				});
				
				if (title && imagename) {
					this.header = {
						image: imagename,
						title: title,
						description: description
					};
				}
				else this.header = null;
				
				if (buttons) {
					forEach(buttons, (button) => {
						button.url = Page.template(button.url, data);
					});
					
					this.buttons = buttons;					
					this.rendered = true;
				}
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Share.mounted");
			
			this.$store.subscribe((mutation, state) => {
				if (mutation.type === 'app/METADATA') {
					this.render(this.$route.path, mutation.payload.data);
				}												
			});	
			
			this.render();	
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#share[role="app share"] {
		.share-container {
			.share-header {
				padding: 0 2px;
				
				.share-header-content {
					background-image: linear-gradient(fade(black, 0), fade(black, 65));
				}
			}			
			.share-row {
				padding: 1px;
				
				.share-anchor {
					padding: 1px;
				}
			}
			.share-anchor-input {
				right: 200vw;
				top: 200vh;
			}
			.text-black-opacity {
				color: fade(black, 20);
			}
			.t-delay {
				transition-duration: 660ms !important;
			}		
		}
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.share-container {
				.t-delay {
					opacity: 0;
					transform: translateY(8rem);
				}
			}
			
			.pointer-events-auto {
				pointer-events: none !important;
			}
		}
	}
</style>