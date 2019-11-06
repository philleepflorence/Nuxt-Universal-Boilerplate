<template>
	<div class="custom-scroll position-absolute position-full" v-bind:data-custom-scroll="name">
		<div class="custom-scroll-content position-relative">
			<slot></slot>
			<footer class="position-fixed position-bottom custom-scroll-footer spacer text-center" v-if="scrollable" v-show="scrollback">
				<button 
					class="btn w-50px h-50px rounded-circle bg-primary text-white position-absolute position-bottom position-left m-4 shadow-sm animated zoomIn" 
					v-html="icons.scroll.up.icon.icon" 
					v-on:click="scrollup">
				</button>
			</footer>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';
	import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
	
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "CustomScroll",
		props: [
			'name', 
			'options', 
			'overlay',
			'direction',
			'route'
		],
		data () {
			return {
				keys: {
					element: Page.utils.rand()
				},
				scrollable: false,
				scrollback: false,
				custom: false,
				axis: 'y',
				iOS: false
			};
		},
		computed: {
			icons () {
				return this.$store.state.api.icons;
			},
			mobile () {
				return (typeof window.orientation !== "undefined") || (window.navigator.userAgent.indexOf('IEMobile') !== -1);
			},
			position () {
				let position;
				
				if (this.custom) {
					position = {};
					
					position[this.axis] = 0;
				}
				else {
					position = this.axis === "y" ? "scrollTop" : "scrollLeft";
				}
				
				return position;
			},
			scrollbar () {
				if (this.mobile) return 0;
				
				if (typeof this.$store.state.app.scrollpane === "boolean") return this.$store.state.app.scrollpane;
				
				document.body.style.minHeight = '101vh';
				
				let window = document.createElement("div");
				
				window.className = 'scroll-pane-check scroll-pane-window';
				document.body.appendChild(window);
				
				let viewport = document.createElement("div");
				
				viewport.className = 'scroll-pane-check scroll-pane-viewport';
				document.body.appendChild(viewport);
				
				let offset = viewport.offsetWidth - window.offsetWidth;
				
				this.$store.commit('app/SET', {
					key: "scrollpane",
					data: offset
				});
				
				document.body.removeChild(window);
				document.body.removeChild(viewport);
				document.body.style.minHeight = '100vh';
				
				return offset;
			}
		},
		methods: {
			initialize () {
				if (this.direction) this.axis = this.direction;
				
				this.iOS = this.$store.state.app.regex.iOS.test(window.navigator.userAgent);
				this.$content = this.$el.querySelector('.custom-scroll-content');
				this.custom = this.iOS ? true : ( this.scrollbar > 0 && !this.mobile && typeof window.OverlayScrollbars === 'function' );
				
				let input = this.options || {};
				
				if (this.axis === "x") {
					input = Object.assign(input, {
						x: "scroll",
						y: "hidden"
					});
				}
				
				if (this.iOS) {
					this.scrollable = false;
				}
				
				const options = _.cloneDeep(this.$store.state.app.scrollBar.options, input);
				const chain = this.axis === "y" ? { vertical: true } : { horizontal: true }
				
				if (this.overlay) {
					options.onContentSizeChanged = () => { this.render() };
					options.callbacks = options.callbacks || {};
					options.callbacks.onScroll = (e) => {
						let position = _.get(this.$el.OverlayScrollbars.scroll(), 'position');
						
						this.scroll(position.x, position.y);
					};
				}
				
				if (!this.custom) {
					this.$el.classList.add('scroll');
					this.$el.scrollTo = 0;
					
					window.addEventListener('resize', this.render);
					
					if (this.axis === "y") {
						this.$el.addEventListener('mouseenter', this.mouseenter);
						this.$el.addEventListener('mouseleave', this.mouseleave);
						//document.addEventListener('touchstart', this.touchstart);
						window.addEventListener('wheel', this.wheel, { passive: false });
					}
					
					if (this.overlay) {
						this.$el.addEventListener('scroll', this.scroll, { passive: false });
					}
				}
				else if (this.$el && this.custom) {
					this.$el.OverlayScrollbars = OverlayScrollbars(this.$el, options);
					
					if (this.overlay) {	
						this.$el.OverlayScrollbars.addExt('scroll-chain', chain);
						this.$el.OverlayScrollbars.options('callbacks.onOverflowChanged', (e) => {
							this.render(e.clipped);
						});
					}					
				}
				
				this.render();
			},
			mouseenter (e) {
				this.$el.scrollactive = true;
			},
			mouseleave (e) {
				this.$el.scrollactive = null;
			},
			prevent (e) {
				e.stopPropagation();
				e.preventDefault();
				e.returnValue = false;
				
				return false;
			},
			render (clipped) {
				let height = Math.max(this.$el.scrollHeight, this.$content.offsetHeight);
				
				if (this.iOS) {
					this.scrollable = false;
				}				
				else if (clipped === true && this.overlay && this.$content) {
					this.scrollable = true;
				}
				else if (this.overlay && this.$content && height > this.$el.offsetHeight) {
					this.scrollable = true;
				}
				else {
					this.scrollable = false;
				}
			},
			scroll (x, y) {
				if (this.scrollable) {
					if (this.axis === "x") {
						x = x || this.$el.scrollLeft;
						
						this.scrollback = x > window.innerWidth ? true : false;
					}
					else if (this.axis === "y") {
						y = y || this.$el.scrollTop;						
						
						this.scrollback = y > window.innerHeight ? true : false;
					}					
				}
			},
			scrollup (e) {
				let duration = 600;
				let rect = e.currentTarget.getBoundingClientRect();
				
				if (rect.top > this.$el.offsetHeight) {
					duration = Math.floor(rect.top * 0.80);
				}
				
				if (this.custom) {
					this.$el.OverlayScrollbars.scroll(this.position, duration);
				}		
				else {
					this.$el[this.position] = 0;
				}
			},
			touchstart (e) {
				if (e.target.closest("[data-custom-scroll]")) {
					disableBodyScroll(this.$el);
				}
				else {
					enableBodyScroll(this.$el);
				}
			},
			wheel (e) {
				if (this.$el.scrollactive) {
					let up = e.wheelDelta > 0;
					let down = e.wheelDelta < 0;
					let scrollTop = this.$el.scrollTop;
					let offset = (this.$el.clientHeight + scrollTop);
					
					if (down && e.deltaY > (this.$el.scrollHeight - this.$el.clientHeight - scrollTop)) {
						this.$el.scrollTop = this.$el.scrollHeight;
						
						return this.prevent(e);
					}
					else if (up && e.wheelDelta > scrollTop) {
						this.$el.scrollTop = 0;
						
						return this.prevent(e);
					}					
				}
			}
		},
		mounted () {
			this.initialize();
			
			const subscribe = this.$store.subscribe((mutation, state) => {
				if (mutation.type === "event/SET" && mutation.payload[0] === "app:rendered") {
					this.render();
					subscribe();
				}
			});
			
			if (this.route) {	
				this.$router.beforeEach((to, from, next) => {
					if (Page.path(to.path) !== Page.path(from.path)) {
						if (this.custom) {
							this.$el.OverlayScrollbars.scroll(this.position, 0);
						}
						else {
							this.$el.classList.add('scroll-top');
							this.$el[this.position] = 0;
						}
					}
					next();
				});
				this.$router.afterEach((to, from) => {
					if (!this.custom && Page.path(to.path) !== Page.path(from.path)) {
						this.$el.classList.remove('scroll-top');
					}
				});
			}
		},
		updated () {
			if (!this.custom) {
				this.$el.classList.add('scroll');
			}
			
			if (this.$el.OverlayScrollbars) {
				this.$el.OverlayScrollbars.update();
			}
			
			this.render();
		},
		beforeDestroy () {
			if (this.$el.OverlayScrollbars) {
				this.$el.OverlayScrollbars.destroy();
			}
			
			if (!this.custom) {
				window.removeEventListener('resize', this.render);
				
				if (this.axis === "y") {
					this.$el.removeEventListener('mouseenter', this.mouseenter);
					this.$el.removeEventListener('mouseleave', this.mouseleave);
					//document.removeEventListener('touchstart', this.touchstart);
					window.removeEventListener('wheel', this.wheel, { passive: false });
					
					clearAllBodyScrollLocks();
				}
				
				if (this.overlay) {
					this.$el.removeEventListener('scroll', this.scroll);
				}
			}		
		}
	}
</script>

<style lang="less">
	.custom-scroll {
		transition-property: none;
		
		&.scroll {
			overflow: scroll !important;
			overscroll-behavior: contain !important;
			scroll-behavior: smooth !important;
		}
		
		&.scroll-top {
			scroll-behavior: auto !important;
		}
		
		.custom-scroll-content {
			transition-property: none;			
		}
		
		.custom-scroll-footer {
			padding: 3rem 0;
			z-index: 100;
		}		
	}
	.custom-scroll-debug {
		width: 100px;
		height: 100px;
		overflow: scroll;
		position: absolute;
		top: -9999px;
	}
				
	.scroll-pane-check {
		position: fixed;
		height: 10px;
		top: 0;
		pointer-events: none;
		z-index: 100;
		
		&.scroll-pane-window {
			width: 100%;
		}
		
		&.scroll-pane-viewport {
			width: 100vw;
		}
	}
</style>