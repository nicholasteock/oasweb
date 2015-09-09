'use strict';

/**
 * @ngdoc service
 * @name oasApp.HTTPPARAMS
 * @description
 * # HTTPPARAMS
 * Constant in the oasApp.
 */
angular.module('oasApp')
	.constant('HTTP_PARAMS', {
		prodApi 	: 'http://api.oaspainting.com/v1/',
		devApi 		: 'http://54.169.2.173/v1/',
		appSecret 	: '992bb2ecb4aca0986c898f19801731d1297220bb857961a0bd2661d5d327c4a2'
	});
