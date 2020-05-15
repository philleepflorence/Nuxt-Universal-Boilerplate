<template>
	<div class="form-conversion plain-form form-line form-no-label form-white" v-bind:key="keys.element">
		<div class="bg-dark p-4" v-if="loaded">
			
			<app-component-form-form 
				v-bind:id="`forms-${ form.slug }-form`" 
				v-bind:formname="form.slug"
				v-bind:inputs="inputs"
				v-on:change="onChange"
				path="#" 
				autocomplete="off"
				data-tooltip-container="width">
					
				<template v-slot:header>
					<div class="pb-2 p text-white" v-html="form.content"></div>
				</template>
																				
			</app-component-form-form>
			
		</div>
	</div>
</template>

<script>
	import { cloneDeep, forEach, get, intersection, set, startCase } from "lodash";
	import convert from 'convert-units';
	
	import ComponentFormForm from "~/components/core/forms/Form.vue";
	
	import Alert from "~/helpers/core/alert.js";
	import Page from "~/helpers/core/page.js";
	
	export default {
		name: "ConversionForm",
		props: [
			"container",
			"formname",
			"page"
		],
		components: {
			'app-component-form-form': ComponentFormForm
		},
		computed: {
			form () {
				return this.$store.state.api.forms.conversion;
			}
		},
		data () {
			return {
				data: {},
				keys: {
					element: Page.utils.rand()
				},
				loaded: false,
				options: {}
			};
		},
		methods: {
			onChange (value, input) {				
				let validated = true;
				
				if (input.property === "output" && this.data.input) validated = this.validate(value);
				
				if (!validated) {
					this.keys.element = Page.utils.rand();
					
					return false;
				}
								
				set(this.data, input.property, value);
				
				let keys = Object.keys(this.data);
				let match = intersection(['input', 'output', 'value'], keys);

				if (match.length === 3) this.render();
			},
			parse () {
				let inputs = cloneDeep(this.form.inputs);
				
				forEach(inputs, (input) => {
					let options = [];	
					
					set(input, 'defaultValue', get(this.data, input.property));				
					
					if (input.options) {
						input.options.forEach((option) => {
							let list = convert().list(option.value);
							let curroptions = {
								label: startCase(option.value),
								options: []
							};
							
							list.forEach((row) => {
								curroptions.options.push({
									text: row.abbr,									
									value: row.abbr
								});
								set(this.options, `${ option.value }.${ row.abbr }`, row);
							});
							
							options.push(curroptions);
						});
						
						input.options = options;
					}
				});
				
				return inputs;
			},
			render () {
				if (window.DEBUG) console.log("debug - app.components.core.forms.Conversion.render");
				
				try {
					this.data.converted = convert(Number(this.data.value)).from(this.data.input).to(this.data.output);
				}
				catch (error) {
					Alert.show(error.message, 'error')
				}
				
				this.inputs = this.parse();
				
				this.keys.element = Page.utils.rand();				
			},
			validate (value) {
				let type;
				
				forEach(this.options, (option, index) => {
					if (get(option, this.data.input)) type = index;
				});
				
				let possibilities = convert().possibilities(type);
				
				return possibilities.includes(value);
			}
		},
		mounted () {
			if (window.DEBUG) console.log("debug - app.components.core.forms.Conversion.mounted");
			
			this.inputs = this.parse();
			
			this.loaded = true;	
		}
	}
</script>