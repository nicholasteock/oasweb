'use strict';

/**
 * @ngdoc directive
 * @name oasApp.directive:validators
 * @description
 * # validators
 */

var CURRENCY_REGEXP = /^\d+(\.\d{1,2})?$/;
angular.module('oasApp')
	.directive('currency', function() {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				ctrl.$validators.currency = function(modelValue, viewValue) {
					// console.log('checking currency', viewValue);
					// Consider empty to be valid (use required)
					if (ctrl.$isEmpty(viewValue)) {
						return true;
					}

					if (CURRENCY_REGEXP.test(viewValue)) {
						return true;
					}

					return false;
				};
			}
		};
	})
	.directive('supervisorRequired', function() {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				ctrl.$validators.supervisorRequired = function(modelValue, viewValue) {
					console.log('checking supervisor-required', attrs.position);
					var position = attrs.position;

					if(position === 'Worker') return true;

					if (ctrl.$isEmpty(viewValue)) {
						return false;
					}

					return true;
				};
			}
		};
	})
	.directive('earlierThan', function() {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				ctrl.$validators.earlierThan = function(modelValue, viewValue) {
					// console.log('checking earlier-than', attrs.datelimit);

					// Consider empty to be valid (use required)
					if (ctrl.$isEmpty(viewValue)) {
						return true;
					}

					if(!attrs.datelimit) {
						return true;
					}

					var datelimit 	= attrs.datelimit;
					var viewDate 	= Date.parse(viewValue);

					if(datelimit === 'today') {
						datelimit = new Date();
						datelimit = Date.parse(datelimit);
					}
					else {
						datelimit 	= Date.parse(datelimit.substring(1,20));
					}

					if(viewDate > datelimit) {
						return false;
					}

					return true;
				};
			}
		};
	})
	.directive('laterThan', function() {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				ctrl.$validators.laterThan = function(modelValue, viewValue) {
					// console.log('checking later-than', attrs.datefloor);

					// Consider empty to be valid (use required)
					if (ctrl.$isEmpty(viewValue)) {
						return true;
					}

					if(!attrs.datefloor) {
						return true;
					}

					var datefloor 	= attrs.datefloor;
					var viewDate 	= Date.parse(viewValue);

					if(datefloor === 'today') {
						datefloor = new Date();
						datefloor = Date.parse(datefloor);
					}
					else {
						datefloor 	= Date.parse(datefloor.substring(1,20));
					}
					
					if(viewDate < datefloor) {
						return false;
					}

					return true;
				};
			}
		};
	});
	// .directive('datepickerPopup', function (){
	// 	return {
	// 		restrict: 'EAC',
	// 		require: 'ngModel',
	// 		link: function(scope, element, attr, controller) {
	// 			//remove the default formatter from the input directive to prevent conflict
	// 			controller.$formatters.shift();
	// 		}
	// 	};
	// });