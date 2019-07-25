<template>
	<div>
		<UserWrapper v-bind:content="content">
			<section class="max-w-540px mx-auto my-4 bg-white" v-if="content.user">
				<header class="position-relative">
					<ImageLoader 
						classname="bg-cover-center p-letterbox m-0 w-100" 
						format="background" 
						size="cdn" 
						v-bind:src="page.image.name">
					</ImageLoader>
					<div class="bg-primary profile-image border border-white border-width-3 mx-auto w-150px h-150px">
						<ImageLoader 
							classname="bg-cover-center w-150px h-150px" 
							format="background" 
							v-bind:src="image.thumbnail_url" 
							v-if="image">
						</ImageLoader>
					</div>
				</header>
				<div class="p spacer text-center">
					<h2 class="text-primary">{{ content.user.name }}</h2>
					<h6 class="text-muted font-weight-book" data-before-content="@">{{ content.user.username }}</h6>
					<p class="mb-4">{{ content.user.permission.name }}</p>
					<div class="small empty font-weight-book mb-3" v-if="content.user.telephone">
						<span class="text-primary" v-html="icons.telephone.icon.icon"></span>
						<p>{{ content.user.telephone }}</p>
					</div>
					<div class="small empty font-weight-book mb-3" v-if="content.user.email">
						<span class="text-primary" v-html="icons.email.icon.icon"></span>
						<p>{{ content.user.email }}</p>
					</div>
					<div class="small empty font-weight-book mb-3" v-if="content.user.location">
						<span class="text-primary" v-html="icons.location.icon.icon"></span>
						<p>{{ content.user.location }}</p>
					</div>
					<div class="small empty font-weight-book mb-3" v-if="content.user.last_login">
						<span class="text-primary" v-html="icons.user.login.icon.icon"></span>
						<p>{{ content.user.last_login }}</p>
					</div>
					<div class="small empty mb-3 font-weight-book" v-html="content.user.bio"></div>
				</div>
			</section>
		</UserWrapper>
	</div>
</template>

<script>	
	import _ from 'lodash';		
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";
	import Form from "~/components/core/forms/Form.vue";
	import Page from "~/helpers/core/page.js";
	import UserWrapper from "~/components/core/wrappers/User.vue";
	
	export default {
		name: "UserProfileComponent",
		components: {
			Form, UserWrapper, ImageLoader
		},
		props: ['user'],
		computed: {
			icons () {
				return this.$store.state.api.icons;
			},
			image () {
				return _.get(this.content, 'user.image');
			},
			labels () {
				return this.$store.state.api.labels;
			},
			page () {
				return Page.get(this.pages, this.$route.path);
			},
			pages () {
				return this.$store.state.api.pages;
			},
			path () {
				return this.$route.path;
			}
		},
		data () {
			return {
				content: {
					user: this.$props.user
				}
			};
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.app.pages.UserProfile.mounted");
		},
		updated () {
			if (window.DEBUG) console.log("debug - app.components.app.pages.UserProfile.updated");
		}
	}
</script>

<style lang="less" scoped>
	.profile-image {
		margin-top: -75px;
		box-sizing: content-box;
	}
</style>