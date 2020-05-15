<template>
	<div class="page-container" v-bind:key="keys.page">
		<app-component-wrappers-page v-bind:page="page" v-bind:background="true" v-bind:contents="page.contents" v-bind:synopsis="page.synopsis" v-bind:subnavigation="subnavigation" v-bind:fluid="true">
		
			<template v-slot:header>
				<div class="position-absolute position-full" v-bind:key="keys.header" @click="reloadPage" v-if="image">
					<app-component-ui-image-loader 
						v-bind:src="image.name" 
						size="cdn" 
						format="background" 
						classname="position-absolute position-full bg-cover-center bg-cover-dark-md"
						container="position-absolute position-full"
						v-if="image.name">
					</app-component-ui-image-loader>
					<app-component-ui-image-loader 
						v-bind:src="image.url" 
						format="background" 
						classname="position-absolute position-full bg-cover-center bg-cover-dark-md"
						container="position-absolute position-full"
						v-else-if="image.url">
					</app-component-ui-image-loader>
				</div>
			</template>
				
			<template v-slot:head>
		
				<section class="p lead px-4 py-6 text-center bg-primary text-white animated fadeIn" v-if="content" v-bind:key="keys.head">
					<h3 class="font-weight-book">{{ content.user.name }}</h3>
					<h6 class="font-weight-book" data-before-content="@">{{ content.user.username }}</h6>
					<p class="font-weight-book">{{ content.user.permission.name }}</p>
					<nav class="py-3" v-if="privilege < 2">
						<a v-bind:href="`mailto:${ content.user.email }`" class="d-inline-block" target="_blank">
							<button class="plain bg-black-20 h-50px w-50px rounded-circle text-white" v-html="icons.send.email.icon.icon"></button>
						</a>
					</nav>
				</section>
			
			</template>
		
			<template v-slot:contents>
			
				<app-component-pages-loader v-if="loading" v-bind:page="page"></app-component-pages-loader>
								
				<div class="profile-components-content" v-bind:key="keys.content" v-if="content">
				
					<app-component-profile-information v-bind:user="content.user" v-bind:labels="labels" v-if="section == 'profile'"></app-component-profile-information>
					
					<app-component-profile-forms v-bind:user="content.user" v-else-if="section == 'forms'"></app-component-profile-forms>
					
					<app-component-profile-notifications v-bind:user="content.user" v-else-if="section == 'notifications'"></app-component-profile-notifications>
					
					<app-component-profile-permissions v-bind:user="content.user" v-else-if="section == 'permissions'"></app-component-profile-permissions>
				
				</div>
							
			</template>
			
		</app-component-wrappers-page>
	</div>
</template>

<script>
	import { cloneDeep, forEach, get, size } from 'lodash';
	import moment from 'moment';
	
	import Page from "~/helpers/core/page.js";	
			
	import ComponentPagesLoader from "~/components/core/pages/Loader.vue";
	import ComponentPagesListGroup from "~/components/core/pages/ListGroup.vue";
	import ComponentProfileForms from "~/components/core/profile/Forms.vue";
	import ComponentProfileInformation from "~/components/core/profile/Information.vue";
	import ComponentProfileNotifications from "~/components/core/profile/Notifications.vue";	
	import ComponentProfilePermissions from "~/components/core/profile/Permissions.vue";	
	import ComponentUIImageLoader from "~/components/core/ui/ImageLoader.vue";	
	import ComponentWrappersPage from "~/components/core/wrappers/Page.vue";
	
	export default {
		name: "PageProfile",
		components: {
			'app-component-pages-loader': ComponentPagesLoader,
			'app-component-pages-list-group': ComponentPagesListGroup,
			'app-component-profile-forms': ComponentProfileForms,
			'app-component-profile-information': ComponentProfileInformation,
			'app-component-profile-notifications': ComponentProfileNotifications,
			'app-component-profile-permissions': ComponentProfilePermissions,
			'app-component-ui-image-loader': ComponentUIImageLoader,
			'app-component-wrappers-page': ComponentWrappersPage
		},
		data () {
			return {
				content: null,
				keys: {
					content: Page.utils.rand(),
					head: Page.utils.rand(),
					header: Page.utils.rand(),
					page: Page.utils.rand(),
					profile: Page.utils.rand()
				},
				loading: false
			};
		},
		computed: {
			configuration () {
				return this.$store.state.api.config;
			},
			icons () {
				return this.$store.state.api.icons;
			},
			image () {
				return get(this.content, 'user.image');
			},
			labels () {
				return this.page.labels;
			},
			page () {
				return Page.get(this.pages, true, 'profile');
			},
			pages () {
				return this.$store.state.api.pages;
			},
			path () {
				return this.$route.path;
			},
			privilege () {
				let username = get(this.$store.state.user, 'username');
				
				if (this.username === username) return 2;
				
				if (username) return 1;
				
				return 0;
			},
			rows () {
				if (!this.content || !this.content.user) return null;
				
				let rows = cloneDeep(this.labels.headline.label);
				let formats = get(this.configuration, 'application.format');
				
				forEach(rows, (row) => {
					let property = row.property || row.slug;
					let content = get(this.content.user, property);
					let format = Page.utils.datetime(content);
						content = format && formats[format] ? moment(content).format(formats[format]) : content;
											
					if (this.privilege >= row.privilege.privilege) row.content = content;
				});
				
				return rows;
			},
			section () {
				if (this.$route.params.section) return this.$route.params.section;
				
				return 'profile';
			},
			subnavigation () {
				let username = get(this.$store.state.user, 'username');
				let navigation = this.$store.state.api.navigation;
				
				if (this.username === username) return navigation.accounts;
				
				return null;
			},
			user () {
				if (this.$store.state.app.profile) return this.$store.state.app.profile;
				
				return this.$store.state.user;
			},
			username () {
				let username = get(this.$route.params, 'username');
				
				if (username) return username;
				
				return get(this.$store.state.user, 'username');
			}
		},
		methods: {
			formatDatetime (input) {
				let format = get(this.configuration, 'application.format.datetime');
				
				if (input && format) return moment(input).format(format);
				
				return input;
			},
			async loadProfile () {
				if (window.DEBUG) console.log("debug - app.pages.user.profile.loadProfile - username", this.username);
				
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
				
				if (window.DEBUG) console.log("debug - app.pages.user.profile.loaded - user", user.id);
				
				if (!user || !user.id) return window.$nuxt.error({statusCode: 404, message: '--' });
				
				this.content = this.content || {};
				
				this.content.user = user;
				
				this.loading = false;
				
				this.$store.commit('app/SET', {
					key: "profile",
					data: user
				});
				
				return this.content;
			},
			reloadPage () {
				this.keys.page = Page.utils.rand();
			}
		},
		created () {
			if (!this.content && this.privilege === 2) this.content = { user: this.user };
		},
		mounted () {		
			if (window.DEBUG) console.log("debug - app.pages.user.profile.mounted - section", this.section);			
			
			if (!this.loading) this.loadProfile();
		}
	}
</script>

<style lang="less" scoped>	
	
	@import '../../assets/styles/mixins/mixins.less';
	
	.profile-list-group {
		& + .profile-list-group {
			border-top: 1px solid @mainbordercolor;
		}
	}
</style>