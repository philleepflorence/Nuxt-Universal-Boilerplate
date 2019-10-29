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
	    
    /* Set user privilege and permission! */
    
    let permission = _.get(input, 'privilege.data.id', _.get(input, 'privilege'));
    
    user.privilege = permission;
    
    let privileges = _.get(__app.data, 'privileges');
    let dateformat = _.get(__app.data, 'configuration.application.format.datetime') || 'LLLL';
    
    if (permission && privileges) _.set(user, 'permission', _.get(privileges, permission));
    else if (!privileges && _.get(input, 'privilege.data.id')) _.set(user, 'permission', _.get(input, 'privilege.data'));
    	    
    switch (mode)
	{
		/* Build User Session Object */
		
		case 'session':
			
			for (let i in columns.session)
			{
				let index = columns.session[i];
				let value = _.get(input, index);
				
				_.set(user, index, value);
			}			
		
		break;
		
		/* Sanitize User Account Object - Remove or encrypt sensitive fields */
		
		case 'account':
		
			user = Object.assign({}, input, user);
			
			for (let i in columns.account)
			{
				let field = columns.account[i];
				
				if (_.get(user, field)) _.set(user, field, null);
			}
			
			/* Set User Permissions - using permissions:row */
			
			let permissions = _.get(input, 'permissions.data') || _.get(input, 'permissions');
				temp = {};
			
			if (Array.isArray(permissions))
			{
				permissions.forEach(function (row)
				{
					_.setWith(temp, row.id, row);
				});
			}
			
			user.permissions = temp;
	
			/* Set User Initials, Notifications, Dates, and Images */
			
			if (_.get(input, 'notifications.data'))
			{
				let notifications = _.get(input, 'notifications.data');
				let junction = _.get(input, 'notifications.junction.data');
				
				_.forEach(junction, function (row, index)
				{
					row.name = _.get(notifications[index], "name");
					row.description = _.get(notifications[index], "description");
					row.slug = _.get(notifications[index], "slug");
				});
				
				_.set(user, 'notifications', junction);
			}
		
		break;
	}
			
	/* Set User Metadata - using key:value */
	
	let metadata = _.get(input, 'metadata.data');
		temp = {};
	
	if (Array.isArray(metadata))
	{
		metadata.forEach(function (row)
		{
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
	
	if (_.get(user, 'image.data')) _.set(user, 'image', ( _.get(user, 'image.data') ));
	
	user.privilege = _.get(user, 'permission.privilege', user.privilege);
	
	if (!user.image) user.image = {
		url: __app.helpers.core.gravatar({
			size: 960,
			email: user.image
		}, req),
		thumbnail_url: __app.helpers.core.gravatar({
			size: 320,
			email: user.image
		}, req)
	}
			
    return user;
}
