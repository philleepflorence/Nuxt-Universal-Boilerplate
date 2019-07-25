<template>
	<nuxt-link v-bind:to="nav.path" v-bind="attributes(nav)" v-bind:data-index="index" v-bind:class="classname">
		<slot></slot>
	</nuxt-link>
</template>

<script>
	import _ from 'lodash';	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "NavLink",
		props: ['nav', 'index', 'classname'],
		computed: {
			domain () {
				return process.env.SERVER_DOMAIN || window.location.origin;
			}
		},
		methods: {
			attributes (nav) {
				let attributes = {};
				
				if (nav.internal) {
					attributes['to'] = nav.path;
				}
				else if (nav.path.indexOf(this.domain) === 0) {
					attributes['href'] = nav.path;
					attributes['target'] = "_self";
				}
				else {
					attributes['href'] = nav.path;
					attributes['target'] = "_blank";
				}
				
				return attributes;
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