'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:GeneralsettingsCtrl
 * @description
 * # GeneralsettingsCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('GeneralsettingsCtrl', [
		'$rootScope',
		'$scope',
		'SettingsService',
		function ($rootScope, $scope, SettingsService) {

			$scope.save = function() {
				console.log('Updating settings');
				$scope.settingsService.updateSettings($scope.settingsService.settings, $scope.session.user).then(function(response) {
					if(response.result === 'success') {
						$rootScope.$broadcast('update_settings');
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
		}
	])
	.directive('settingsGeneral', function() {
		return {
			templateUrl: 'views/generalsettings.html'
		};
	});
