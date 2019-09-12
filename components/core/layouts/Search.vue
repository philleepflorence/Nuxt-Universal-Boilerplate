<template>
	<div id="search" class="options-overlay position-fixed position-full bg-dark off" role="app search" v-bind:key="keys.element">
		<a href="#" class="position-absolute position-full" v-on:click.prevent.stop="close"></a>
		<div class="page-search-container position-fixed position-full d-flex align-items-center pointer-events-none">
			<div class="page-search-content page-search-form pointer-events-auto max-w-640px w-90 spacer mx-auto transition">
				<header class="share-contents-header spacer t-delay">
					<span 
						class="d-flex align-items-center justify-content-center bg-white text-secondary h-70px w-70px mx-auto rounded-circle" 
						v-html="labels.app.button.options.search.icon.icon">
					</span>
				</header>
				<p class="page-search-hint p lead text-white text-center t-delay">{{ input.hint }}</p>
				<div class="page-search-form-row position-relative shadow-sm t-delay">
					<b-form-input 
						class="page-search-input position-relative text-dark text-center lead bg-white-80 h-50px w-100 font-weight-book"
						type="text" 
						v-bind:placeholder="input.plaintext"
						name="query" 
						v-bind:value="search.query"
						autocomplete="off"
						v-on:keyup.enter="onsearch"
						ref="searchInput">
					</b-form-input>
					<button 
						class="plain bg-white-50 h-50px w-50px rounded-circle position-absolute position-right position-top text-primary shadow-sm" 
						v-html="icons.settings.complete.icon.icon" 
						v-on:click.prevent.stop="onsearch">
					</button>					
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import Handlebars from 'handlebars/dist/handlebars.min.js';
	import { forEach as __forEach, get as __Get, cloneDeep as __cloneDeep, trimEnd as __trimEnd } from "lodash";
	
	export default {
		name: "SearchOverlay",
		computed: {
			basepath () {
				return this.$store.state.api.config.application.search.base;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			input () {
				return this.$store.state.api.labels.app.form['search-overlay'].search;
			},
			labels () {
				return this.$store.state.api.labels;
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
			close (e) {
				this.$emit('close', 'share');
			},
			onsearch (e) {
				let $element = this.$el.querySelector('input.page-search-input');
				
				this.$refs.searchInput.blur();
				
				if ($element.value) {
					this.run($element.value);
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
			},
			run (query) {
				let path = __trimEnd(this.basepath, '/');
				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.run", query, path);				
				
				if (query.length) {
					query = query.replace(/\s/g, '+');
					
					this.$router.push({
						path: `${ path }/#!/search/${ query }`
					});
				}
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.mounted");	
			
			this.$router.afterEach((to, from) => {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.afterEach", to.path, from.path);
				
				this.render(to);
			});	
			
			this.render();	
			
			this.$store.subscribe((mutation, state) => {
				if (mutation.type === 'app/SET' && mutation.payload.key === "app:search:overlay") {
					if (typeof mutation.payload.data === "string") this.run(mutation.payload.data);						
				}												
			});
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	#search[role="app search"] {
		width: 100% !important;
		
		.page-search-container {			
			.page-search-content {				
				.page-search-input {
					border: none;
					border-radius: 30px !important;
					padding: 0 1rem;
					text-overflow: ellipsis;
				}
			}		
		}
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.page-search-container {
				.t-delay {
					opacity: 0;
					transform: translateY(5rem);
				}
			}
			
			.pointer-events-auto {
				pointer-events: none !important;
			}		
		}
	}
</style>