'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('SettingsCtrl', [
		'$rootScope',
		'$scope',
		'SettingsService',
		function ($rootScope, $scope, SettingsService) {
			$scope.settingsService 			= SettingsService;
			$scope.settingsService.settings = SettingsService.settings;

			$scope.changeTab = function(tab) {
				if(tab !== 'general' && tab !== 'personal' && tab !== 'accounts' && tab !== 'materials' && tab !== 'accessories') {
					tab = 'general';
				}
				$scope.activeTab = tab;
				$scope.lastViewed.activeTab = tab;
				console.log('changeTab called : ', $scope.lastViewed.activeTab);
				$rootScope.$broadcast('tab_changed', tab);
				switch(tab) {
					case 'general':
						$rootScope.$broadcast('update_settings', true);
						break;
					case 'personal':
						$rootScope.$broadcast('update_personalsettings', true);
						break;
					case 'accounts':
						$rootScope.$broadcast('update_accountsettings', true);
						break;
					case 'materials':
						$rootScope.$broadcast('update_materialsettings', true);
						break;
					case 'accessories':
						$rootScope.$broadcast('update_accessorysettings', true);
						break;
					default:
						$scope.lastViewed.activeTab = 'general';
						$rootScope.$broadcast('update_generalsettings', true);
						break;
				}
			};

			$scope.queryMaterial = function(query) {
				$rootScope.$broadcast('materials_search', query);
			};

			$scope.queryAccessory = function(query) {
				$rootScope.$broadcast('accessories_search', query);
			};

			// $scope.activeTab = 'general';

			$scope.$on('panel_changed', function(event, panel) {
				if(panel==='settings') {
					setTimeout( function() {
						$scope.changeTab($scope.lastViewed.activeTab);
					}, 100);
				}
			});

			$scope.$on('update_settings', function() {
				console.log('update_settings triggered');
				$scope.settingsService.getSettings($scope.session.user);
			});
		}
	])
	.directive('settingsTab', function() {
		return {
			templateUrl: 'views/settings.html'
		};
	});
