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

import { get, size } from 'lodash';
import geoIP from 'geoip-lite';
import moment from 'moment';
import UAParser from 'ua-parser-js';
import UserAgent from 'user-agents';

module.exports = {
	method: 'POST',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.app.analytics - DEBUG:  `%s`', req.query.debug);
		
		const uaparser = new UAParser(get(req.headers, 'user-agent'));
		const update = process.env.APP_ANALYTICS_UPDATE === 'true';
		
		let endpoint = __app.helpers.core.api.endpoint('analytics');
		let analytics = req.body.analytics;
		
		if (!size(analytics)) return res.status(403).send();
		
		let path = analytics.url;
		
		let page = __app.helpers.core.page.get(get(__app.data, 'pages'), req);
		
		/*
			Parse and build the browser information from the user agent
		*/
		
		let agent = uaparser.getResult();	
		let browser = {
			name: get(agent, 'browser.name'),
			version: get(agent, 'browser.version'),
			major: get(agent, 'browser.major'),
			operating_system_name: get(agent.os, 'name'),
			operating_system_version: get(agent.os, 'version'),
			device_vendor: get(agent.device, 'vendor'),
			device_model: get(agent.device, 'model'),
			device_type: get(agent.device, 'type'),
			engine_name: get(agent.engine, 'name'),
			engine_version: get(agent.engine, 'version'),
			user_agent: uaparser.getUA()
		};
		
		/*
			Append additional analytics information to the analytics object
		*/
	
		analytics.page = analytics.page || page.id;
		analytics.ip_address = req.ip_address;
		analytics.view_width = get(req.headers, 'window-width');
		analytics.view_height = get(req.headers, 'window-height');
		analytics.screen_width = get(req.headers, 'screen-width');
		analytics.screen_height = get(req.headers, 'screen-height');
		
		/*
			Parse and build the location information for the IP Address
		*/
		
		let iplocation = geoIP.lookup(analytics.ip_address);
		let location = {
			ip_address: analytics.ip_address,
			city: iplocation.city,
			region: iplocation.region,
			country: iplocation.country,
			time_zone: iplocation.timezone,
			latitude: iplocation.ll[0],
			longitude: iplocation.ll[1]
		};
		
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
				update: update,
		        analytics: analytics,
		        browser: browser,
		        location: location
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
