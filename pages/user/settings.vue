<template>
	<div class="page-container" v-bind:key="keys.page">
		<PageWrapper v-bind:page="page" v-bind:background="true" v-bind:contents="page.contents" v-bind:synopsis="page.synopsis" v-bind:subnavigation="subnavigation">
		
			<template v-slot:contents>
			
				<div class="plain-form form-line bg-white p-4 mb-2">
					<Form 
						v-if="section == 'profile'"
						v-bind:id="`${ form.slug }-form`" 
						v-bind:formname="form.slug"
						v-bind:inputs="inputs.inputs"
						v-bind:button="inputs.submit"
						v-bind:path="endpoint" 
						v-bind:defaults="content" 
						options="true" 
						clearonsuccess="true" 
						autocomplete="off"
						data-tooltip-container="width">
							
						<template v-slot:hidden>
							<input type="hidden" class="input" name="form.id" v-bind:value="content.user.id">
							<input type="hidden" class="input" name="form.template" v-bind:value="form.template">
							<input type="hidden" class="input" name="redirect" v-bind:value="redirect">
						</template>
																						
					</Form>
				</div>
							
			</template>
			
		</PageWrapper>
	</div>
</template>

<script>
	import { get } from 'lodash';
	import moment from 'moment';
	
	import Page from "~/helpers/core/page.js";	
		
	import Form from "~/components/core/forms/Form.vue";	
	import Loader from "~/components/core/pages/Loader.vue";
	import PageWrapper from "~/components/core/wrappers/Page.vue";
	
	export default {
		name: "PageProfileSettings",
		components: {
			Form,
			Loader,
			PageWrapper
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			endpoint () {
				return this.$store.state.app.endpoints.user.settings;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			form () {
				return get(this.$store.state.api.forms, 'settings-profile');
			},
			inputs () {
				let form = get(this.forms, 'settings-profile');
				
				let inputs = Page.inputs(this.form.inputs);
				
				return inputs;
			},
			labels () {
				return this.page.labels;
			},
			page () {
				return Page.get(this.pages, true, 'settings-profile');
			},
			pages () {
				return this.$store.state.api.pages;
			},
			path () {
				return this.$route.path;
			},
			redirect () {
				return get(this.$store.state.api.redirects, 'route.settings.url');
			},
			section () {
				if (!this.content) return null;
				
				if (this.$route.params.section) return this.$route.params.section;
				
				return 'profile';
			},
			subnavigation () {
				let navigation = this.$store.state.api.navigation;
				
				if (navigation && "accounts" in navigation) return navigation.accounts;
				
				return null;
			},
			username () {
				return get(this.$store.state.user, 'username');
			}
		},
		methods: {
			async load () {
				if (window.DEBUG) console.log("debug - app.pages.user.settings.load");
				
				this.loading = true;
				
				let user = await this.$store.dispatch('contents/LOAD', {
					url: '/api/auth/user',
					collection: 'users',
					query: {
						form: {
							username: {
								eq: this.username
							}
						}
					},
					cache: false
				});
				
				if (window.DEBUG) console.log("debug - app.pages.user.settings.loaded");
				
				if (!user || !user.id) return window.$nuxt.error({statusCode: 404, message: '--' });
				
				this.content = {
					user: user
				};
				
				this.loading = false;
				
				this.keys.page = Page.utils.rand();
				
				return this.content;
			}
		},
		async asyncData ({ params, error, req, store, route, from }) {
			if (req && req.contents) {
				return {
					content: req.contents
				};
			}			
		},
		data () {
			return {
				content: null,
				keys: {
					form: Page.utils.rand(),
					page: Page.utils.rand()
				}
			};
		},
		mounted () {		
			if (window.DEBUG) console.log("debug - app.pages.user.settings.mounted");
			
			if (!this.content && !this.loading) this.load();
		}
	}
</script>