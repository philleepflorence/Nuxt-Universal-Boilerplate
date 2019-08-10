<template>
	<div id="search" class="options-overlay position-fixed position-top off" role="app search" v-bind:key="keys.element">
		<div class="search-container position-fixed position-top w-100">
			<aside 
				class="page-search-form position-fixed position-top position-right animated fadeInUp h-70px shadow" 
				data-tooltip-container="width">
				<b-form-input 
					class="page-search-input position-relative text-white text-right font-accent bg-gray-90 h-100 w-100"
					type="text" 
					v-bind:placeholder="input.plaintext"
					name="query" 
					v-bind:value="search.query"
					v-b-tooltip:page-search-form.bottom.focus 
					v-bind:title="input.hint"
					autocomplete="off"
					v-on:keyup.enter="onsearch">
				</b-form-input>
			</aside>
		</div>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import Handlebars from 'handlebars/dist/handlebars.min.js';
	import { forEach as __forEach, get as __Get, cloneDeep as __cloneDeep, trimEnd as __trimEnd } from "lodash";
	
	export default {
		name: "Search",
		computed: {
			basepath () {
				return this.$store.state.api.config.application.search.base;
			},
			input () {
				return this.$store.state.api.labels.app.form['search-overlay'].search;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				search: {}
			};
		},
		methods: {
			onsearch (e) {
				let $element = this.$el.querySelector('input.page-search-input');
				let query = $element.value;
				let path = __trimEnd(this.basepath, '/');
				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.onsearch", query, path);
				
				if (query.length) {
					query = query.replace(/\s/g, '+');
					
					this.$router.push({
						path: `${ path }/#!/search/${ query }`
					});
				}
			},
			render (to) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.render");
				
				let location = to || window.location;
				
				this.search = {};
				
				if (location.hash.length && location.hash.indexOf('search') > 0) {
					
					let hash = location.hash.replace('#!/', '').split('/');
					
					this.search = {
						mode: hash[0],
						query: hash[1]
					};
				}
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.mounted");	
			
			this.$router.afterEach((to, from) => {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.afterEach", to, from);
				
				this.render(to);
			});	
			
			this.render();	
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#search[role="app search"] {
		width: 100% !important;
		
		.search-container {
			width: 100% !important;
			
			.page-search-form {
				width: 100% !important;
				z-index: 10;
				
				.page-search-input {
					border: none;
					padding: 0 1rem;
					text-overflow: ellipsis;
				}
				
				.tooltip {
					margin-left: -5px !important;
					
					.tooltip-inner {
						text-align: right !important;
					}
				}
			}		
		}
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.search-container {
				.page-search-form {
					transform: translateY(-100%);
				}
			}
			
			
		}
	}
</style>