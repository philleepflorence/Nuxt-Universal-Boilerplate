/**
 * Page Module
 *
 * @author :: Philleep Florence
 * @module      :: Page Module
 * @description :: Page Module - Page Processor and Methods
 *
 */
 
import _ from 'lodash';
import superagent from 'superagent';
import handlebars from 'handlebars/dist/handlebars.min.js';

export default {
	/*
		Parse HTML Attributes in JSON
	*/
	attributes (input) {
		let attributes = input.attributes;
		let results = [];
		
		if (!attributes) return null;
		
		attributes = attributes.split(' ');
		
		for (let row of attributes) {
			let currrow = row.split('=');
			let result = {};
			
			if (currrow.length > 1) result[currrow[0]] = currrow[1].replace(/^"(.+)"$/, '$1');
			else result[currrow[0]] = currrow[0];
			
			results.push(result);
		}
		
		return results;
	},
	/*
		Process dynamic page contents - blogs et al
		PARAMETERS:
			Page - incoming page
			Content - dynamic content
	*/
	content (Page, content) {
		let currrow, page = {};
		
		_.forEach(Page, function (row, index)
		{
			if (typeof row === 'string' && /{([^{}]*)}/.test(row))
			{
				let template = handlebars.compile(row);
				
				currrow = template(content);
			}
			else currrow = row;
			
			_.set(page, index, currrow);
		});
		
		return page;
	},
	/*
		Send page or form data to server - Wrapper
	*/
	async post (url, post, options) {
		
		options = options || {};
		
		if (typeof options.response === 'undefined') options.response = 'body';
		
		options.headers = options.headers || {};
		options.headers = Object.assign({
			'Content-type': 'application/json'
		}, options.headers); 
		
		try {
        
			const result = await superagent('POST', url)
			.set(options.headers)
			.send(post);
			
			if (options.response) return _.get(result, options.response);
			
			return result;	        
        }
        catch (err) {
	        if (err.response && options.response) return _.get(err.response, options.response);
	        
	        return null;
        }
	},
	/*
		Get page via URL or Path
	*/
	get (Pages, path, name) {
		if (!path || !Pages) return null;
		
		if (path === true && typeof name === 'string') return _.get(Pages, name);
		
		let pages = {...Pages};
		let page = {};
		
		_.forEach(pages, function (row)
		{
			if (row.path === path) page = row;
		});
		
		if (page.id) return _.cloneDeep(page);
			
		let Paths = String(path).split('/').filter(Boolean);
		
		_.forEach(pages, function(row)
		{ 
			let num = (row.path.match(/:/g) || []).length;			
			let paths = String(row.path).split('/').filter(Boolean);
			let intersection = _.intersection(Paths, paths);
			let sum = intersection.length + num;
			
			if (num && intersection.length && Paths.length === sum) {
				page = row;	
				return;
			}						
		});	
			
		return _.cloneDeep(page);
	},
	/*
		Process page head metadata
		PARAMETERS:		
			Page - Incoming Page content
			config - App configuration object
	*/
	metadata (page, config) {
		
		let title = _.unescape(_.get(page, 'title'));
		let description = _.unescape(_.get(page, 'description'));
		
		return {
			title: title,
			link: [
				{ hid: 'icon', rel: 'icon', type: 'image/png', content: _.get(config, 'application.favicon') },
				{ hid: 'shortcut icon', rel: 'shortcut icon', type: 'image/png', content: _.get(config, 'application.favicon') }
			],
			meta: [
				{ hid: 'share:description', name: 'share:description', content: description },
				{ hid: 'share:title', name: 'share:title', content: title },
				{ hid: 'share:image', name: 'share:image', content: _.get(page, 'image.url') },
				{ hid: 'description', name: 'description', content: description },
				{ hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
				{ hid: 'twitter:site', name: 'twitter:site', content: _.get(config, 'application.website') },
				{ hid: 'twitter:title', name: 'twitter:title', content: title },
				{ hid: 'twitter:description', name: 'twitter:description', content: description },
				{ hid: 'twitter:image:src', name: 'twitter:image:src', content: _.get(page, 'image.url') },
				{ hid: 'twitter:image:alt', name: 'twitter:image:alt', content: _.get(page, 'image.title') },
				{ hid: 'og:type', name: 'og:type', content: 'website' },
				{ hid: 'og:site_name', name: 'og:site_name', content: _.get(config, 'application.name') },
				{ hid: 'og:url', name: 'og:url', content: _.get(config, 'application.website') },
				{ hid: 'og:title', name: 'og:title', content: title },
				{ hid: 'og:description', name: 'og:description', content: description },
				{ hid: 'og:image', name: 'og:image', content: _.get(page, 'image.url') },
				{ hid: 'og:image:secure_url', name: 'og:image:secure_url', content: _.get(page, 'image.url') },
				{ hid: 'og:image:width', name: 'og:image:width', content: _.get(page, 'image.width') },
				{ hid: 'og:image:height', name: 'og:image:height', content: _.get(page, 'image.height') },
				{ hid: 'og:image:type', name: 'og:image:type', content: _.get(page, 'image.type') },
				{ hid: 'og:image:width', name: 'og:image:width', content: _.get(page, 'image.url') }
			]				
		};
	},
	/*
		Require - Makes sure external scripts and assets are loaded before continuation of a script. 
		Client Side Script and Style Loader!
		Supports .js and .css
		PRARAMETERS:
			paths - @Array of paths
			store - Vuex Store Object
			Callback - Method to call on success or error
	*/
	require (paths, store, callback) {
		
		paths = paths && paths.paths ? paths.paths : paths;
		
		let currTime = Date.now();		
		let configuration = _.get(store, 'configuration');
		let cache = _.get(store, 'cache.page.require', []);
		let loadpaths = [];
		
		for (let path of paths) {
			let currelement = document.querySelector(`[data-path="${ path }"]`);
			if (!cache.includes(path) && !currelement) {
				loadpaths.push(path);
			}
		}
		
		if (!loadpaths.length && typeof callback === 'function') {
			return callback(loadpaths);
		}
		else if (!loadpaths.length) return false;
		
		let len = paths.length;
		let loaded = 0;
		let scripts = [], styles = [];
		
		let render = (path, script) => {
			let ext = path.split('.').pop().toLowerCase();
			let id = `${ Date.now() }-${ Math.random().toString(36).substring(7) }`;
			let element;
				
			if (script && ext === 'js')
			{
				element = document.createElement('script');
				element.type = 'text/javascript';
				element.id = id;
				element.setAttribute('data-path', path);
				element.innerHTML = script;
				
				scripts.push(element);
			}
			else if (script && ext === 'css')
			{
				element = document.createElement('style');
				element.id = id;
				element.setAttribute('data-path', path);
				element.innerHTML = script;
				
				styles.push(element);
			}
			
			if (loaded === len)
			{
				styles.forEach(function (element)
				{
					document.head.appendChild(element);
				});
				
				scripts.forEach(function (element)
				{
					document.body.appendChild(element);
				});

				cache = cache.concat(loadpaths);
				
				store.commit('app/SET', {
					key: 'cache.page.require',
					data: cache
				});

				if (typeof callback === 'function' && loaded === loadpaths.length) return callback(scripts.concat(styles));
			}
		}
		
		for (let path of loadpaths) {						
			superagent('GET', path).end((error, response) => {
				if (error) return callback(scripts.concat(styles), error);
				
				loaded++;
				
				const script = response.text;
				let currelement = document.querySelector(`[data-path="${ path }"]`);
				
				if (!currelement) render(path, script);
			});
		}
	},
	scrollTo (e, offset) {
		if (typeof offset !== 'number') {
			let button = e.currentTarget;
			let element = document.getElementById(button.getAttribute('data-scroll-to'));
			
			offset = element ? element.offsetTop : button.offsetTop;
		}
		
		window.scrollTo({
			top: offset,
			left: 0,
			behavior: 'smooth'
		});		
	},
	/*
		PARAMETERS:
			source - @String - Content to compile - REQUIRED
			layout - @Object - Dictionary or array to use when compiling - REQUIRED
			data - @String - Layout in which to place compiled template - OPTIONAL
			key - @String - Dot syntax key to use when adding source to layout - OPTIONAL
	*/
	template (source, data, layout, key) {
		if (!data) return '';
		
		let template = handlebars.compile(source);
		let result = template(data);
		
		if (!key || typeof layout !== 'string') return result;
		
		template = handlebars.compile(layout);
		
		let _data = Object.assign(data, {
			key: result
		});
		
		result = template(_data);
		
		return result;
	},
	utils: {
		attributes (attributes) {
			if (!attributes) return null;
			
			let results = [];
			
			attributes = attributes.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
			
			for (let row of attributes) {
				let currrow = row.split('=');
				let result = {};
				
				if (currrow.length > 1) result[currrow[0]] = currrow[1].replace(/^"(.+)"$/, '$1');
				else result[currrow[0]] = currrow[0];
				
				results.push(result);
			}
			
			return results;
		},
		decode (str) {
			return str.replace(/&#(\d+);/g, (match, dec) => {
				return String.fromCharCode(dec);
			});
		},
		encode (str) {
			var buf = [];
			
			for (let i = str.length -1; i >= 0; i--) {
				buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
			}
			
			return buf.join('');
		},
		rand (prefix) {
			prefix = prefix || Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 8);
			
			return prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		},
		striptags (input = '') {
			return input.replace(/(<([^>]+)>)/ig,"");
		}
	}
}