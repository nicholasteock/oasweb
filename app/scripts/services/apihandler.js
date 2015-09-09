'use strict';

/**
 * @ngdoc service
 * @name oasApp.ApiHandlerService
 * @description
 * # apihandlerService
 # This service includes functions for the following:
 # 1) Handle api responses (except specific responses which are coded directly in service callback).
 # 2) Handle show/hide of loading spinner (by $broadcast to dashboard)
 */
angular.module('oasApp')
	.factory('ApiHandlerService', [
		'$rootScope',
		'$http',
		'$upload',
		'$location',
		'AuthService',
		'HTTP_PARAMS',
		function ($rootScope, $http, $upload, $location, AuthService, HTTP_PARAMS) {
			var urlPrefix = '';

			var apihandlerService = {};

			apihandlerService.getUrlPrefix = function() {
				if($location.host() === 'mobility.oaspainting.com') {
					return HTTP_PARAMS.prodApi;
				}
				else {
					return HTTP_PARAMS.devApi;
				}
			};

			apihandlerService.successResponse = function(result) {
				console.log('in ApiHandlerService.successResponse');
				var response = {};
				response.result = 'success';
				response.data 	= result.data;
				apihandlerService.triggerLoaded();
				return response;
			};

			apihandlerService.errorResponse = function(result) {
				var response = {};
				response.result = 'failure';
				response.status = result.status;
				response.data 	= result.data.errors;
				apihandlerService.triggerLoaded();
				return response;
			};

			apihandlerService.triggerLoading = function() {
				$rootScope.$broadcast('loading', true);
			};

			apihandlerService.triggerLoaded = function() {
				$rootScope.$broadcast('loading', false);
			};

			return apihandlerService;
		}
	]);
