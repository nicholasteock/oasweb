'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:ErrormodalCtrl
 * @description
 * # ErrormodalCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('ErrormodalCtrl', ['$scope', '$modalInstance', 'modalInfo', function ($scope, $modalInstance, modalInfo) {
		$scope.errors = modalInfo.errors;

		$scope.isNotification = modalInfo.isNotification ? modalInfo.isNotification : false;

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}])
	.directive('errormodal', function() {
		return {
			templateUrl: 'views/modal/errormodal.html'
		}
	});