/**
 * Validator Helper
 *
 * @author 		:: Philleep Florence
 * @module      :: Logger Helper
 * @description :: Logger Helper - Validates inputs before creation - use in Controllers before inserting to Model.
 * @doc			:: https://www.npmjs.com/package/validator
 *
 */
 
import _ from 'lodash';
import validator from 'validator';
import S from 'string';

module.exports = function (input, rows, req) {
	
	__app.debugger.info('api.helpers.core.validator');
		
	if (!rows || !Object.keys(rows).length || !input) return true;

	let result = {
		error: []
	};
	let ID = _.get(input, 'id');
	
	loopRows:

	for (let row of rows)
	{
		let method = row.validate;
		let label = S(row.label || row.property).humanize().s;
		let currInput = _.get(input, row.property);
		let defined = typeof currInput !== "undefined";
		let declared = defined && currInput !== null;

		/*
			First check if fields are required and empty - array
		*/

		if ((Array.isArray(row.required) && !declared && !ID) || (ID && Array.isArray(row.required) && defined && !declared))
		{
			
			loopRequired:
			
			for (let required of row.required)
			{
				let otherinput = _.get(input, required);
				
				if (String(otherinput).length)
				{
					result.error.push(label + ' - Required!');
					
					continue loopRows;
				}
			}				
		}

		/*
			First check if fields are required and empty - boolean
		*/

		if ((!ID && row.required === true && !declared) || (ID && row.required === true && defined && !declared))
		{
			result.error.push(label + ' - Required!');

			continue loopRows;
		}

		/*
			Compare with another field to make sure they match
		*/

		if (Array.isArray(row.compare) && declared)
		{
			loopCompare:
			
			for (let compare of row.compare)
			{
				let otherinput = _.get(input, compare);
				
				if (currInput !== otherinput)
				{
					result.error.push(label + ' - Must match <u>' + S(compare).humanize().s + '</u>!');
					
					continue loopRows;
				}
			}
		}

		/*
			Check for max size if applicable
		*/

		if (declared && currInput.length && row.max && currInput.length > row.max)
		{
			result.error.push(label + ' - Maximum Characters:  ' + row.max + '!');

			continue loopRows;
		}

		/*
			Check for min size if applicable
		*/

		if (declared && currInput.length && row.min && currInput.length < row.min)
		{
			result.error.push(label + ' - Minimum Characters:  ' + row.min + '!');

			continue loopRows;
		}

		/*
			Check for validation using validator method
		*/

		if (declared && method && typeof validator[method] === 'function' && validator[method](currInput) === false)
		{
			result.error.push(label + ' - Failed Validation!');

			continue loopRows;
		}

		/*
			Check for validation using validator regex method
		*/

		if (declared && method && typeof validator.matches === 'function' && method instanceof RegExp && validator.matches(currInput, method) === false)
		{
			result.error.push(label + ' - Failed Validation!');

			continue loopRows;
		}
	}

	if (result.error.length) return result;
	else return true;		
}