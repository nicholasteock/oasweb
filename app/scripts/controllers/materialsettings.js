'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:MaterialsettingsCtrl
 * @description
 * # AccountsettingsCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('MaterialsettingsCtrl', [
		'$rootScope',
		'$scope',
		'$modal',
		'$filter',
		'MaterialsService',
		function ($rootScope, $scope, $modal, $filter, MaterialsService) {
			var toggleMaterialsInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.materialParams.page) {
					console.log('materials limit reached');
					$scope.enableInfiniteScroll = false;
				}
				else {
					$scope.enableInfiniteScroll = true;
				}
			};

			$scope.firstLoad = true;

			$scope.enableInfiniteScroll = false;

			$scope.editMaterialSettings = false;

			$scope.materialParams = {
				name 			: undefined,
				page 			: 1
			};

			$scope.newMaterial = {
				name 	: undefined,
				color 	: undefined,
				supplier: undefined,
				price 	: undefined,
				remark 	: undefined
			};

			$scope.materialsService = MaterialsService;
			$scope.materialsService.materials = MaterialsService.materials;

			$scope.$on('tab_changed', function() {
				// $('.table-container').scrollTop(0);
				// $scope.enableInfiniteScroll = false;
			});

			$scope.$on('update_materialsettings', function(event, reset) {
				console.log('update_materials triggered', reset);
				if(reset || $scope.firstLoad) {
					$scope.firstLoad = false;
					$scope.enableInfiniteScroll = false;
					$scope.materialParams = {
						name 			: undefined,
						page 			: 1
					};
					$scope.newMaterial = {
						name 	: undefined,
						color 	: undefined,
						supplier: undefined,
						price 	: undefined,
						remark 	: undefined
					};
					$scope.materialsService.getMaterialsList($scope.materialParams, $scope.session.user).then(toggleMaterialsInfiniteScroll);
				}
			});

			$scope.$on('materials_search', function(event, query) {
				console.log('materials search triggered : ', query);
				$scope.enableInfiniteScroll = false;
				$scope.materialParams.name = query;
				$scope.materialParams.page = 1;
				$scope.materialsService.getMaterialsList($scope.materialParams, $scope.session.user).then(toggleMaterialsInfiniteScroll);
			});

			$scope.nextPage = function() {
				if(!$scope.enableInfiniteScroll) {
					return;
				}
				console.log('material settings nextPage');
				$scope.materialParams.page += 1;
				$scope.materialsService.getMaterialsList($scope.materialParams, $scope.session.user).then(toggleMaterialsInfiniteScroll);
			};

			$scope.editMode = false;

			$scope.addMaterial = function() {
				console.log('Adding new material : ', $scope.newMaterial);
				$scope.materialsService.addMaterial($scope.newMaterial, $scope.session.user).then(function(response) {
					console.log('add material done', response);
					if(response.result === 'success') {
						$rootScope.$broadcast('update_materialsettings', true);
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

			$scope.updateMaterial = function(params) {
				console.log('updateMaterial : ', params);

				$scope.materialsService.updateMaterial(params, $scope.session.user).then(function(response) {
					console.log('updateMaterial done', response);
					if(response.result === 'success') {					
						// $rootScope.$broadcast('update_materialsettings');
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

			$scope.deleteMaterial = function(id) {
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
								type: 'material'
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if(confirm) {
						console.log('Deleting material : ', id);
						$scope.materialsService.deleteMaterial(id, $scope.session.user).then(function(response) {
							if(response.result === 'success') {
								console.log('delete material done', response);
								var deletedMaterial, deleteIndex;
								deletedMaterial = $filter('filter')($scope.materialsService.materials, {id: id});
								deleteIndex 	= $scope.materialsService.materials.indexOf(deletedMaterial[0]);
								$scope.materialsService.materials.splice(deleteIndex, 1);
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
	.directive('settingsMaterials', function() {
		return {
			templateUrl: 'views/materialsettings.html'
		};
	});
