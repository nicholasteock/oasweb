'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:GeneralsettingsCtrl
 * @description
 * # GeneralsettingsCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('GeneralsettingsmodalCtrl', ['$rootScope', '$scope', '$modalInstance', 'SettingsService', function ($rootScope, $scope, $modalInstance, SettingsService) {
		$scope.settingsService = SettingsService;
		$scope.settingsService.settings = SettingsService.settings;
		$scope.settingsService.getSettings($scope.session.user);

		$scope.save = function () {
			console.log('Updating settings');
			$scope.settingsService.updateSettings($scope.settingsService.settings, $scope.session.user).then(function(response) {
				console.log('update settings done', response);
				$modalInstance.close('');
				if(response.result === 'success') {
					$rootScope.$broadcast('settings_changed');
					$modalInstance.close('');
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

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);