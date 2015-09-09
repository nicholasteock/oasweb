'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:DeleteconfirmationCtrl
 * @description
 * # DeleteconfirmationCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('DeleteconfirmationCtrl', ['$scope', '$modalInstance', 'modalInfo', function ($scope, $modalInstance, modalInfo) {
		$scope.response = false;
		$scope.deletetype = modalInfo.type;

		$scope.confirm = function () {
			$modalInstance.close(true);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}])
	.directive('deleteconfirmation', function() {
		return {
			templateUrl: 'views/modal/deleteconfirmation.html'
		}
	});