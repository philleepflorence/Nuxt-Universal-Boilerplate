<template>
	<div class="page-ticker-template overflow-hidden cursor-hand" v-bind:key="keys.element">
		<header class="page-ticker-header px-4 animated animated fadeIn a-delay" v-if="headline">
			<p class="p page-ticker-headline text-muted font-weight-book m-0" v-html="format(headline.plaintext)"></p>
		</header>
		<div class="page-ticker-container text-primary font-accent text-uppercase animated fadeIn a-delay" v-on:click="onDetails">
			<div class="page-ticker-row d-inline-block" v-bind:style="style" v-bind:key="`column-01`" data-column="column-01">
				<div class="page-ticker-column d-inline-block">
					<span class="page-ticker d-inline-block px-4" v-for="label in labels" v-bind:key="`${ label.id }-column-01`" v-bind:data-id="label.id">{{ label.name }}</span>
				</div>			
			</div>
			<div class="page-ticker-row d-inline-block" v-bind:style="style" v-bind:key="`column-02`" data-column="column-02">
				<div class="page-ticker-column d-inline-block">
					<span class="page-ticker d-inline-block px-4" v-for="label in labels" v-bind:key="`${ label.id }-column-02`" v-bind:data-id="label.id">{{ label.name }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "Ticker",
		props: [
			'duration',
			'fontsize',
			'headline',
			'labels',
			'path'
		],
		computed: {
			style () {
				return {
					fontSize: this.fontsize || '1rem'
				};
			}
		},
		methods: {
			format (string) {
				return Page.utils.format (string, this.$store.state.api.config.components.display);
			},
			onDetails (e) {
				if (this.path) this.$router.push({
					path: this.path
				});
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.ui.Ticker.render");
				
				let len = _.size(this.labels);
				let $columns = this.$el.querySelectorAll('.page-ticker-column');
				let duration = (this.duration || 2000) * len;
				
				_.forEach($columns, (column) => {
					column.style.animationDuration = `${ duration }ms`;
				});
			}
		},
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				options: {
					delay: this.delay || 250,
					duration: this.duration || 3000
				}
			};
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.ui.Ticker.mounted");
			
			this.render();
		}
	}
</script>

<style lang="less" scoped>	
		
	@import '../../../assets/styles/mixins/mixins.less';
	
	.page-ticker-header {
		.page-ticker-headline {
			opacity: 0.5;
			
			&.off {
				opacity: 0;
			}
		}
	}
	
	.page-ticker-container {
		font-weight: 300;
		margin: 0 auto;
		white-space: nowrap;
		overflow: hidden;
		
		.page-ticker-column {
			animation: ticker 2000ms linear infinite;
		}
	}
	
	@keyframes ticker {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(-100%, 0);
		}
	}
	
</style>