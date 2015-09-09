'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AttendancesummarymodalCtrl
 * @description
 * # AttendancesummarymodalCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AttendancesummarymodalCtrl', ['$scope', '$modalInstance', 'modalInfo', function ($scope, $modalInstance, modalInfo) {
		console.log('AttendancesummarymodalCtrl modalInfo : ', modalInfo);
		$scope.employee 	= modalInfo.employee;
		$scope.month 		= modalInfo.month;
		$scope.year 		= modalInfo.year;
		$scope.data 		= modalInfo.data;

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);
