'use strict';

/**
 * @ngdoc filter
 * @name oasApp.filter:isforeigner
 * @function
 * @description
 * # isforeigner
 * Filter in the oasApp.
 */
angular.module('oasApp')
	.filter('isforeigner', function () {
		return function (input) {
	  		if(input === 1) return 'Foreigner';
	  		return 'Local';
		};
	});
