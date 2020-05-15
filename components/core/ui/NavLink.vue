<template>
	<a v-bind:href="path" v-bind="attributes" v-bind:class="classname" v-if="anchor">
		<slot></slot>
	</a>
	<nuxt-link v-bind:to="path" v-bind="attributes" v-bind:data-index="index" v-bind:class="classname" v-else>
		<slot></slot>
	</nuxt-link>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "ComponentNavLink",
		props: [
			'classname',
			'index',
			'internal', 
			'nav'
		],
		computed: {
			anchor () {
				return !this.nav.internal && !this.internal;
			},
			attributes () {
				let attributes = {};
				
				if (this.nav.internal || this.internal) {
					attributes['to'] = this.path;
				}
				else if (this.path.indexOf(this.domain) === 0) {
					attributes['href'] = this.nav.path;
					attributes['target'] = "_self";
				}
				else {
					attributes['href'] = this.path;
					attributes['target'] = "_blank";
				}
				
				return attributes;
			},
			domain () {
				return process.env.SERVER_DOMAIN || window.location.origin;
			},
			path () {
				if (this.nav.url) return this.nav.url;
				
				return this.nav.path;
			}
		}
	}
</script>