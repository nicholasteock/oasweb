'use strict';

/**
 * @ngdoc directive
 * @name oasApp.directive:dateInput
 * @description
 * # dateInput
 */
angular.module('oasApp')
	.directive('dateInput', ['dateFilter', function(dateFilter) {
			return {
				require: 'ngModel',
				template: '<input type="date"></input>',
				replace: true,
				link: function(scope, elm, attrs, ngModelCtrl) {
					ngModelCtrl.$formatters.unshift(function (modelValue) {
						return dateFilter(modelValue, 'yyyy-MM-dd');
					});
					
					ngModelCtrl.$parsers.unshift(function(viewValue) {
						return new Date(viewValue);
					});
				},
			};
	}]);
