'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('DashboardCtrl', [
		'$rootScope',
		'$scope',
		'$location',
		'$timeout',
		'$modal',
		function ($rootScope, $scope, $location, $timeout, $modal) {
			$scope.session.user = $rootScope.session.user;

			$scope.lastViewed = {};
			$scope.lastViewed = angular.fromJson(localStorage.lastViewed);

			$scope.firstLoad = true;

			$scope.$watch('lastViewed.activePanel', function(newValue) {
				// console.log('lastViewed changed : ', newValue);
				localStorage.lastViewed = angular.toJson($scope.lastViewed);
			});

			$scope.$watch('lastViewed.activeTab', function(newValue) {
				// console.log('lastViewed changed : ', newValue);
				localStorage.lastViewed = angular.toJson($scope.lastViewed);
			});

			// Loading spinner control
			$scope.loading = false;
			$scope.$on('loading', function(event, value) {
				$scope.loading = value;
			});

			$scope.isEquals = function(a,b) {
				return a === b;
			};

			$scope.changePanel = function(panel) {
				console.log('panel : ', panel);
				console.log('tab : ', $scope.lastViewed.activeTab);
				$scope.activePanel = panel;
				$scope.lastViewed.activePanel = panel;

				$rootScope.$broadcast('panel_changed', panel);
			};

			// manpower | projects | settings
			// $scope.activePanel = 'manpower';

			if($rootScope.isAuthenticated) {
				console.log('restoring session');
				setTimeout(function() {
					$rootScope.session.restoreSession();
				}, 1000);
			}

			$scope.$on('session_restored', function() {
				console.log('Session restored: ', $scope.session.user);
				$timeout(function() {
					$scope.changePanel($scope.lastViewed.activePanel);
				});
			});

			// $scope.refreshTab = function(tab) {
			// 	switch(tab) {
			// 		case 'profiles':
			// 			$rootScope.$broadcast('update_profiles', true);
			// 			break;
			// 		case 'settings':
			// 			$rootScope.$broadcast('update_settings', true);
			// 			break;
			// 		case 'projects':
			// 			$rootScope.$broadcast('projects_changed', true);
			// 			break;
			// 		case 'attendance':
			// 			$rootScope.$broadcast('update_attendance');
			// 			// $rootScope.$broadcast('update_attendance', true);
			// 			break;
			// 		case 'salary':
			// 			$rootScope.$broadcast('update_salary', true);
			// 			break;
			// 		default:
			// 			break;
			// 	}
			// };

			$scope.refreshApp = function() {
				window.location.reload();
			};

			$scope.launchErrorModal = function(errors) {
				var modalInstance = $modal.open({
					templateUrl   : 'views/modal/errormodal.html',
					controller    : 'ErrormodalCtrl',
					backdrop      : 'static',
					backdropClass : 'backdrop-oas',
					// size          : 'sm',
					windowClass   : 'modal-oas vertical-center error-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								errors: errors
							};
						}
					}
				});
			};

			$scope.logout = function() {
				console.log('Logout');
				$scope.session.destroy();
				$location.path('/login');
			};
		}
	]);
