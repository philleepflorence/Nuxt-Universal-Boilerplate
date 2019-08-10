<template>
	<div id="legacy-browser" class="position-fixed position-full bg-primary animated fadeIn d-flex align-items-center" role="app legacy-browser" v-bind:key="keys.element">
		<div class="legacy-browser-content position-relative text-center text-white flex-grow-1">
			<div class="p animated fadeInUpSmall a-delay max-w-768px mx-auto spacer" v-html="contents.value"></div>
			<nav class="legacy-browser-navigation animated fadeInUpSmall a-delay mt-4 spacer transition">
				<a class="legacy-browser-anchor mx-2 text-white-hover text-white-active" v-bind:href="browser.url" target="_blank" v-for="browser in browsers" v-html="browser.icon.icon"></a>
			</nav>
		</div>	
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "LegacyBrowser",
		computed: {
			browsers () {
				return this.$store.state.api.icons.browsers;
			},
			contents () {
				return this.$store.state.api.labels.app.browser.contents.legacy;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#legacy-browser[role="app legacy-browser"] {
		.legacy-browser-content {
			.p {
				p {
					font-size: 1.25rem;
				}
				b {
					display: inline-block;
				}
			}
			.legacy-browser-navigation {
				.legacy-browser-anchor {
					i.mdi {
						font-size: 48px;
					}
					&:hover, &:active {
						opacity: 0.8;
					}
				}
			}
		}
	}
</style>