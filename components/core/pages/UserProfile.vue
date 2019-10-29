<template>
	<div>
		<UserWrapper v-bind:content="content">
			<section class="max-w-960px mx-auto my-4 bg-white" v-if="content.user">
				<header class="position-relative bg-primary">
					<ImageLoader 
						classname="bg-cover-center p-letterbox m-0 w-100"
						container="position-relative" 
						format="background" 
						size="cdn" 
						v-bind:src="page.image.name">
					</ImageLoader>
					<div class="position-relative bg-primary profile-image border border-white border-width-3 mx-auto w-150px h-150px">
						<ImageLoader 
							classname="bg-cover-center w-150px h-150px" 
							format="background" 
							v-bind:src="image.thumbnail_url" 
							v-if="image">
						</ImageLoader>
					</div>
				</header>
				<section class="p spacer text-center bg-primary text-white">
					<h2 class="font-weight-book">{{ content.user.name }}</h2>
					<h6 class="font-weight-book" data-before-content="@">{{ content.user.username }}</h6>
					<p class="font-weight-book">{{ content.user.permission.name }}</p>
					<nav class="py-3">
						<a v-bind:href="`mailto:${ content.user.email }`" class="d-inline-block" target="_blank">
							<button class="plain bg-black-20 h-50px w-50px rounded-circle text-white" v-html="icons.send.email.icon.icon"></button>
						</a>
					</nav>
				</section>
				<div class="row no-gutters">
					<div class="col-lg-7 border-right-lg br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.first_name"
							v-bind:label="headlines.first_name.plaintext"
							v-bind:placeholder="headlines.first_name.hint">
						</ProfileContent>
					</div>
					<div class="col-lg-5 br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.last_name"
							v-bind:label="headlines.last_name.plaintext"
							v-bind:placeholder="headlines.last_name.hint">
						</ProfileContent>
					</div>
				</div>
				<div class="row no-gutters">
					<div class="col-lg-5 border-right-lg br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.username"
							v-bind:label="headlines.username.plaintext"
							v-bind:placeholder="headlines.username.hint">
						</ProfileContent>
					</div>
					<div class="col-lg-7 br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.email"
							v-bind:label="headlines.email.plaintext"
							v-bind:placeholder="headlines.email.hint">
						</ProfileContent>
					</div>
				</div>
				<div class="row no-gutters">
					<div class="col-lg-7 border-right-lg br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.permission.name"
							v-bind:label="headlines.privilege.plaintext"
							v-bind:placeholder="headlines.privilege.hint">
						</ProfileContent>
					</div>
					<div class="col-lg-5 br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.telephone"
							v-bind:label="headlines.telephone.plaintext"
							v-bind:placeholder="headlines.telephone.hint">
						</ProfileContent>
					</div>
				</div>
				<div class="row no-gutters">
					<div class="col-lg-5 border-right-lg br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.location"
							v-bind:label="headlines.location.plaintext"
							v-bind:placeholder="headlines.location.hint">
						</ProfileContent>
					</div>
					<div class="col-lg-7 br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.bio"
							v-bind:label="headlines.bio.plaintext"
							v-bind:placeholder="headlines.bio.hint">
						</ProfileContent>
					</div>
				</div>
				<div class="row no-gutters">
					<div class="col-lg-7 border-right-lg br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.formatted.login"
							v-bind:label="headlines.last_login.plaintext"
							v-bind:placeholder="headlines.last_login.hint">
						</ProfileContent>
					</div>
					<div class="col-lg-5 br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.formatted.created"
							v-bind:label="headlines.created.plaintext"
							v-bind:placeholder="headlines.created.hint">
						</ProfileContent>
					</div>
				</div>
				<div class="row no-gutters" v-if="authorized">
					<div class="col-lg-5 border-right-lg br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.notifications_frequency"
							v-bind:label="headlines.notifications_frequency.plaintext"
							v-bind:placeholder="headlines.notifications_frequency.hint">
						</ProfileContent>
					</div>
					<div class="col-lg-7 br-primary border-bottom">
						<ProfileContent
							v-bind:content="content.user.secret_question"
							v-bind:label="headlines.secret_question.plaintext"
							v-bind:placeholder="headlines.secret_question.hint">
						</ProfileContent>
					</div>
				</div>
			</section>
		</UserWrapper>
	</div>
</template>

<script>	
	import _ from 'lodash';
	import moment from 'moment';		
	import ImageLoader from "~/components/core/ui/ImageLoader.vue";
	import Form from "~/components/core/forms/Form.vue";
	import Page from "~/helpers/core/page.js";	
	import ProfileContent from "~/components/core/pages/ProfileContent.vue";
	import UserWrapper from "~/components/core/wrappers/User.vue";
	
	export default {
		name: "UserProfileComponent",
		components: {
			Form, 
			ImageLoader,
			ProfileContent, 
			UserWrapper
		},
		props: [
			'user'
		],
		computed: {
			authorized () {
				let user = this.$store.state.user || {};
				let username = this.$route.params.username;
				
				if (!username) return true;
				
				return user.username === username;
			},
			formats () {
				return this.$store.state.api.config.application.format
			},
			icons () {
				return this.$store.state.api.icons;
			},
			image () {
				return _.get(this.content, 'user.image');
			},
			labels () {
				return this.$store.state.api.labels;
			},
			headlines () {
				return this.labels.profile.headline.label;
			},
			page () {
				return Page.get(this.pages, this.path);
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