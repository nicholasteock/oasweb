'use strict';

/**
 * @ngdoc service
 * @name oasApp.materials
 * @description
 * # materials
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('MaterialsService', [
		'$http',
		'$upload',
		'AuthService',
		'ApiHandlerService',
		function ($http, $upload, AuthService, ApiHandlerService) {
			var urlPrefix = ApiHandlerService.getUrlPrefix();

			var formatMaterialCosts = function(page, data) {
				console.log('formatMaterialCosts : ', data);
				var result = {};

				data.material_costs.map(function(item) {
					if(item.purchase_date) {
						item.purchase_date = new Date(item.purchase_date);
					}
					if(item.delivery_date) {
						item.delivery_date = new Date(item.delivery_date);
					}
					if(item.invoice_date) {
						item.invoice_date = new Date(item.invoice_date);
					}
				});

				if(page > 1) {
					var temp = materialsService.costs.materials.material_costs.concat(data.material_costs);
					data.material_costs = temp;
					angular.copy(data, materialsService.costs.materials);
					// ApiHandlerService.triggerLoaded();
				}
				else {
					angular.copy(data, materialsService.costs.materials);
					// ApiHandlerService.triggerLoaded();
				}
			};

			var formatAccessoryCosts = function(page, data) {
				console.log('formatAccessoryCosts : ', data);
				var result = {};

				data.accessory_costs.map(function(item) {
					if(item.date) {
						item.date = new Date(item.date);
					}
				});

				if(page > 1) {
					var temp = materialsService.costs.accessories.accessory_costs.concat(data.accessory_costs);
					data.accessory_costs = temp;
					angular.copy(data, materialsService.costs.accessories);
					// ApiHandlerService.triggerLoaded();
				}
				else {
					angular.copy(data, materialsService.costs.accessories);
					// ApiHandlerService.triggerLoaded();
				}
			};

			var materialsService = {};

			materialsService.materials = [];
			materialsService.accessories = [];
			materialsService.costs = {};
			materialsService.costs.materials = {};
			materialsService.costs.accessories = {};

			materialsService.getMaterialsList = function(params, user, hideSpinner) {
				console.log('In materialsService.getMaterialsList', params);
				
				if(user === undefined) {AuthService.retrieveSession();}

				if(!hideSpinner) {
					ApiHandlerService.triggerLoading();
				}

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'materials/',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					console.log('getMaterialsList response : ', res);
					if(params.page > 1) {
						var temp = materialsService.materials.concat(res.data.materials);
						angular.copy(temp, materialsService.materials);
					}
					else {
						angular.copy(res.data.materials, materialsService.materials);
					}
					if(!hideSpinner) {
						ApiHandlerService.triggerLoaded();
					}
					return res.data.num_pages;
				});
			};

			materialsService.addMaterial = function(params, user) {
				console.log('In materialsService.addMaterial', params);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'POST',
					url     : urlPrefix + 'materials/',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.updateMaterial = function(params, user) {
				console.log('In materialsService.updateMaterial', params);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'PUT',
					url     : urlPrefix + 'materials/' + params.id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.deleteMaterial = function(id, user) {
				console.log('In materialsService.deleteMaterial', id);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'materials/' + id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.addAccessory = function(params, user) {
				console.log('In materialsService.addAccessory', params);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'POST',
					url     : urlPrefix + 'accessories/',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.updateAccessory = function(params, user) {
				console.log('In materialsService.updateAccessory', params);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'PUT',
					url     : urlPrefix + 'accessories/' + params.id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.deleteAccessory = function(id, user) {
				console.log('In materialsService.deleteAccessory', id);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'accessories/' + id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.getAccessoriesList = function(params, user, hideSpinner) {
				console.log('In materialsService.getAccessoriesList', params);
				
				if(user === undefined) {AuthService.retrieveSession();}

				if(!hideSpinner) {
					ApiHandlerService.triggerLoading();
				}

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'accessories/',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					console.log('getAccessoriesList response : ', res);
					if(params.page > 1) {
						var temp = materialsService.accessories.concat(res.data.accessories);
						angular.copy(temp, materialsService.accessories);
					}
					else {
						angular.copy(res.data.accessories, materialsService.accessories);
					}
					if(!hideSpinner) {
						ApiHandlerService.triggerLoaded();
					}
					return res.data.num_pages;
				});
			};

			materialsService.getMaterialCosts = function(params, projectId, user) {
				console.log('In materialsService.getMaterialCosts', params);

				if(user === undefined) {AuthService.retrieveSession();}

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'projects/' + projectId + '/material_costs',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					formatMaterialCosts(params.page, res.data);
					return res.data.num_pages;
				});
			};

			materialsService.createMaterialCost = function(params, user) {
				console.log('In materialsService.createMaterialCost');

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'POST',
					url     : urlPrefix + 'projects/' + params.id + '/material_costs',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.updateMaterialCost = function(params, user) {
				console.log('In materialsService.updateMaterialCost', params);

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'PUT',
					url     : urlPrefix + 'material_costs/' + params.id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.deleteMaterialCost = function(id, user) {
				console.log('In materialsService.deleteMaterialCost');
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'material_costs/' + id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.getAccessoriesCosts = function(params, projectId, user) {
				console.log('In materialsService.getAccessoriesCosts', params);
				
				if(user === undefined) {AuthService.retrieveSession();}
				
				return $http({
					method  : 'GET',
					url     : urlPrefix + 'projects/' + projectId + '/accessory_costs',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					formatAccessoryCosts(params.page, res.data);
					return res.data.num_pages;
				});
			};

			materialsService.createAccessoryCost = function(params, user) {
				console.log('In materialsService.createAccessoryCost');

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'POST',
					url     : urlPrefix + 'projects/' + params.id + '/accessory_costs',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.updateAccessoryCost = function(params, user) {
				console.log('In materialsService.updateAccessoryCost', params);

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'PUT',
					url     : urlPrefix + 'accessory_costs/' + params.id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.deleteAccessoryCost = function(id, user) {
				console.log('In materialsService.deleteAccessoryCost');

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'accessory_costs/' + id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.getMaterialCostSummary = function(projectId, user) {
				console.log('In materialsService.getMaterialCostSummary');

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'projects/' + projectId + '/summary_material_costs',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			materialsService.getAccessoryCostSummary = function(projectId, user) {
				console.log('In materialsService.getAccessoryCostSummary');

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'projects/' + projectId + '/summary_accessory_costs',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			return materialsService;
		}
	]);
