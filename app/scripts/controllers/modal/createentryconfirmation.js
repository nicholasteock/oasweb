'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:CreateentryconfirmationCtrl
 * @description
 * # CreateentryconfirmationCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('CreateentryconfirmationCtrl', ['$scope', '$modalInstance', 'modalInfo', function ($scope, $modalInstance, modalInfo) {
  		$scope.modalInfo = modalInfo;

  		$scope.isEntryType = function(entryType) {
  			return modalInfo.type === entryType;
  		};

  		$scope.confirm = function() {
  			$modalInstance.close(true);
  		};

  		$scope.cancel = function() {
  			$modalInstance.dismiss('cancel');
  		};
	}])
	.directive('createentryconfirmation', function() {
		return {
			templateUrl: 'views/modal/createentryconfirmation.html'
		};
	});