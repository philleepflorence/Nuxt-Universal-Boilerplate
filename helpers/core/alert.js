/**
 * Alert Module
 *
 * @author 		:: Philleep Florence
 * @module      :: Alert Module
 * @description :: Alert Module - Usage: Displays alert messages!
 * @dependents 	:: https://ned.im/noty
 * Attributes	::
 *		message - @htmlstring, message to alert,
 *		type - alert, success, error, warning, info, defaults to alert (false to close all),
 *		params - @object
 */
 
import Noty from 'noty';

export default  {
	close () {
		Noty.closeAll();
	},
	show (message, type, params) {
		if (typeof message !== 'string') return Noty.closeAll();
		
		if (type === false) Noty.closeAll();
		
		type = type || 'alert';
		params = params || {};
		
		let delay = typeof params === "number" ? params : (params.delay || 8000);
		
		if (type === 'error') delay = 15000;
		
		if (params.list && Array.isArray(params.list)) message = message + " <ol><li>" + params.list.join('</li><li> ') + "</li></ol>";
		
		let options = {
			theme: 'nest',
			type: type,
			text: message,
			layout: params.position || 'bottomRight',
			timeout: delay,
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