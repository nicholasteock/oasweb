'use strict';

/**
* @ngdoc function
* @name oasApp.controller:AttendancecardCtrl
* @description
* # AttendancecardCtrl
* Controller of the oasApp
*/
angular.module('oasApp')
	.controller('AttendancecardCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
		// $scope.entries = $scope.employee.attendances.reverse();
	}])
	.directive('attendanceCard', function() {
		return {
			templateUrl: 'views/attendancecard.html'
		};
	});
