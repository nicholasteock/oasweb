'use strict';

/**
 * @ngdoc service
 * @name oasApp.SettingsService
 * @description
 * # SettingsService
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('SettingsService', [
		'$rootScope',
		'$http',
		'AuthService',
		'ApiHandlerService',
		function ($rootScope, $http, AuthService, ApiHandlerService) {
			var urlPrefix = ApiHandlerService.getUrlPrefix();

			var settingsService = {};

			settingsService.settings = {};

			settingsService.getSettings = function(user) {
				console.log('In settingsService.getSettings');

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'settings',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then( function(res) {
					angular.copy(res.data, settingsService.settings);
					ApiHandlerService.triggerLoaded();
					$rootScope.$broadcast('settings_updated');
				});
			};

			settingsService.updateSettings = function(newSettings, user) {
				console.log('In settingsService.updateSettings');

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'POST',
					url     : urlPrefix + 'settings',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : newSettings
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			return settingsService;
		}
	]);
