'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:MaterialcostitemCtrl
 * @description
 * # MaterialcostitemCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('MaterialcostitemCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    	$scope.updateMaterialCost = function(params) {
			console.log('updateMaterialCost : ', params);

			$scope.materialsService.updateMaterialCost(params, $scope.session.user).then(function(response) {
				console.log('update material cost done', response);
				if(response.result === 'success') {					
					$rootScope.$broadcast('update_materialscost');
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
	.directive('materialcostitem', function() {
		return {
			templateUrl: 'views/materialcostitem.html'
		};
	});
