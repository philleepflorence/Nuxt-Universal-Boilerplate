<template>
	<div id="search" class="options-overlay position-fixed position-full bg-dark bg-overlay off" role="app search" v-bind:key="keys.element">
		<div class="search-overlay-container position-absolute position-full">
			<CustomScroll name="search">
				<a href="#" class="position-fixed position-full pointer-events-auto" v-on:click.prevent.stop="close"></a>
				<div class="page-search-container position-relative vh-100 d-flex pointer-events-none">
					<div class="page-search-content page-search-form pointer-events-auto max-w-640px w-90 spacer mx-auto transition t-delay">
						<header class="page-search-contents-header spacer t-delay search-animation">
							<span 
								class="d-flex align-items-center justify-content-center bg-white text-secondary h-70px w-70px mx-auto rounded-circle" 
								v-html="labels.app.button.options.search.icon.icon">
							</span>
						</header>
						
						<p class="page-search-hint p lead text-white text-center">{{ input.hint }}</p>
						
						<div class="page-search-inline position-relative text-center spacer font-weight-book" v-if="modes">
							<b-form-group>
								<b-form-radio-group 
									id="page-search-search-options"
									v-model="form.mode"
									v-bind:options="modes"
									name="page-search-search-options">
								</b-form-radio-group>
							</b-form-group>
						</div>	
										
						<div class="page-search-form-row position-relative shadow-sm">
							<b-form-input 
								class="page-search-input page-inline-input position-relative text-dark text-left lead bg-white-80 h-50px w-100 font-weight-book"
								type="text" 
								v-bind:placeholder="input.plaintext"
								name="query" 
								v-bind:value="search.query"
								autocomplete="off"
								v-on:keyup.enter="onsearch"
								ref="searchInput">
							</b-form-input>
							<button 
								class="page-search-button page-inline-button plain bg-primary rounded-circle position-absolute position-right position-top text-white shadow-sm" 
								v-html="icons.settings.complete.icon.icon" 
								v-on:click.prevent.stop="onsearch">
							</button>					
						</div>
						
						<div class="page-search-form-row position-relative pt-4 text-white animated fadeIn a-delay" v-if="total">
							<div class="p lead bg-white-10 px-3 py-3" v-html="information"></div>				
						</div>
						
						<div class="page-search-form-row position-relative pt-4 text-white animated fadeIn a-delay" v-if="suggestions">
							<div class="bg-white-10 px-3 py-3">
								<div class="lead p" v-html="labels.app.content['search-overlay'].suggestions.value"></div>
								<nav class="pt-4 text-capitalize">
									<button class="plain text-primary mr-4 mb-2 p-0 d-inline-block text-capitalize font-weight-book" v-for="(row, index) in meta.suggestions" v-bind:key="`${ index }-suggestions`" v-on:click.stop.prevent="suggestion">{{ row.name }}</button>
								</nav>
							</div>				
						</div>
						
						<div class="page-search-form-row position-relative pt-4 pb-6 animated fadeIn a-delay" v-if="results">
							<nuxt-link class="text-white mb-1 d-block bg-white-10 px-3 py-2 animated fadeInUpSmall a-delay" v-bind:to="`/${ row.slug }`" v-for="(row, index) in results" v-bind:key="`${ row.slug }-${ index }-row`">
								<p class="p lead sm mb-1 text-capitalize" v-html="row.title"></p>
								<p class="p mb-0 empty opacity-70" v-html="row.description"></p>
								<small class="font-weight-book opacity-50">{{ row.category }}</small>
							</nuxt-link>												
						</div>
						
						<div class="page-search-form-row position-relative pt-4 pb-6 text-white animated fadeIn a-delay" v-else-if="empty">
							<div class="p lead bg-white-10 px-3 py-3" v-html="labels.app.content['search-overlay'].empty.value"></div>				
						</div>
						
					</div>
				</div>
			</CustomScroll>
		</div>
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import CustomScroll from "~/components/core/ui/CustomScroll.vue";
	import Handlebars from 'handlebars/dist/handlebars.min.js';	
	import PageListGroup from "~/components/core/pages/ListGroup.vue";	
	import _ from "lodash";
	
	export default {
		name: "SearchOverlay",
		components: {
			CustomScroll,
			PageListGroup
		},
		computed: {
			basepath () {
				return this.$store.state.api.config.application.search.base;
			},
			dropdowns () {
				return this.$store.state.api.dropdowns;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			information () {
				let string = this.labels.app.content['search-overlay'].results.value;
				
				return string.replace("{{ query }}", this.form.query).replace("{{ total }}", this.meta.total).replace("{{ loaded }}", this.loaded);
			},
			input () {
				return this.$store.state.api.labels.app.form['search-overlay'].search;
			},
			labels () {
				return this.$store.state.api.labels;
			},
			modes () {
				let dropdowns = _.get(this.dropdowns, 'search.mode');
				
				if (!dropdowns) return null;
				
				_.forEach(dropdowns, (dropdown) => {
					if (!this.form.mode && dropdown.default === 1) this.form.mode = dropdown.value;
				});
				
				return dropdowns;
			},
			suggestions () {
				let suggestions = _.get(this.meta, 'suggestions');
				
				if (!suggestions || !suggestions.length) return null;
				
				return suggestions;
			},
			total () {
				return _.get(this.meta, 'total');
			}
		},
		data () {
			return {
				empty: false,
				form: {
					mode: null,
					query: null
				},
				keys: {
					element: Page.utils.rand()
				},
				loaded: 0,
				loading: false,
				meta: null,
				overlay: process.env.APP_SEARCH_OVERLAY,
				search: {},
				results: null
			};
		},
		methods: {
			close (e) {
				this.$emit('close', 'search');
			},
			count (rows) {
				return Array.isArray(rows) ? rows.length : 0;
			},
			headline (index) {
				return index.charAt(0).toUpperCase() + index.slice(1);
			},
			async load () {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.load");
				
				let currtime = Date.now();
				
				this.loading = true;
				
				let content = await this.$store.dispatch('contents/LOAD', {
					url: `/api/app/search`,
					collection: 'search',
					query: {
						mode: this.form.mode,
						query: this.form.query
					}
				});
				
				this.loading = false;
				
				this.loaded = Date.now() - currtime;
				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.loaded", content);
				
				if (!_.get(content, 'meta.total')) {
					this.empty = true;
					this.meta = null;
					this.results = null;
				}
				else {
					setTimeout(() => {
						this.$store.commit('event/SET', ['content:loaded', 'search']);
					}, 100);
					
					this.meta = _.get(content, 'meta');
					this.results = _.get(content, 'data');
				}
				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.loaded");					
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
				let path = _.trimEnd(this.basepath, '/');
				
				this.form.query = query;
				
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.run", query, path);				
				
				if (query.length) {
					query = query.replace(/\s/g, '+');
					query = this.form.mode ? `/${ this.form.mode }/${ query }` : query;
					
					if (this.overlay) {
						this.load();
					}
					else {
						this.$router.push({
							path: `${ path }/#!/search/${ query }`
						});
					}						
				}
			},
			suggestion (e) {
				if (window.DEBUG) console.log("debug - app.components.core.layouts.Search.suggestion");
				
				let value = e.target.innerHTML;
								
				this.search.query = value;
				
				this.run(value);
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
			padding-top: 40vh;
						
			.page-search-content {				
				.page-search-input {
					border: none;
					border-radius: 30px !important;
					padding: 0 2rem;
					text-overflow: ellipsis;
				}
				.page-search-button {
					width: 44px;
					height: 44px;
					margin: 3px;
				}
			}		
		}
		&.off {
			opacity: 0;
			pointer-events: none;
			
			.page-search-container {
				.t-delay {
					opacity: 0 !important;
					transform: translateY(30vh) !important;
				}
			}
			
			.pointer-events-auto {
				pointer-events: none !important;
			}		
		}
	}
</style>