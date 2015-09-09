'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:CreateprojectCtrl
 * @description
 * # CreateprojectCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('CreateprojectCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
		$scope.projectParams = {
			name 			: '',
			abbrev_name 	: '',
			developer_name 	: '',
			main_contractor : '',
			contractor_sum 	: '',
			start_date 		: '',
			top_date 		: '',
			address 		: ''
		};

		$scope.ok = function() {
			console.log('in ok : ', $scope.projectParams);

			$modalInstance.close($scope.projectParams);
		};

		// Clear form if modal cancelled.
		$scope.cancel = function() {
			$scope.projectParams = {
				name 			: '',
				abbrev_name 	: '',
				developer_name 	: '',
				main_contractor : '',
				contractor_sum 	: '',
				start_date 		: '',
				top_date 		: '',
				address 		: ''
			};

			$modalInstance.dismiss('cancel');
		};
	}]);
