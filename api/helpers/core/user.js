/**
 * User Helper
 *
 * @author :: Philleep Florence
 * @module      :: User Helper
 * @description :: User Helper - Process and normalize user data, removing sensitive properties and values and normalizing metadata.
 *
 */
 
import _ from 'lodash';
import moment from 'moment';

module.exports = function (input, mode, req) {
	
	mode = mode || 'session';
	
	__app.debugger.info('api.helpers.core.user - Mode: %s', mode);
	
	let user = {}, temp = {}, columns = {
		session: [
			"id", 
			"first_name", 
			"last_name", 
			"username", 
			"email", 
			"telephone",
			"image",
			"location",
			"notifications_frequency"
		],
		account: [
			"salt", 
			"password", 
			"login_token", 
			"reset_token"
		]
	};
	    
    /*
	    Set user privilege and permission!
    */
    
    let permission = _.get(input, 'privilege.id', _.get(input, 'privilege'));
    
    user.privilege = permission;
    
    let privileges = _.get(__app.data, 'privileges');
    let dateformat = _.get(__app.data, 'configuration.application.format.datetime') || 'LLLL';
    
    if (permission && privileges) _.set(user, 'permission', _.get(privileges, permission));
    else if (!privileges && _.get(input, 'privilege.data.id')) _.set(user, 'permission', _.get(input, 'privilege.data'));
    	    
    switch (mode)
	{
		/*
			Build User Session Object
		*/
		
		case 'session':
			
			for (let i in columns.session)
			{
				let index = columns.session[i];
				let value = _.get(input, index);
				
				_.set(user, index, value);
			}			
		
		break;
		
		/*
			Sanitize User Account Object - Remove or encrypt sensitive fields
		*/
		
		case 'account':
		
			user = Object.assign({}, input, user);
			
			for (let i in columns.account)
			{
				let field = columns.account[i];
				
				if (_.get(user, field)) _.set(user, field, null);
			}
			
			/*
				Set User Permissions - granular privileges
			*/
			
			let permissions = _.get(input, 'permissions');
				temp = {};
			
			if (Array.isArray(permissions))
			{
				permissions.forEach(function (row)
				{
					_.setWith(temp, row.id, row.privilege);
				});
			}
			
			user.permissions = temp;
	
			/*
				Set User Notifications
			*/
			
			let notifications = _.get(input, 'notifications');
				temp = {};
			
			if (Array.isArray(notifications))
			{
				notifications.forEach(function (row)
				{
					let keys = `${ row.notification.slug }.${ row.notification.mode }`.toLowerCase();
					
					_.setWith(temp, keys, row.notification);
				});
			}
			
			user.notifications = temp;
	
			/*
				Set User Form Submissions
			*/
			
			let forms = _.get(input, 'forms');
				temp = {};
			
			if (Array.isArray(forms))
			{
				forms.forEach(function (row)
				{
					row.user = null;
					row.form = row.form.slug;
					
					let keys = `${ row.created }.${ row.key }`.toLowerCase();
					
					_.setWith(temp, keys, row);
				});
			}
			
			user.forms = temp;
		
		break;
	}
			
	/*
		Set User Metadata - using key:value
	*/
	
	let metadata = _.get(input, 'metadata');
		temp = {};
	
	if (Array.isArray(metadata))
	{
		metadata.forEach(function (row)
		{
			row.user = null;
			
			_.set(temp, row.key, row.value);
		});
	}
	
	user.metadata = temp;	
	
	user.name = `${ _.get(user, 'first_name') } ${ _.get(user, 'last_name') }`;
	
	user.formatted = {};
	
	if (!user.initials && user.first_name && user.last_name) user.initials = user.first_name.charAt(0) + user.last_name.charAt(0);
	
	if (_.get(user, 'created')) _.set(user, 'formatted.created', ( moment(_.get(user, 'created')).format(dateformat) ));
	
	if (_.get(user, 'updated')) _.set(user, 'formatted.updated', ( moment(_.get(user, 'updated')).format(dateformat) ));
	
	if (_.get(user, 'last_login')) _.set(user, 'formatted.login', ( moment(_.get(user, 'last_login')).format(dateformat) ));
		
	user.privilege = _.get(user, 'permission.privilege', user.privilege);
	
	if (!_.get(user, 'image.id')) 
	{
		user.image = {
			url: __app.helpers.core.gravatar({
				size: 960,
				email: user.email
			}, req),
			thumbnail_url: __app.helpers.core.gravatar({
				size: 320,
				email: user.email
			}, req)
		}
	}
	else if (user.image) {
		user.image = {
			name: _.get(user, 'image.filename_disk'),
			url: _.get(user, 'image.data.url')
		};
	}
			
    return user;
}
