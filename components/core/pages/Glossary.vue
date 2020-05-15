<template>
	<aside class="form-glossary animated fadeInUpSmall">
		<header class="form-glossary mt-5 pr-4" v-if="header">
			<p class="fancy fancy-right">
				<span class="text-gray" v-html="icons.glossary.icon.icon"></span>
			</p>
		</header>
		<section class="form-glossary pt-4 mb-2 bg-content" 
			v-for="(section, key) in glossary" 
			v-bind:key="key">
			<h5 class="text-muted px-4 fancy fancy-left"><span>{{ headline(key) }}</span></h5>
			<ul class="list-group list-group-flush">
				<li class="list-group-item px-4 position-relative transition" 
					v-for="(row, index) in section" 
					v-bind:key="`${ key }-${ row.slug }-glossary`">
					<p class="font-weight-book mb-2">{{ row.name }}</p>
					<div class="p" v-html="row.description"></div>
					<footer class="text-muted text-right" 
						v-if="row.path" 
						v-html="icons.link.icon.icon">
					</footer>
					<nuxt-link class="list-group-anchor position-absolute position-full bg-primary" v-bind:to="row.path"></nuxt-link>
				</li>
			</ul>
		</section>
	</aside>
</template>

<script>
	import _ from 'lodash';	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "Glossary",
		props: [
			'glossary',
			'header'
		],
		computed: {
			icons () {
				return this.$store.state.api.icons;
			}
		},
		methods: {
			headline (input) {
				if (input) input = input.split('-').join(' ');
				
				return input;
			}
		},
		data () {
			return {
				
			};
		}
	}
</script>

<style lang="less">
	aside.form-glossary {
		section.form-glossary {
			.list-group-item {
				.list-group-anchor {
					opacity: 0;
				}
			}
		}
	}
	
	[data-device-control="mouse"] {
		aside.form-glossary {
			section.form-glossary {
				.list-group-item:hover,
				.list-group-item:active {
					.list-group-anchor {
						opacity: 0.05;
					}
				}
			}
		}		
	}
</style>