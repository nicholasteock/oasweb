'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:MaterialcostsummarymodalCtrl
 * @description
 * # MaterialcostsummarymodalCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('MaterialcostsummarymodalCtrl', [
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
	.directive('materialcostsummary-modal', function() {
		return {
			templateUrl: 'views/modal/materialcostsummarymodal.html'
		};
	});
