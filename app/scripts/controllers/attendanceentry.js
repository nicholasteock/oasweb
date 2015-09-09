'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AttendanceentryCtrl
 * @description
 * # AttendanceentryCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AttendanceentryCtrl',['$scope', function ($scope) {
		console.log("from entryjs styles",$scope.entry);

		$scope.$watch('selectedEntryId', function() {
			$scope.active = $scope.isEquals($scope.selectedEntryId, $scope.entry.id) ? 'active' : '';
		});

		// $scope.$watch('selectedProject', function(newProject, oldProject) {
		// 	console.log('selectedProject : ', $scope.entry);
		// 	$scope.setSelectedEntryId(-1);
		// 	if(!$scope.isEquals(newProject, $scope.entry.project.name) &&
		// 		newProject !== 'All projects') {
		// 		$scope.disabled = 'disabled';
		// 	}
		// 	else {
		// 		$scope.disabled = '';
		// 	}
		// });

		$scope.$watch('entry.styles', function() {
			console.log('change registered...');
		});
	}])
	.directive('attendanceEntry', function() {
		return {
			templateUrl: 'views/attendanceentry.html'
		};
	});