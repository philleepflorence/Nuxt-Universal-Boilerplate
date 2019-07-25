/**
 * Image Module
 *
 * @author :: Philleep Florence
 * @module      :: Image Module
 * @description :: Image Module - Image Loader and Processor
 *
 */
 
import _ from 'lodash';

export default {
	/*
		!LOAD - Loads background images or image tags into DOM Elements
		REQUIRED: data-image-load - image to load
		REQUIRED: data-image-format="image|background"
		
		OPTIONAL: data-image-visible - do not load when not visible to the viewport
		OPTIONAL: data-image-size="cdn" - use the CDN sizes to load the most appropriate image size for the device
	*/
	load (options, elements, done) {
		elements = elements || document.querySelectorAll('[data-image-load]');
		
		let len = elements.length;
		let loaded = 0;
		let cdn = _.get(options, 'url');
		
		if (len === 0 && typeof done === 'function') return done(len);
		else if (len === 0) return false;
		
		const complete = function (element)
		{
			loaded++;
			
			element.classList.remove('image-loading');
			element.classList.add('image-loaded');
			
			element.dispatchEvent(new Event('helpers:image:loaded'));
				
			if (loaded === len && typeof done === 'function') {				
				done(len, elements);
			}
		};
		
		const format = (string, array) => {
			let i = 0;
			
			return string.replace(/({{.*?}})/g, function () 
			{
				return typeof array[i] !== 'undefined' ? array[i++] : '';
			});
		};
		
		const loadimage = (ImageURL, Done) => {
			let img = new Image();
			
			img.onload = function () { if (typeof Done === 'function' && !img.completed) return Done(); };
			img.src = ImageURL;
			
			if (typeof Done === 'function' && img.complete) 
			{
				img.completed = true;
				
				return Done();
			}
		};
		
		const size = (element, src, url, options) => {
			let width = Number( element.getAttribute('data-image-width') || element.parentElement.offsetWidth );
	        let height = Number( element.getAttribute('data-image-height') || element.parentElement.offsetHeight ) || width;
			let sizes = _.get(options, 'sizes');
			let size = _.get(options, 'size');
			
			if (!Array.isArray(sizes)) return format(url, [size.width, size.height, src]);
			
			_.forEach(sizes, function (currsize)
			{
				currsize = currsize.split('x');
	
				if (width <= Number(currsize[0]) && height <= Number(currsize[1]))
				{
					size = {
						width: Number( currsize[0] ),
						height: Number( currsize[1] )
					};
					
					return false;
				}
			});
	        
	        src = format(url, [size.width, size.height, src]);
			
			return src;
		};
		
		_.forEach(elements, function (element, curr)
		{
			const load = !_.includes(element.classList, 'image-loaded') && !_.includes(element.classList, 'image-loading');
			
			if (!load) {
				len--;
				return;
			}			
			
			const style = window.getComputedStyle(element).style;
			const visible = element.getAttribute('data-image-visible') === "true" ? (element.offsetParent !== null && !element.hidden) : false;
			
			if (!visible && !load) {
				len--;
				return;
			}
			
			const format = element.getAttribute('data-image-format');
			
			if (element.getAttribute('data-image-width') === 'viewport') {
				element.setAttribute('data-image-width', Math.ceil(window.innerWidth));
				element.setAttribute('data-image-height', Math.ceil(window.innerHeight));
			}
			
			let src = element.getAttribute('data-image-load');
			
			if (!src || src.length < 4 || src === 'none') {
				len--;
				return;
			}
			
			element.classList.add('image-loading');
			
			if (cdn && element.getAttribute('data-image-size') === "cdn") src = size(element, src, cdn, options);
			
			if (format === "background") element.style.backgroundImage = `url(${ src })`;
			else if (format === "image") element.src = src;
							
			loadimage(src, function ()
			{
				complete(element);
			});
		});
	}
}