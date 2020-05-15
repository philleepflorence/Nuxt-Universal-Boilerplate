<template>
	<aside class="form-resources bg-content animated fadeInUpSmall">
		<slot name="header">
			<header class="form-resources pt-4 pl-4" v-if="header">
				<p class="fancy fancy-left">
					<span class="text-gray" v-html="icons.resources.icon.icon"></span>
				</p>
			</header>
		</slot>
		<div class="form-resources">
			<ul class="list-group list-group-flush">
				
				<li class="list-group-item position-relative transition p-0" 
					v-for="(row, index) in resources" 
					v-bind:key="`${ index }-resources`">
					<div class="list-group-container position-relative">
						<div class="position-relative p-4">							
							<p class="font-weight-book mb-2">{{ row.title }}</p>
							<div class="p mb-2 d-none" v-html="row.description"></div>
							<footer class="text-muted d-flex align-items-center no-gutters">
								<p class="col-10 text-truncate small font-weight-book mb-0">{{ row.url }}</p>
								<span class="col-2 text-right" v-html="icons.link.icon.icon"></span>
							</footer>
						</div>
						<a class="list-group-anchor position-absolute position-full bg-primary" href="row.url" target="_blank"></a>
					</div>
				</li>
				
			</ul>
		</div>
	</aside>
</template>

<script>
	import { get } from 'lodash';	
	import ComponentUIImageLoader from "~/components/core/ui/ImageLoader.vue";	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "Resources",
		props: [
			'resources',
			'header'
		],
		components: {
			'app-component-ui-image-loader': ComponentUIImageLoader
		},
		computed: {
			icons () {
				return this.$store.state.api.icons;
			}
		},
		methods: {
			headline (input) {
				if (input) input = input.split('-').join(' ');
				
				return input;
			},
			image (input) {
				return get(input, 'image.name');
			}
		},
		data () {
			return {
				
			};
		}
	}
</script>

<style lang="less">
	aside.form-resources {
		.list-group-item {			
			.list-group-anchor {
				opacity: 0;
			}
		}
	}
	
	[data-device-control="mouse"] {
		aside.form-resources {
			.list-group-item:hover,
			.list-group-item:active {
				.list-group-anchor {
					opacity: 0.05;
				}
			}
		}		
	}
</style>