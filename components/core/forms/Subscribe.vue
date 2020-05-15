<template>
	<div class="form-subscribe form-no-label" v-bind:key="keys.element">							
		<Form 
			v-bind:id="`subscribe-form-${ name }`" 
			v-bind:formname="form.slug"
			v-bind:formtemplate="form.template"
			v-bind:formnotification="notification"
			path="/api/form/submit" 
			captcha="true" 
			clearonsuccess="true" 
			autocomplete="off">
				
			<template v-slot:header>
				<div class="p lead pb-4 text-white" v-html="form.content"></div>
			</template>
			
			<template v-slot:inputs>
				<div class="form-inputs">
					<div v-bind:id="`form-group-${ input.slug }`" class="form-subscribe-row position-relative mb-4">
						<b-form-input 
							class="input form-subscribe-input page-inline-input position-relative text-dark text-left lead bg-white-80 h-50px w-100 font-weight-book"
							v-bind:id="`subscribe-form-${ input.slug }`" 
							v-bind:type="input.input_type" 
							v-bind:placeholder="input.value"
							v-bind:v-model="`form.${ input.slug }`"
							v-bind:name="`form.${ input.slug }`" 
							autocomplete="off">
						</b-form-input>
						<button 
							class="form-subscribe-button page-inline-button plain bg-primary rounded-circle position-absolute position-right position-top text-white shadow-sm" 
							v-html="icons.settings.complete.icon.icon" 
							type="submit">
						</button>
					</div>
				</div>
			</template>	
			
			<template v-slot:footer>
				<div class="p pb-4 text-white" v-html="input.hint"></div>
			</template>	
																		
		</Form>		
	</div>
</template>

<script>
	import Page from "~/helpers/core/page.js";
	import Form from "~/components/core/forms/Form.vue";
	import _ from "lodash";
	
	export default {
		name: "SubscribeForm",
		props: [
			"name"
		],
		components: {
			Form
		},
		computed: {
			icons () {
				return this.$store.state.api.icons;
			},
			form () {
				return _.get(this.forms, 'subscribe');
			},
			forms () {
				return this.$store.state.api.forms;
			},
			input () {
				return _.get(this.pages, "app.labels.form['subscribe-overlay'].email");
			},
			labels () {
				return this.$store.state.api.labels;
			},
			notification () {
				if (!this.form.notifications) return null;
				
				let notification;
				
				_.forEach(this.form.notifications, (row) => {
					if (row.status === "published") notification = row.slug;
				});	
				
				return notification;
			},
			pages () {
				return this.$store.state.api.pages;
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				}
			};
		},
		methods: {
			
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.forms.Subscribe.mounted");
		}
	}
</script>

<style lang="less">	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	.form-subscribe {
		.form-subscribe-row {
			.form-subscribe-input {
				border-radius: 25px !important;
			}
			.form-subscribe-button {
				width: 44px;
				height: 44px;
				margin: 3px;
			}
		}
		.form-options {
			.form-group {
				background: fade(gray, 80) !important; 
				border-radius: 20px !important;
				
				.custom-control.custom-switch {
					text-align: left !important;
					
					label {
						color: white !important;
					}
				}
			}
		}
	}
</style>