'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:ManpowerCtrl
 * @description
 * # ManpowerCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('ManpowerCtrl', [
		'$rootScope',
		'$scope',
		'$timeout',
		function ($rootScope, $scope, $timeout) {
			// Get today's date as string
			var today 	= new Date(),
				day 	= today.getDate(),
				month 	= today.getMonth() + 1,
				year  	= today.getFullYear();
			if(month < 10) { month='0' + month; }
			if(day < 10) { day = '0' + day; }
			$scope.today = year+'-'+month+'-'+day;

			$scope.changeTab = function(tab) {
				if(tab !== 'profiles' && tab !== 'attendance' && tab !== 'salary' && tab !== 'allocation') {
					tab = 'profiles';
				}

				$scope.activeTab = tab;
				$scope.lastViewed.activeTab = tab;
				console.log('changeTab called : ', $scope.lastViewed.activeTab);
				$scope.searchQuery = null;
				$rootScope.$broadcast('tab_changed', tab);
				switch(tab) {
					case 'profiles':
						$rootScope.$broadcast('update_profiles');
						break;
					case 'attendance':
						$rootScope.$broadcast('update_attendance');
						break;
					case 'salary':
						$rootScope.$broadcast('update_salary');
						break;
					case 'allocation':
						$rootScope.$broadcast('update_allocation');
						break;
					default:
						$scope.lastViewed.activeTab = 'profiles';
						$rootScope.$broadcast('update_profiles');
						break;
				}
			};

			// profiles | attendance | salary | allocation
			// $scope.activeTab = 'profiles';

			$scope.$on('panel_changed', function(event, panel) {
				if(panel==='manpower') {
					$scope.changeTab($scope.lastViewed.activeTab);
				}
			});

			$scope.searchKeypressed = function($event, activeTab, query) {
				if($event.charCode === 13) {
					$scope.queryEmployee(activeTab, query);
				}
			};

			$scope.queryEmployee = function(activeTab, searchQuery) {
				$rootScope.$broadcast(activeTab+'_search', searchQuery);
			};
		}
	])
	.directive('manpowerTab', function() {
		return {
			templateUrl: 'views/manpower.html'
		};
	});
