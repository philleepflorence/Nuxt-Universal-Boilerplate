/**
 * Initialization Helper
 *
 * @author 			:: Philleep Florence
 * @module      	:: Initialization Helper
 * @description 	:: Initialization Helper - Processes and normalizes incoming initialization data
 *
 */
 
import _ from 'lodash';
import Clone from 'deepcopy';

module.exports = {
	/*
		Page Navigation Helper
		Builds Page Navigation, breaking into sections and checking for privilege and authentication
		PARAMETERS:
			navigation - [] - Unprocessed navigation rows
			req - {} - Current request object to get user and path
	*/
	navigation: function (input, req, data)
	{
		__app.debugger.info('api.helpers.core.initialize.navigation');
		
		if (!input || !req) return input;
		
		let sections = {
			header: {},
            footer: {},
            navigation: {},
			authentication: {},
			accounts: {},
			social: {}
		};
        let keys, path;
        let authenticated = _.get(req, 'session.user.id', false);
        let override = req.query.debug === 'navigation' && req.query.token === process.env.TOKEN;
        let privilege = Number( _.get(req, 'session.user.privilege', 0) );
        let processed = 0;
        
        __app.debugger.info('api.helpers.core.initialize.navigation - Authenticated: %s - Privilege: %s', authenticated, privilege);

        /*
            Group Navigation into sections using parent/section
        */

        input.forEach(function (currow)
        {
	        const row = Clone(currow);
	        
            /*
                Only add navigation if public and private parameters pass
            */
            
            let path = _.get(row, 'url') || _.get(row, 'path');
            
            path = path.replace(':domain', process.env.SERVER_DOMAIN);
            
            row.path = path;
            
            let pagePrivilege = Number( row.privilege || 0);
            
            if (!override && ( ( (authenticated && !row.private) || (!authenticated && !row.public) ) || !path || pagePrivilege > privilege )) return;
                                                	
            if (row.icon && row.pageicon) delete row.pageicon;
            else if (row.pageicon && !row.icon) _.set(row, 'icon', row.pageicon);
            
            if (row.pageColor && !row.color) row.color = row.pageColor;
            
            if (!row.description) row.description = row.title;
            
            row.headline = row.headline || _.get(row, 'page.headline');
            
            if (req.path === path) row.active = true;
            else row.active = false;
            
            processed++;
                        
            /*
                Header Navigation grouped by Parent or Self
            */

            if (row.header)
            {
                keys = row.parent && row.dropdown ? ':parent.rows.:name'.replace(':parent', row.parent).replace(':name', row.name) : row.name;

                if (!row.parent) _.set(sections.header, keys, row);
            }

            /*
                Footer Navigation grouped only by Section or Self
            */

            if (row.footer) _.set(sections.footer, row.name, row);

            /*
                Main Navigation grouped only by Section or Self
            */

            if (row.navigation)
            {
                keys = ':section.:name'.replace(':section', row.section || 0).replace(':name', row.slug);

                _.set(sections.navigation, ':section.:name'.replace(':section', row.section || row.slug).replace(':name', row.slug), row);
                
                if (row.parent) 
                {
	                keys = ':section.:parent.rows.:name'.replace(':section', row.section || row.slug).replace(':parent', row.parent).replace(':name', row.slug);
	                
	                _.set(sections.navigation, keys, Clone(row));
                }
            }

            /*
                Authentication Navigation
            */

            if (row.authentication) _.set(sections.authentication, row.name, row);

            /*
                User Accounts Navigation
            */

            if (row.accounts) _.set(sections.accounts, row.name, row);

            /*
                Social Navigation
            */

            if (row.social || row.section === 'social') _.set(sections.social, row.name, row);
        });
        
        return sections;
	}	
}