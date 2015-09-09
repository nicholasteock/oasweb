'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AttendancelocationmodalCtrl
 * @description
 * # AttendancelocationmodalCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AttendancelocationmodalCtrl', [
		'$scope',
		'$modalInstance',
		'modalInfo',
		'BingMapsService',
		function ($scope, $modalInstance, modalInfo, BingMapsService) {
			var latitude, longitude;

			$scope.entry 		= modalInfo.entry;
			$scope.isCheckIn 	= (modalInfo.type === 'checkin');

			$scope.bingMapsService = BingMapsService;

			if($scope.isCheckIn) {
				latitude 	= $scope.entry.check_in_latitude;
				longitude 	= $scope.entry.check_in_longitude;
			}
			else {
				latitude 	= $scope.entry.check_out_latitude;
				longitude 	= $scope.entry.check_out_longitude;
			}

			$scope.mapImage = $scope.bingMapsService.getMap(latitude, longitude);

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}
	]);
