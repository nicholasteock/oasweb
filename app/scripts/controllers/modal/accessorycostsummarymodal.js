'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AccessorycostsummarymodalCtrl
 * @description
 * # AccessorycostsummarymodalCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
.controller('AccessorycostsummarymodalCtrl', [
		'$scope',
		'$modalInstance',
		'modalInfo',
		function ($scope, $modalInstance, modalInfo) {
			$scope.projectName 	= modalInfo.projectName;
			$scope.data 		= modalInfo.data;

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}
	])
	.directive('accessorycostsummary-modal', function() {
		return {
			templateUrl: 'views/modal/accessorycostsummarymodal.html'
		};
	});
