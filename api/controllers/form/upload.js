/**
 * Express Controller
 *
 * @author 		:: Philleep Florence
 * @module      :: Express Controller
 * @description :: Express Server Controller - Upload and Create a file in the API - Requires DataURI in the Body.
 * @docs        :: https://nuxtjs.org/api/configuration-servermiddleware
 * @directory 	:: api/controllers/upload
 * @method 		:: POST
 *
 */

import { get, set, size } from 'lodash';
import bytes from 'bytes';
import moment from 'moment';

module.exports = {
	method: 'POST',
	/*
		Actual Method to run - REQUIRED
	*/
	async run (req, res) {
		
		__app.debugger.debug('api.controllers.form.upload');
		
		const debug = req.query.debug || req.body.debug;
		const dateformat = get(__app.data, 'configuration.application.format.date') || 'LLLL';
		
		let file = req.body.file;
		let test = await this.test(req, res);
		
		if (req.query.debug === 'test' && !file) file = test.body.file;
				
		if (!size(file)) return res.status(400).send("File is required!");	
		
		let endpoint = __app.helpers.core.api.endpoint('form.upload');
		
		if (debug === 'form') return res.json({
			"endpoint": endpoint,
			"format": dateformat,
			"file": file
		});
		
		const response = await __app.helpers.core.api.connect({
			method: 'post',
			url: endpoint,
			send: file,
			result: 'body'
		}, req);
		
		file = get(response, 'data');
		
		if (!file || response.error) {
			return res.json({
				error: true,
				message: get(response, 'error.message')
			});
		}
		
		let date_uploaded = new Date( file.uploaded_on ).getTime();
		
		set(file, 'formated.size', bytes(file.filesize));
		set(file, 'formated.uploaded', moment(date_uploaded).format(dateformat));
	    
        return res.json({
            success: true,
            file: file
        });
	},
	/*
		Testing Parameters - req.header, req.query, or req.body
	*/
	async test (req, res)
	{
		return {
			query: {
				debug: 'test',
				parse: 'image'
			},
			body: {
				file: {
					data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
					filename_download: "transparent-image-test.png",
					title: "Express Server Controller Unit Test"
				}
			},
			headers: []
		};
	}
}
