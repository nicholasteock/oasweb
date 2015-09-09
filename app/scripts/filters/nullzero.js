'use strict';

/**
 * @ngdoc filter
 * @name oasApp.filter:nullzero
 * @function
 * @description
 * # nullzero
 * Filter in the oasApp.
 */
angular.module('oasApp')
	.filter('nullzero', function () {
		return function (input) {
			if(input == null || input === undefined) return 0;
			else return input;
		};
	});
