/**
 * Api.js
 *
 * @author 		:: Philleep Florence
 * @description :: Holds Routes Configuration.
 * @directory 	:: api/config
 */

module.exports = {
	server: {
		middleware: {
			exclude: ['/_nuxt/', '.map']
		}
	}	
}