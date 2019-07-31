<template>
	<div id="error" class="v-100 bg-dark text-white" v-if="error">
		<div class="d-flex vh-100 align-items-center">
			<section class="mx-auto max-w-640px spacer text-center animated fadeInUpSmall">
				<header class="py-4">
					<span class="bg-white d-inline-flex w-60px h-60px justify-content-center align-items-center text-primary rounded-circle" v-html="template.icon.icon"></span>
				</header>
				<div class="p mb-4" v-html="template.template"></div>
				<div class="lead" v-if="error.message" v-html="error.message"></div>
			</section>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "Error",
		props: ['error'],
		data () {
			return {
				content: {}
			};
		},
		computed: {
			template () {
				let templates = this.$store.state.api.templates.error;
				
				let index = typeof this.error === "number" ? this.error : this.error.statusCode;
				
				let template = _.get(templates, index || 500);
				
				return template;
			}
		}
	}
</script>

<style lang="less">
	html {
		body {
			#error {
				a {
					text-decoration: underline;
					font-weight: 500;
					text-transform: uppercase;
					
					&:hover, &:active {
						color: inherit !important;
					}
				}			
			}
		}
	}	
</style>