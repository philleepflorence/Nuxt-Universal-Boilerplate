/**
 * Inview Module
 *
 * @author :: Philleep Florence
 * @module      :: Inview Module
 * @description :: Inview Module - Inview Loader and Processor
 *
 */
 
import _ from 'lodash';

export default {
	/*
		Adds the class inviee to all elements that have entered in the view
		Attributes:
			data-inview="scroll"
	*/
	render (selector) {
		selector = selector || '[data-inview="scroll"]:not(.inview):not(.d-none)';
		
		let elements = document.querySelectorAll(selector);
		
		if (!window.Waypoint) {
			_.forEach(elements, (element) => {
				element.classList.add('inview');
			});
			
			return false;
		}
				
		_.forEach(elements, (element) => {
			let inview = new Waypoint.Inview({
				element: element,
				enter (direction) {
					if (direction === 'down') {
						setTimeout(() => {
							element.classList.add('inview');
						}, 10);
					}
					else if (direction === 'up') {
						setTimeout(() => {
							element.classList.remove('inview-exited');
						}, 10);
					}
				},
				exited (direction) {
					setTimeout(() => {
						element.classList.add('inview-exited');
					}, 10);
				}
			});
		});
	}
}