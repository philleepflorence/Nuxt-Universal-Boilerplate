/**
 * Api.js
 *
 * @author 		:: Philleep Florence
 * @description :: Holds Form Validation Configuration.
 * @directory 	:: api/config
 */

module.exports = {
	validations: {
		comment: [
			{
				required: true,
				max: 20,
				property: 'table_name'
			},
			{
				required: true,
				max: 11,
				property: 'table_row_id',
				validate: 'isInt'
			},
			{
				required: true,
				property: 'author',
				validate: /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/
			},
			{
				required: true,
				validate: 'isEmail',
				property: 'author_email'
			},
			{
				required: true,
				property: 'content'
			}
		],
		contact: [
			{
				required: true,
				property: 'email',
				validate: 'isEmail'
			},
			{
				required: true,
				property: 'first_name',
				validate: /^[a-zA-Z0-9-' ]*$/
			},
			{
				required: true,
				property: 'last_name',
				validate: /^[a-zA-Z0-9-' ]*$/
			}
		],
		credentials: [
			{
				required: true,
				property: 'email'
			},
			{
				required: true,
				property: 'link'
			}
		],
		register: [
			{
				required: true,
				property: 'email',
				validate: 'isEmail'
			},
			{
				required: true,
				max: 50,
				property: 'first_name',
				validate: /^[a-zA-Z0-9-' ]*$/
			},
			{
				required: true,
				max: 50,
				property: 'last_name',
				validate: /^[a-zA-Z0-9-' ]*$/
			},
			{
				min: 4,
				max: 30,
				property: 'username',
				validate: /^[a-zA-Z0-9-.]*$/
			},
			{
				required: true,
				min: 6,
				max: 64,
				property: 'password',
				encrypt: true
			},
			{
				required: true,
				min: 6,
				max: 64,
				property: 'confirm_password',
				encrypt: true,
				compare: ['password']
			},
			{
				required: false,
				max: 150,
				property: 'secret_question'
			},
			{
				required: false, 
				min: 4,
				property: 'secret_answer',
				encrypt: true
			}
		],
		reset: [
			{
				required: true,
				property: 'email',
				validate: 'isEmail'
			},
			{
				required: true,
				property: 'token'
			},
			{
				required: true,
				min: 6,
				max: 20,
				property: 'password',
				encrypt: true
			},
			{
				required: true,
				min: 6,
				max: 20,
				property: 'confirm_password',
				encrypt: true,
				compare: ['password']
			},
			{
				max: 150,
				property: 'secret_question'
			},
			{
				min: 4,
				property: 'secret_answer',
				encrypt: true
			}
		],
		login: [
			{
				required: true,
				property: 'username'
			},
			{
				required: true,
				min: 6,
				property: 'password'
			}
		],
		subscribe: [
			{
				required: true,
				validate: 'isEmail',
				property: 'email'
			}
		],
		settings: [
			{
				property: 'email',
				validate: 'isEmail'
			},
			{
				property: 'first_name',
				validate: /^[a-zA-Z0-9-' ]*$/
			},
			{
				property: 'last_name',
				validate: /^[a-zA-Z0-9-' ]*$/
			},
			{
				property: 'telephone',
				min: 9,
				max: 15
			},
			{
				property: 'location',
				min: 2,
				max: 150,
				validate: /^[a-zA-Z0-9\s,'-]*$/
			},
			{
				min: 4,
				max: 30,
				property: 'username',
				validate: /^[a-zA-Z0-9-.]*$/
			},
			{
				min: 6,
				max: 64,
				property: 'password',
				encrypt: true
			},
			{
				min: 6,
				max: 64,
				property: 'confirm_password',
				encrypt: true,
				compare: ['password']
			},
			{
				min: 4,
				max: 150,
				property: 'secret_answer',
				encrypt: true
			}
		],
		user: [
			{
				required: true,
				property: 'email',
				validate: 'isEmail'
			},
			{
				required: true,
				property: 'first_name',
				validate: 'isAlpha'
			},
			{
				required: true,
				property: 'last_name',
				validate: 'isAlpha'
			},
			{
				min: 4,
				max: 20,
				property: 'username',
				validate: /^[a-zA-Z0-9-.]*$/
			},
			{
				min: 6,
				max: 64,
				property: 'password',
				encrypt: true
			},
			{
				min: 6,
				max: 64,
				property: 'confirm_password',
				encrypt: true
			},
			{
				min: 4,
				max: 150,
				property: 'secret_answer',
				encrypt: true
			}
		]
	}	
}