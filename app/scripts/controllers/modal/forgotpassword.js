'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('ForgotpasswordCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
		$scope.email = '';

		$scope.ok = function (email) {
			$modalInstance.close(email);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);