<template>
	<div class="page-list-group d-flex">
		<div class="flex-grow-0 text-muted cursor-hand" v-on:click="toggle">
			<div class="page-list-group-button" v-show="collapsed" v-html="icons.plus.icon.icon"></div>
			<div class="page-list-group-button" v-show="expanded" v-html="icons.minus.icon.icon"></div>
		</div>
		<section class="flex-grow-1 pl-2">
			<header class="page-list-header p lead cursor-hand position-relative" v-html="format(headline)" v-on:click="toggle" v-bind:data-after-content="count"></header>
			<div class="position-relative animated fadeIn" v-show="expanded">
				<div class="p font-weight-book mt-2" v-html="format(content)"></div>
				<footer class="position-relative">
					<slot></slot>
				</footer>
			</div>
		</section>	
		
	</div>
</template>

<script>
	import _ from 'lodash';	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "ListGroup",
		props: [
			'headline',
			'content',
			'count'
		],
		computed: {
			icons () {
				return this.$store.state.api.icons;
			}
		},
		methods: {
			format (string) {
				let format = _.get(this.$store.state.api.config, 'components.display');
				
				if (format) return Page.utils.format(string, format);
				
				return string;
			},
			toggle () {
				if (this.expanded) {
					this.expanded = false;
					this.collapsed = true;
				}
				else if (this.collapsed) {
					this.expanded = true;
					this.collapsed = false;
				}
			}
		},
		data () {
			return {
				expanded: false,
				collapsed: true
			};
		}
	}
</script>

<style lang="less">	
	
	@import '../../../assets/styles/mixins/mixins.less';
	
	.page-list-group {
		.page-list-group-button {
			padding: 0.1rem;
		}
		.page-list-header {
			padding-right: 2rem;
			
			&:after {
				position: absolute;
				right: 0.5rem;
			}
		}
	}
</style>