'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AttendanceinfoCtrl
 * @description
 * # AttendanceinfoCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AttendanceinfoCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
		$scope.entryIncomplete = ($scope.entry.incomplete === 1);

		// Confirm an incomplete entry. Changes incomplete attribute from 1 to 0.
		$scope.confirmEntry = function(employeeId) {
			console.log('Confirm entry', $scope.entry);
			$scope.entry.incomplete = 0;

			var param = {
				id: $scope.entry.id,
				incomplete: 0
			};

			$scope.attendanceService.updateAttendance(employeeId, param, $scope.session.user).then(function(response) {
				if(response.result === 'success') {
					return;
				}
				else {
					switch(response.status) {
						case 422:
							console.error('422: ', response.data);
							$scope.launchErrorModal(response.data);
							break;
						case 401:
							$rootScope.$broadcast('not_authenticated');
							break;
					}
				}
			});
		};
	}])
	.directive('attendanceInfo', function() {
		return {
			templateUrl: 'views/attendanceinfo.html'
		};
	});
