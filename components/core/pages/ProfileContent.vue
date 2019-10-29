<template>
	<div class="d-flex align-items-center min-h-100" v-bind:key="keys.element">
		<div class="flex-item flex-grow-1 spacer">
			<p class="profile-content-label font-weight-book font-accent text-lowercase small text-muted ls-1px">{{ label }}</p>
			<div class="profile-content-contents p lead" v-bind:data-placeholder="placeholder" v-html="content"></div>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "ProfileContent",
		props: [
			'label', 
			'placeholder', 
			'content'
		],
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		}
	}
</script>