'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:MaterialscostctrlCtrl
 * @description
 * # MaterialscostctrlCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('MaterialscostCtrl', [
		'$rootScope',
		'$scope',
		'$modal',
		'ProjectsService',
		'MaterialsService',
		function ($rootScope, $scope, $modal, ProjectsService, MaterialsService) {
			var toggleMaterialsInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.materialsParams.page) {
					console.log('materials profiles limit reached');
					$scope.enableInfiniteScroll.materials = false;
				}
				else {
					$scope.enableInfiniteScroll.materials = true;
				}
			};

			var toggleAccessoriesInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.accessoriesParams.page) {
					console.log('accessories profiles limit reached');
					$scope.enableInfiniteScroll.accessories = false;
				}
				else {
					$scope.enableInfiniteScroll.accessories = true;
				}
			};

			$scope.firstLoad = true;
			$scope.editMaterials = false;
			$scope.editAccessories = false;
			$scope.enableInfiniteScroll = {materials: false, accessories: false};

			$scope.materialsParams = {
				name 			: undefined,
				page 			: 1
			};

			$scope.accessoriesParams = {
				name 			: undefined,
				page 			: 1
			};

			$scope.materialsListParams = {
				name 			: undefined,
				page 			: 1
			};

			$scope.accessoriesListParams = {
				name 			: undefined,
				page 			: 1
			};

			$scope.materialName 	= '';
			$scope.accessoryName 	= '';
			$scope.showAutocomplete = false;

			$scope.selectedMaterial = {
				id 		: undefined,
				name 	: undefined,
				price 	: undefined,
				color 	: undefined,
				remark 	: undefined,
				supplier: undefined
			};

			$scope.selectedAccessory = {
				id 		: undefined,
				name 	: undefined,
				price 	: undefined
			};

			$scope.newMaterialCost = {
				material_id: null,
				price: null,
				quantity: null,
				purchase_date: null,
				purchase_order: null,
				delivery_date: null,
				delivery_order: null,
				invoice_date: null,
				invoice_number: null,
				remark: null
			};

			$scope.newAccessoryCost = {
				date 		: null,
				accessory_id: null,
				price 		: null,
				package		: null,
				quantity 	: null,
				taken 		: null,
				remark 		: null
			};

			$scope.materialsService = MaterialsService;
			$scope.materialsService.costs = MaterialsService.costs;

			$scope.viewtype = 'materials';

			$scope.$on('tab_changed', function() {
				// $scope.enableInfiniteScroll = {materials: false, accessories: false};
				//scrolltop?
			});

			$scope.$on('update_materialscost', function(event, reset) {
				console.log('update_materialcosts triggered', reset);
				if(reset || $scope.firstLoad) {
					$scope.firstLoad = false;
					$scope.enableInfiniteScroll = {materials: false, accessories: false};
					$scope.materialsQuery = '';
					$scope.materialsParams = {
						name 			: undefined,
						page 			: 1
					};
					$scope.accessoriesParams = {
						name 			: undefined,
						page 			: 1
					};
					$scope.materialName = '';
					$scope.accessoryName = '';
					$scope.showAutocomplete = false;
					$scope.selectedMaterial = {
						id 		: undefined,
						name 	: undefined,
						price 	: undefined,
						color 	: undefined,
						remark 	: undefined,
						supplier: undefined
					};
					$scope.selectedAccessory = {
						id 		: undefined,
						name 	: undefined,
						price 	: undefined
					};
					$scope.newMaterialCost = {
						material_id 	: null,
						price 			: 0,
						quantity 		: 0,
						total 			: 0,
						purchase_date 	: null,
						purchase_order 	: null,
						delivery_date 	: null,
						delivery_order 	: null,
						invoice_date 	: null,
						invoice_number 	: null,
						remark 			: null
					};
					$scope.newAccessoryCost = {
						date 		: null,
						accessory_id: null,
						price 		: null,
						package		: null,
						quantity 	: null,
						taken 		: null,
						remark 		: null
					};
					$scope.materialsService.getMaterialCosts($scope.materialsParams, $scope.selectedProject.id, $scope.session.user).then(toggleMaterialsInfiniteScroll);
					$scope.materialsService.getAccessoriesCosts($scope.accessoriesParams, $scope.selectedProject.id, $scope.session.user).then(toggleAccessoriesInfiniteScroll);
				}
			});

			$scope.$watch('newMaterialCost.quantity', function() {
				console.log('material quantity changed');
				$scope.newMaterialCost.total = $scope.selectedMaterial.price * $scope.newMaterialCost.quantity;
			});

			$scope.$watch('newAccessoryCost.quantity', function() {
				console.log('accessory quantity changed');
				$scope.newAccessoryCost.total = $scope.selectedAccessory.price * $scope.newAccessoryCost.quantity;
			});

			$scope.searchKeypressed = function($event) {
				if($event.charCode === 13) {
					$scope.queryMaterialCost($scope.viewtype, $scope.materialsQuery);
				}
			};

			$scope.nextPage = function() {
				switch($scope.viewtype) {
					case 'materials':
						if(!$scope.enableInfiniteScroll.materials) {
							return;
						}
						$scope.materialsParams.page += 1;
						$scope.materialsService.getMaterialCosts($scope.materialsParams, $scope.selectedProject.id, $scope.session.user).then(toggleMaterialsInfiniteScroll);
						break;
					case 'accessories':
						if(!$scope.enableInfiniteScroll.accessories) {
							return;
						}
						$scope.accessoriesParams.page += 1;
						$scope.materialsService.getAccessoriesCosts($scope.accessoriesParams, $scope.selectedProject.id, $scope.session.user).then(toggleAccessoriesInfiniteScroll);
						break;
				}
			};

			$scope.queryMaterialCost = function(viewtype, query) {
				console.log('querying material cost : ', viewtype, query);
				$scope.enableInfiniteScroll = {current: false, archive: false};
				switch($scope.viewtype) {
					case 'materials':
						$scope.materialsParams.name = query;
						$scope.materialsParams.page = 1;
						$scope.materialsService.getMaterialCosts($scope.materialsParams, $scope.selectedProject.id, $scope.session.user).then(toggleMaterialsInfiniteScroll);
						break;
					case 'accessories':
						$scope.accessoriesParams.name = query;
						$scope.accessoriesParams.page = 1;
						$scope.materialsService.getAccessoriesCosts($scope.accessoriesParams, $scope.selectedProject.id, $scope.session.user).then(toggleAccessoriesInfiniteScroll);
						break;
				}
			};

			$scope.createMaterialCost = function(params) {
				console.log('createMaterialCost : ', params);
			
				params.id = $scope.selectedProject.id;
				params.price = $scope.selectedMaterial.price;
				params.material_id = $scope.selectedMaterial.id;

				$scope.materialsService.createMaterialCost(params, $scope.session.user).then(function(response) {
					console.log('create material cost done', response);
					if(response.result === 'success') {					
						$rootScope.$broadcast('update_materialscost', true);
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

			$scope.deleteMaterialCost = function(id) {
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
								type: 'entry'
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if (confirm) {
						console.log('delete material cost triggered : ', id);
						$scope.materialsService.deleteMaterialCost(id, $scope.session.user).then(function(response) {
							console.log('delete material cost done', response);
							if(response.result === 'success') {					
								$rootScope.$broadcast('update_materialscost', true);
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

			$scope.predictInput = function(query) {
				console.log('predicting input for : ', query);
				if(query === '') {
					$scope.showAutocomplete = false;
					return;
				}
				switch($scope.viewtype) {
					case 'materials':
						$scope.materialsListParams.name = query;
						$scope.materialsService.getMaterialsList($scope.materialsListParams, $scope.session.user, true).then(function() {
							$scope.showAutocomplete = true;
						});
						break;
					case 'accessories':
						$scope.accessoriesListParams.name = query;
						$scope.materialsService.getAccessoriesList($scope.accessoriesListParams, $scope.session.user, true).then(function() {
							$scope.showAutocomplete = true;
						});
						break;
				}
			};

			$scope.selectMaterial = function(material) {
				console.log('select material : ', material);
				$scope.selectedMaterial = material;
				$scope.materialName = material.name;
				$scope.showAutocomplete = false;
			};

			$scope.selectAccessory = function(accessory) {
				console.log('select accessory : ', accessory);
				$scope.selectedAccessory = accessory;
				$scope.accessoryName = accessory.name;
				$scope.showAutocomplete = false;
			};

			$scope.clearNewMaterial = function() {
				$scope.materialName = '';
				$scope.showAutocomplete = false;
				$scope.selectedMaterial = {
					id 		: undefined,
					name 	: undefined,
					color 	: undefined,
					remark 	: undefined,
					supplier: undefined
				};
				$scope.newMaterialCost = {
					material_id 	: null,
					price 			: 0,
					quantity 		: 0,
					total 			: 0,
					purchase_date 	: null,
					purchase_order 	: null,
					delivery_date 	: null,
					delivery_order 	: null,
					invoice_date 	: null,
					invoice_number 	: null,
					remark 			: null
				};
			};

			$scope.createAccessoryCost = function(params) {
				console.log('createAccessoryCost : ', params);
			
				params.id = $scope.selectedProject.id;
				params.accessory_id = $scope.selectedAccessory.id;
				params.price = $scope.selectedAccessory.price;

				$scope.materialsService.createAccessoryCost(params, $scope.session.user).then(function(response) {
					console.log('create accessory cost done', response);
					if(response.result === 'success') {					
						$rootScope.$broadcast('update_materialscost', true);
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

			$scope.deleteAccessoryCost = function(id) {
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
								type: 'entry'
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if (confirm) {
						console.log('delete accessory cost triggered : ', id);
						$scope.materialsService.deleteAccessoryCost(id, $scope.session.user).then(function(response) {
							console.log('delete accessory cost done', response);
							if(response.result === 'success') {					
								$rootScope.$broadcast('update_materialscost', true);
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

			$scope.clearNewAccessory = function() {
				$scope.newAccessoryCost = {
					date 		: null,
					accessory_id: null,
					price 		: null,
					package		: null,
					quantity 	: null,
					taken 		: null,
					remark 		: null
				};
			};

			$scope.showSummary = function(viewtype) {
				switch(viewtype) {
					case 'materials':
						$scope.materialsService.getMaterialCostSummary($scope.selectedProject.id, $scope.session.user).then(function(response) {
							console.log('get materials cost summary done', response);
							if(response.result === 'success') {					
								var modalInstance = $modal.open({
									templateUrl   	: 'views/modal/materialcostsummarymodal.html',
									controller    	: 'MaterialcostsummarymodalCtrl',
									backdrop      	: 'static',
									backdropClass 	: 'backdrop-oas',
									size 			: 'lg',
									windowClass   	: 'modal-oas vertical-center costsummary-modal materialcostsummary-modal',
									resolve 		: {
										modalInfo: function() {
											return {
												projectName 	: $scope.selectedProject.name,
												data 			: response.data
											};
										}
									}
								});
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
						break;
					case 'accessories':
						$scope.materialsService.getAccessoryCostSummary($scope.selectedProject.id, $scope.session.user).then(function(response) {
							console.log('get accessory cost summary done', response);
							if(response.result === 'success') {					
								var modalInstance = $modal.open({
									templateUrl   	: 'views/modal/accessorycostsummarymodal.html',
									controller    	: 'AccessorycostsummarymodalCtrl',
									backdrop      	: 'static',
									backdropClass 	: 'backdrop-oas',
									size 			: 'lg',
									windowClass   	: 'modal-oas vertical-center costsummary-modal accessorycostsummary-modal',
									resolve 		: {
										modalInfo: function() {
											return {
												projectName 	: $scope.selectedProject.name,
												data 			: response.data
											};
										}
									}
								});
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
						break;
				}
			};
  		}
  	])
	.directive('projectMaterialscost', function() {
		return {
  			templateUrl: 'views/materialscost.html'
		};
	});
