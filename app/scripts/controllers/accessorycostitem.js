'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AccessorycostitemCtrl
 * @description
 * # AccessorycostitemCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AccessorycostitemCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
		$scope.updateAccessoryCost = function(params) {
			console.log('updateAccessoryCost : ', params);

			$scope.materialsService.updateAccessoryCost(params, $scope.session.user).then(function(response) {
				console.log('update accessory cost done', response);
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
	.directive('accessorycostitem', function() {
		return {
			templateUrl: 'views/accessorycostitem.html'
		};
	});
