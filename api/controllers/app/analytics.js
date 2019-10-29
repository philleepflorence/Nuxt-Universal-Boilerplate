/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Gets analytics from APP and sends to API
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/app
 * @method 		:: POST
 *
 */

import _ from 'lodash';
import moment from 'moment';
import ip from 'ip';
import useragent from 'useragent';
import UserAgent from 'user-agents';

module.exports = {
	method: 'POST',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.app.analytics - DEBUG:  `%s`', req.query.debug);
		
		let endpoint = __app.helpers.core.api.endpoint('analytics');
		let analytics = req.body.analytics;
		
		if (!_.size(analytics)) return res.status(403).send();
		
		let path = analytics.url;
		
		let page = __app.helpers.core.page.get(_.get(__app.data, 'pages'), req);
		let agent = useragent.parse(_.get(req.headers, 'user-agent'));	
		let browser = {
			family: _.get(agent, 'family'),
			major: _.get(agent, 'major'),
			minor: _.get(agent, 'minor'),
			operating_system_family: _.get(agent.os, 'family'),
			operating_system_major: _.get(agent.os, 'major'),
			operating_system_minor: _.get(agent.os, 'minor'),
			device_family: _.get(agent.device, 'family'),
			device_major: _.get(agent.device, 'major'),
			device_minor: _.get(agent.device, 'minor'),
			user_agent: _.get(agent, 'source')
		};
	
		analytics.page = analytics.page || page.id;
		analytics.ip_address = ip.address();
		
		const test = await this.test(req, res);
		
		if (req.query.debug === 'test') return res.json(test);
		
		if (req.query.debug === 'json') return res.json({
			endpoint: endpoint,
			analytics: analytics,
			browser: browser
		});
		
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: {
		        analytics: analytics,
		        browser: browser
	        }
		}, req);
		
		return res.json(response);
	},
	/*
		Testing Parameters - req.query or req.body
	*/
	async test (req, res)
	{
		const userAgent = new UserAgent();
		
		return {
			query: {
				debug: 'json'
			},
			body: {
				analytics: {
					type: 'timing',
					category: 'Page Loaded',
					action: 'load',
					label: 'Express Unit Testing',
					value: 600,
					url: req.path,
					ip_address: '127.0.0.1',
					page: 1
				}
			},
			headers: [
				{ 'User-Agent': userAgent.toString() }
			]
		};
	}
}
