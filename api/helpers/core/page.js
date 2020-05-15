/**
 * Page Helper
 *
 * @author :: Philleep Florence
 * @module      :: Page Helper
 * @description :: Page Helpers - Get page or prevent non-privileged users from privileged pages
 *
 */
 
import { filter, forEach, get, intersection, size } from 'lodash';

module.exports = {
	
	/*
		Get current page via req.path - Filter by explicit path or by dynamic path max match!
	*/
	
	get: function (input, req) {
	
		__app.debugger.info('api.helpers.core.page.get');
		
		let pages = {...input};
		let page = {};
			
		let Paths = String(req.path).split('/').filter(Boolean);
		let max = 0;
		
		page = filter(pages, function (row)
		{
			return row.path === req.path;
		});
		
		if (size(page) === 1) return page[0];
		
		forEach(pages, function(row)
		{ 
			let num = (row.path.match(/:/g) || []).length;			
			let paths = String(row.path).split('/').filter(Boolean);
			let currintersection = intersection(Paths, paths);
			let diff = paths.length - num;
			
			if (num && Paths.length === paths.length && Paths[0] == paths[0] && currintersection.length === diff)
			{
				max = max < diff ? diff : max;
							
				row.intersection = diff;
			}
			else row.intersection;							
		});
		
		let filtered = filter(pages, function(row)
		{ 
			return row.intersection === max;
		});
		
		page = get(filtered, 0, {});	
			
		return page;		
	},
	
	/*
		Make sure the current user has the required privilege to view current page
		String - Login
		True - forbidden
		False - Allowed
	*/
	
	forbidden: function (page, req)
	{
		let path = req.path;
		let userprivilege = Number(get(req.me, 'privilege', 0));		
		let privilege = Number(get(page, 'privilege', 0));
		
		__app.debugger.info('api.helpers.core.page.forbidden - Page Privilege: %s - User Privilege: %s - Current Path: %s', privilege, userprivilege, path);
		
		if (privilege && !userprivilege) return 'login';
		else if (privilege > userprivilege) return true;
		else return false;
	}
}