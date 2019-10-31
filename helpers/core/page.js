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
import Image from "~/helpers/core/image.js";
import StringCompare from 'string-similarity';

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
		
		if (Page.content_image && content.image) page.image = content.image;
		
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
		
		path = path === '/' ? path : _.trimEnd(path, '/');
		
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
		Get the current location pathname and hash
		PARAMETER:
			hash - the hash to append to the current path
	*/
	hash (hash) {
		let path = _.trimEnd(window.location.pathname, '/');
		
		return path + hash;
	},
	/*
		Get the current location pathname and hash
		PARAMETER:
			hash - the hash to append to the current path
	*/
	path (path) {
		path = path || window.location.pathname;
		
		if (path === '/') return path;
		
		path = path.split('/!#');
		
		path = _.trimEnd(_.get(path, 0, ''), '/');
		
		return path;
	},
	/*
		Process page head metadata and image configuration
		PARAMETERS:		
			Page - Incoming Page content
			config - App configuration object
	*/
	metadata (page, config) {
		
		let title = _.unescape(_.get(page, 'title'));
		let description = _.unescape(_.get(page, 'description'));
		let image = _.get(page, 'image', {});
		
		let imageurl = _.get(config, 'application.cdn.images.metadata.url');
		let imagewidth = _.get(config, 'application.cdn.images.metadata.width');
		let height = image.height;
		let width = image.width;
		
		if (imageurl && image.name) {
			imageurl = imageurl.replace('{{image}}', image.name);
		}
		else {
			imageurl = image.url;
		}
		
		if (imagewidth) {
			let ratio = imagewidth / width;
			
			height = Math.round(height * ratio);			
			width = Math.round(width * ratio);
		}
		
		return {
			title: title,
			link: [
				{ hid: 'icon', rel: 'icon', type: 'image/png', content: _.get(config, 'application.favicon') },
				{ hid: 'shortcut icon', rel: 'shortcut icon', type: 'image/png', content: _.get(config, 'application.favicon') }
			],
			meta: [
				{ hid: 'share:description', name: 'share:description', content: description },
				{ hid: 'share:title', name: 'share:title', content: title },
				{ hid: 'share:image', name: 'share:image', content: imageurl },
				{ hid: 'share:image:name', name: 'share:image:name', content: image.name },
				{ hid: 'description', name: 'description', content: description },
				{ hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
				{ hid: 'twitter:site', name: 'twitter:site', content: _.get(config, 'application.website') },
				{ hid: 'twitter:title', name: 'twitter:title', content: title },
				{ hid: 'twitter:description', name: 'twitter:description', content: description },
				{ hid: 'twitter:image:src', name: 'twitter:image:src', content: imageurl },
				{ hid: 'twitter:image:alt', name: 'twitter:image:alt', content: image.title },
				{ hid: 'og:type', name: 'og:type', content: 'website' },
				{ hid: 'og:site_name', name: 'og:site_name', content: _.get(config, 'application.name') },
				{ hid: 'og:url', name: 'og:url', content: _.get(config, 'application.website') },
				{ hid: 'og:title', name: 'og:title', content: title },
				{ hid: 'og:description', name: 'og:description', content: description },
				{ hid: 'og:image', name: 'og:image', content: imageurl },
				{ hid: 'og:image:secure_url', name: 'og:image:secure_url', content: imageurl },
				{ hid: 'og:image:width', name: 'og:image:width', content: width },
				{ hid: 'og:image:height', name: 'og:image:height', content: height },
				{ hid: 'og:image:type', name: 'og:image:type', content: image.type }
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
	/*
		Search page contents for a value - sort by relevance in descending order!
		PARAMETERS:
			data - @array of objects - REQUIRED
			columns - @Array list of object properties - REQUIRED
			query - @Search to match against contents in data
			mode - @String: any|all|strict
		MODES:
			any - match any one or more words - relevance is number of matches - relevance: 0 to 1
			all - match all words - must contain all words in any order - relevance: 0 to 1	
			strict - must match the query as is - case insensitive - relevance: 0		
	*/
	search (data, keys, query, mode = "any") {
		let array = _.cloneDeep(data);
		
		if (!Array.isArray(array)) return null;
		
		let $query = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		let strings = query.split(' ');
		let pattern, result = [], relevance = 0, max = 0;
		
		for (let row of array) {
			let matches = [];
			
			switch (mode) {
				case 'any':
					for (let string of strings) {
						pattern = new RegExp(`\\b${ string }\\b`, 'gi');
						relevance = 0;
						
						for (let key of keys) {
							let value = _.get(row, key);
							let matched = null;
							
							if (typeof value === "number" || typeof value === "string") {
								matched = value.match(pattern);
							}
							
							if (matched && matched.length) {
								relevance = 1;								
								matches = matches.concat(matched);
							}
						}
						
						if (relevance && row.relevance) row.relevance ++;
						else if (relevance && !row.relevance) row.relevance = 1;
					}
					
					if (matches.length) row.matches = _.uniq(matches);
					
					if (row.relevance) row.relevance = Number( (row.relevance / strings.length).toFixed(2) );
					
					if (row.relevance) result.push(row);
				break;
				
				case 'all':
					let currquery = $query.replace(/\s/g, "\\b|\\b");
					pattern = new RegExp(`(\\b${ currquery }\\b)`, 'gi');
					relevance = 0;
					max = 0;
					
					for (let key of keys) {
						let value = _.get(row, key);
						let matched = null;
						
						if (typeof value === "number" || typeof value === "string") {
							matched = value.match(pattern);
						}
						
						if (matched && matched.length) {
							max = _.uniq(matched).length;
							matches = matches.concat(matched);
						}
						
						if (max >= relevance) relevance = max;
					}
					
					if (matches.length) row.matches = _.uniq(matches);
						
					if (row.matches && row.matches.length === strings.length) {
						row.relevance = StringCompare.compareTwoStrings($query, row.matches.join(' '));
						row.relevance = Number( row.relevance.toFixed(2) );
					}
					
					if (row.relevance) result.push(row);
				break;
				
				case 'strict':
					pattern = new RegExp(`\\b(${ $query })\\b`, 'gi');
					relevance = 0;
					max = 0;
					
					for (let key of keys) {
						let value = _.get(row, key);
						let matched = null;
						
						if (typeof value === "number" || typeof value === "string") {
							matched = value.match(pattern);
						}
						
						if (matched && matched.length) {
							max = StringCompare.compareTwoStrings(query, matched[0]);
							matches = matches.concat(matched);
						}
						
						if (max >= relevance) relevance = Number( max.toFixed(2) );
					}
					
					if (matches.length) row.matches = _.uniq(matches);
						
					if (relevance) row.relevance = relevance;
					
					if (row.relevance) result.push(row);
				break;			
			}
		}
		
		if (Array.isArray(result)) result.sort((a, b) => b.relevance - a.relevance);
		
		return result;
	},
	scrollTo (e, top = 0, offset = 0, behavior = 'smooth') {
		
		if (_.isElement(e)) {
			let rect = e.getBoundingClientRect();
			
			top = rect.top + offset;
		}
		else if (e && (e.currentTarget || e.target)) {
			let button = (e.currentTarget || e.target);
			let element = document.getElementById(button.getAttribute('data-scroll-to'));
			
			let rect = element ? element.getBoundingClientRect() : button.getBoundingClientRect();
			
			top = rect.top + offset;
		}
		
		window.scrollTo({
			top: top,
			left: 0,
			behavior: behavior
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
		format (string, options) {
			if (!Array.isArray(options) || typeof string !== 'string') return string;
			
			options.forEach(function (obj)
			{
				_.forEach(obj, function (display, node)
				{
					var pattern = new RegExp(node, 'gi');
					var span = `<span class="${ display }" data-component-format>${ node }</span>`;
					
					string = string.replace(pattern, span);		
				});			
			});
			
			return string;
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