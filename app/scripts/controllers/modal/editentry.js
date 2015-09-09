'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:EditentryCtrl
 * @description
 * # EditentryCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('EditentryCtrl', ['$scope', '$filter', '$modalInstance', 'modalInfo', function ($scope, $filter, $modalInstance, modalInfo) {
		console.log('modalinfo', modalInfo);

		var entryTypes = ['PROJECT','LEAVE','MEDICAL LEAVE','PUBLIC HOLIDAY'];

		$scope.ok = function () {
			var entryType 		= entryTypes.indexOf($scope.selectedEntryType) + 1;
			var projectId 		= $scope.selectedProjectId;
			
			var entryDate 		= new Date(modalInfo.entryDate);
			var entryParams 	= {};

			// Calculate start time ms
			var	startTime 		= modalInfo.startTime,
				startTemp 		= startTime.split(':'),
				startHours 		= Number(startTemp[0]),
				startMinutes 	= Number(startTemp[1]),
				startMs 		= entryDate.setHours(startHours, startMinutes, 0, 0);

			$scope.errorMessage = '';
			if(entryType === '' || projectId === '') {
				$scope.errorMessage = 'All fields are required.';
				return;
			}

			// Simple project entry fields validation
			if(entryType === 1 && (checkinTime === '' || checkoutTime === '')) {
				$scope.errorMessage = 'All fields are required.';
				return;
			}

			// Assign common parameters
			entryParams.project_id 	= projectId;
			entryParams.type_code 	= entryType;
			entryParams.id 			= modalInfo.entry.id;
			
			// Gather and parse type specific parameters
			if(entryType === 1) { 	// Project
				var entryDate 	= new Date(modalInfo.entryDate);
				
				var	checkinTime 	= $scope.checkinTime,
					checkinTemp 	= checkinTime.split(':'),
					checkinHours 	= Number(checkinTemp[0]),
					checkinMinutes 	= Number(checkinTemp[1]),
					checkinMs 		= entryDate.setHours(checkinHours, checkinMinutes, 0, 0);

				var checkoutTime 	= $scope.checkoutTime,
					checkoutTemp 	= checkoutTime.split(':'),
					checkoutHours 	= Number(checkoutTemp[0]),
					checkoutMinutes = Number(checkoutTemp[1]),
					checkoutMs 		= entryDate.setHours(checkoutHours, checkoutMinutes, 0, 0);

				// Corrects time for next day entries (eg 3am)
				// if(checkinMs < startMs) {
				// 	checkinMs += 86400000;
				// }
				// if(checkoutMs < startMs) {
				// 	checkoutMs += 86400000;
				// }

				if(checkoutMs < checkinMs) {
					checkoutMs += 86400000;
				}

				var checkinDateObject 	= new Date(checkinMs),
					checkoutDateObject 	= new Date(checkoutMs);

				entryParams.check_in_time 	= checkinDateObject.toISOString();
				entryParams.check_out_time 	= checkoutDateObject.toISOString();
			}

			if( entryType === 2 ||
				entryType === 3 ||
				entryType === 4) { 	// Leave, MC, PH
				entryDate.setHours(startHours, startMinutes, 0, 0);
				entryParams.check_in_time = entryDate.toISOString();
				entryParams.remark = $scope.entryRemarks;
			}

			console.log('edit entryParams : ', entryParams);
			$modalInstance.close(entryParams);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
			
		$scope.isSelectedEntryType = function(entryTypeIdx) {
			return entryTypes.indexOf($scope.selectedEntryType) === (entryTypeIdx-1);
		};

		$scope.chooseEntryType = function(entryTypeIdx) {
			$scope.selectedEntryType = entryTypes[entryTypeIdx-1];
		};

		$scope.chooseProject = function(projectId) {
			var selectedProject = {};

			$scope.selectedProjectId 		= projectId;
			selectedProject 				= $filter('filter')($scope.projects, {id:projectId})[0];
			$scope.selectedProjectName 		= selectedProject.name;
			$scope.selectedProjectAddress 	= selectedProject.address;
		};

		$scope.projects 				= modalInfo.projects;
		$scope.selectedEntryType 		= '';
		$scope.selectedProjectId 		= '';
		$scope.selectedProjectName 		= '';
		$scope.selectedProjectAddress 	= '';
		$scope.entryRemarks 			= '';
		$scope.errorMessage 			= '';
		$scope.checkinTime 				= '';
		$scope.checkoutTime 			= '';

		$scope.chooseProject(modalInfo.entry.project.id);
		$scope.chooseEntryType(modalInfo.entry.type_code);

		$scope.checkinTime = $filter('date')(modalInfo.entry.check_in_time,'HH:mm');
		$scope.checkoutTime = $filter('date')(modalInfo.entry.check_out_time,'HH:mm');

		$scope.status = {
			isopen: false
		};

		$scope.toggleDropdown = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.status.isopen = !$scope.status.isopen;
		};
	}]);