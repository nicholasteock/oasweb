'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AttendancesummaryentryCtrl
 * @description
 * # AttendancesummaryentryCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AttendancesummaryentryCtrl', ['$scope', function ($scope) {
		
		$scope.entryIncomplete = false;

		// if( $scope.entry.incomplete === 1 ||
		// 	$scope.entry.check_out_photo_url === null ||
		// 	$scope.entry.check_out_photo_url === "" ) {
		// 	$scope.entryIncomplete = true;
		// }

		if( $scope.entry.incomplete === 1 ) {
			$scope.entryIncomplete = true;
		}

		switch($scope.entry.type_code) {
			case 0:
				$scope.entry.color = 'red-bar';
				break;
			case 1:
				if($scope.entry.incomplete===1) {
					$scope.entry.color = 'red-bar';
				}
				else {
					$scope.entry.color = 'blue-bar';
				}
				break;
			case 2:
				$scope.entry.color = 'green-bar';
				break;
			case 3:
				$scope.entry.color = 'green-bar';
				break;
			case 4:
				$scope.entry.color = 'purple-bar';
				break;
		};
	}]).directive('attendanceSummaryEntry', function() {
		return {
			templateUrl: 'views/modal/attendancesummaryentry.html'
		};
	});
