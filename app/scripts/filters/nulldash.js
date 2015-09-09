'use strict';

/**
 * @ngdoc filter
 * @name oasApp.filter:nulldash
 * @function
 * @description
 * # nulldash
 * Filter in the oasApp.
 */
angular.module('oasApp')
	.filter('nulldash', function () {
		return function (input) {
			if(input == null || input === undefined) return '-';
			else return input;
		};
	});
