/**
 * Alert Module
 *
 * @author 		:: Philleep Florence
 * @module      :: Alert Module
 * @description :: Alert Module - Usage: Displays alert messages!
 * @dependents 	:: https://ned.im/noty
 * Attributes	::
 *		message - @htmlstring, message to alert,
 *		type - alert, success, error, warning, info, defaults to alert,
 *		params - @object
 */
 
import _ from 'lodash';
import handlebars from 'handlebars/dist/handlebars.min.js';
import Noty from 'noty';

export default  {
	show (message, type, params) {
		if (typeof message !== 'string') return false;
		
		type = type || 'alert';
		params = params || {};
		
		params.delay = params.delay || 8000;
		
		if (type === 'error') params.delay = 15000;
		
		if (params.list && Array.isArray(params.list)) message = message + " <ol><li>" + params.list.join('</li><li> ') + "</li></ol>";
		
		let options = {
			theme: 'nest',
			type: type,
			text: message,
			layout: params.position || 'bottomRight',
			timeout: params.delay,
			animation: {
				open: 'animated fadeInUp',
				close: 'animated fadeOutUp'
			}
		};
		
		if (params.callback === 'function') options.onclick = params.callback;
		
		if (!params.confirm) options.closeWith = 'click';
		
		let noty = new Noty(options);
		
		noty.show();
		
		return noty;
	}		
}