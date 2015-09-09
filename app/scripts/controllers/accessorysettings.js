'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AccessorysettingsCtrl
 * @description
 * # AccountsettingsCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AccessorysettingsCtrl', [
		'$rootScope',
		'$scope',
		'$modal',
		'$filter',
		'MaterialsService',
		function ($rootScope, $scope, $modal, $filter, MaterialsService) {
			var toggleAccessoriesInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.accessoryParams.page) {
					console.log('accessory limit reached');
					$scope.enableInfiniteScroll = false;
				}
				else {
					$scope.enableInfiniteScroll = true;
				}
			};

			$scope.enableInfiniteScroll = false;

			$scope.editAccessorySettings = false;

			$scope.accessoryParams = {
				name 			: undefined,
				page 			: 1
			};

			$scope.newAccessory = {
				name 	: undefined,
				price 	: undefined
			};

			$scope.materialsService = MaterialsService;
			$scope.materialsService.accessories = MaterialsService.accessories;

			$scope.$on('tab_changed', function() {
				$('.table-container').scrollTop(0);
				$scope.enableInfiniteScroll = false;
			});

			$scope.$on('update_accessorysettings', function(event, reset) {
				console.log('update_accessorysettings triggered', reset);
				if(reset) {
					// $rootScope.$broadcast('reset');
					$scope.enableInfiniteScroll = false;
					$scope.accessoryParams = {
						name 			: undefined,
						page 			: 1
					};
					$scope.newAccessory = {
						name 	: undefined,
						price 	: undefined
					};
				}
				$scope.materialsService.getAccessoriesList($scope.accessoryParams, $scope.session.user).then(toggleAccessoriesInfiniteScroll);
			});

			$scope.$on('accessories_search', function(event, query) {
				console.log('accessory search triggered : ', query);
				$scope.enableInfiniteScroll = false;
				$scope.accessoryParams.name = query;
				$scope.accessoryParams.page = 1;
				$scope.materialsService.getAccessoriesList($scope.accessoryParams, $scope.session.user).then(toggleAccessoriesInfiniteScroll);
			});

			$scope.nextPage = function() {
				if(!$scope.enableInfiniteScroll) {
					return;
				}
				console.log('accessory settings nextPage');
				$scope.accessoryParams.page += 1;
				$scope.materialsService.getAccessoriesList($scope.accessoryParams, $scope.session.user).then(toggleAccessoriesInfiniteScroll);
			};

			$scope.editMode = false;

			$scope.addAccessory = function() {
				console.log('Adding new accessory : ', $scope.newAccessory);
				$scope.materialsService.addAccessory($scope.newAccessory, $scope.session.user).then(function(response) {
					console.log('add accessory done', response);
					if(response.result === 'success') {
						$rootScope.$broadcast('update_accessorysettings', true);
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

			$scope.updateAccessory = function(params) {
				console.log('updateAccessory : ', params);

				$scope.materialsService.updateAccessory(params, $scope.session.user).then(function(response) {
					console.log('updateAccessory done', response);
					if(response.result === 'success') {					
						// $rootScope.$broadcast('update_accessorysettings');
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

			$scope.deleteAccessory = function(id) {
				var modalInstance = $modal.open({
					templateUrl   : 'views/modal/deleteconfirmation.html',
					controller    : 'DeleteconfirmationCtrl',
					backdrop      : 'static',
					backdropClass : 'backdrop-oas',
					size          : 'sm',
					windowClass   : 'modal-oas vertical-center deleteconfirmation-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								type: 'accessory'
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if(confirm) {
						console.log('Deleting accessory : ', id);
						$scope.materialsService.deleteAccessory(id, $scope.session.user).then(function(response) {
							if(response.result === 'success') {
								console.log('delete accessory done', response);
								var deletedAccessory, deleteIndex;
								deletedAccessory 	= $filter('filter')($scope.materialsService.accessories, {id: id});
								deleteIndex 		= $scope.materialsService.accessories.indexOf(deletedAccessory[0]);
								$scope.materialsService.accessories.splice(deleteIndex, 1);
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
					}
					return;
				});
			};
		}
	])
	.directive('settingsAccessories', function() {
		return {
			templateUrl: 'views/accessorysettings.html'
		};
	});
