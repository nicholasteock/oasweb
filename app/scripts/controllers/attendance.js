'use strict';

/**
* @ngdoc function
* @name oasApp.controller:AttendanceCtrl
* @description
* # AttendanceCtrl
* Controller of the oasApp
*/
angular.module('oasApp')
	.controller('AttendanceCtrl', [
		'$rootScope',
		'$scope',
		'$modal',
		'AttendanceService',
		'SettingsService',
		'ProjectsService',
		function ($rootScope, $scope, $modal, AttendanceService, SettingsService, ProjectsService) {
			var monthArr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
							'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

			var toggleAttendanceInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.attendanceParams.page || pageLimit === 0) {
					console.log('attendance limit reached');
					$scope.enableInfiniteScroll = false;
				}
				else {
					$scope.enableInfiniteScroll = true;
					startWatching = true;
				}
			};

			var startWatching = false;

			$scope.firstLoad = true;
			$scope.enableInfiniteScroll = false;

			$scope.attendanceParams = {
				name 			: undefined,
				name_start_with	: undefined,
				page 			: 1,
				project_id 		: undefined
			};

			$scope.attendanceService 				= AttendanceService;
			$scope.attendanceService.attendances 	= AttendanceService.attendances;	
			$scope.projectsService 					= ProjectsService;
			$scope.projectsService.projects			= ProjectsService.projects;
			$scope.settingsService 					= SettingsService;
			$scope.settingsService.settings 		= SettingsService.settings;

			// $scope.$on('tab_changed', function() {
			// 	$scope.enableInfiniteScroll = false;
			// 	$('.attendance-list').scrollTop(0);
			// });

			$scope.$watch('attendanceDate', function(newDate, oldDate) {
				if(oldDate === undefined) return;
				if(!startWatching) return;
				console.log('attendanceDate changed : ', newDate, oldDate);

				if(newDate === '') {
					newDate = oldDate;
					return;
				}

				if(typeof newDate === 'object') {
					var date 	= new Date(newDate),
						day 	= date.getDate(),
						month 	= date.getMonth() + 1,
						year  	= date.getFullYear();
					if(month < 10) { month='0' + month; }
					if(day < 10) { day = '0' + day; }
					newDate = year+'-'+month+'-'+day;

					$scope.attendanceParams.page = 1;
					$('.attendance-list').scrollTop(0);
					$scope.attendanceDate = newDate;
					$scope.attendanceMonth = monthArr[Number(newDate.substr(5,2))-1];
					$scope.attendanceService.getAttendances(newDate, $scope.attendanceParams, $scope.session.user).then(toggleAttendanceInfiniteScroll);
				}
				else {
					$scope.attendanceParams.page = 1;
					$('.attendance-list').scrollTop(0);
					$scope.attendanceService.getAttendances($scope.attendanceDate, $scope.attendanceParams, $scope.session.user).then(toggleAttendanceInfiniteScroll);
				}
			});

			$scope.$on('update_attendance', function(event, reset) {
				console.log('update_attendance triggered', reset, $scope.session.user);
				if(reset || $scope.firstLoad) {
					$scope.firstLoad = false;
					$rootScope.$broadcast('alphabetlist_reset');
					$('.attendance-list').scrollTop(0);
					$scope.enableInfiniteScroll = false;
					$scope.attendanceDate = $scope.today;
					$scope.attendanceMonth = monthArr[Number($scope.attendanceDate.substr(5,2))-1];
					$scope.selectedProject = 'All projects';
					$scope.attendanceParams = {
						name 			: undefined,
						name_start_with	: undefined,
						page 			: 1,
						project_id 		: undefined
					};
					startWatching = true;
					$scope.projectsService.getProjects($scope.session.user);
					$scope.settingsService.getSettings($scope.session.user);
					$scope.attendanceService.getAttendances($scope.attendanceDate, $scope.attendanceParams, $scope.session.user).then(toggleAttendanceInfiniteScroll);
					$scope.selectedEntryId = -1;
				}
			});

			$scope.$on('attendance_search', function(event, query) {
				$('.attendance-list').scrollTop(0);
				$scope.enableInfiniteScroll = false;
				$scope.attendanceParams.name = query;
				$scope.attendanceParams.page = 1;
				$scope.attendanceService.getAttendances($scope.attendanceDate, $scope.attendanceParams, $scope.session.user).then(toggleAttendanceInfiniteScroll);
			});

			$scope.$on('attendance_alphabet_changed', function(event, alphabet) {
				$('.attendance-list').scrollTop(0);
				$scope.enableInfiniteScroll = false;
				$scope.attendanceParams.name_start_with = alphabet;
				$scope.attendanceParams.page = 1;
				$scope.attendanceService.getAttendances($scope.attendanceDate, $scope.attendanceParams, $scope.session.user).then(toggleAttendanceInfiniteScroll);
			});

			//********************************************************************/
			$scope.nextPage = function() {
				console.log('attendance nextPage', $scope.enableInfiniteScroll);
				if(!$scope.enableInfiniteScroll) {
					return;
				}
				$scope.attendanceParams.page += 1;
				$scope.attendanceService.getAttendances($scope.attendanceDate, $scope.attendanceParams, $scope.session.user).then(toggleAttendanceInfiniteScroll);
			};

			$scope.createEntry = function(employeeId, employeeName, employeeAvatar) {
				var modalInstance = $modal.open({
					templateUrl 	: 'views/modal/createentry.html',
					controller 		: 'CreateentryCtrl',
					backdrop 		: 'static',
					backdropClass 	: 'backdrop-oas',
					windowClass 	: 'modal-oas vertical-center attendanceentry-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								newEntryDate: $scope.attendanceDate,
								employeeId 	: employeeId,
								startTime 	: $scope.settingsService.settings.work_start_at,
								projects 	: $scope.projectsService.projects
							};
						}
					}
				});

				modalInstance.result.then(function(newEntryParams) {
					$scope.confirmCreateEntry(newEntryParams, employeeName, employeeAvatar);
				});
			};

			$scope.confirmCreateEntry = function(newEntryParams, employeeName, employeeAvatar) {
				var modalInstance = $modal.open({
					templateUrl 	: 'views/modal/createentryconfirmation.html',
					controller 		: 'CreateentryconfirmationCtrl',
					backdrop 		: 'static',
					backdropClass 	: 'backdrop-oas',
					size			: 'sm',
					windowClass 	: 'modal-oas vertical-center createentryconfirmation-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								type 	: newEntryParams.type_code,
								name 	: employeeName,
								avatar 	: employeeAvatar
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if(confirm) {
						$scope.attendanceService.createAttendance(newEntryParams, newEntryParams.employeeId, $scope.session.user).then( function(response) {
							console.log('create attendance done', response);
							if(response.result === 'success') {
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
					}
					return;
				});
			};

			//********************************************************************/



			// ADDITIONAL FUNCTION CALLS
			//********************************************************************/

			$scope.selectedEntryId = -1;
			$scope.defaultAvatarPath = 'images/manpower/avatar.png';

			// Triggers when an attendance bar is clicked
			$scope.setSelectedEntryId = function(entryId) {
				if($scope.selectedEntryId === entryId) {
					entryId = -1;
				}
				$scope.selectedEntryId = entryId;
			};

			$scope.deleteEntryConfirmation = function(employeeId, entryId) {
				var modalInstance = $modal.open({
					templateUrl   : 'views/modal/deleteconfirmation.html',
					controller    : 'DeleteconfirmationCtrl',
					backdrop      : 'static',
					backdropClass : 'backdrop-oas',
					size          : 'sm',
					windowClass   : 'modal-oas vertical-center deleteconfirmation-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								type: 'entry'
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if (confirm) {
						$scope.attendanceService.deleteAttendance(employeeId, entryId, $scope.session.user).then(function(response) {
							console.log('delete attendance done', response);
							if(response.result === 'success') {
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
					}
					return;
				});
			};

			$scope.editEntry = function(employeeId, entry) {
				console.log('editEntry : ', entry, employeeId);
				var modalInstance = $modal.open({
					templateUrl   	: 'views/modal/editentry.html',
					controller    	: 'EditentryCtrl',
					backdrop      	: 'static',
					backdropClass 	: 'backdrop-oas',
					windowClass   	: 'modal-oas vertical-center attendanceentry-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								entry 		: entry,
								entryDate 	: $scope.attendanceDate,
								startTime 	: $scope.settingsService.settings.work_start_at,
								projects 	: $scope.projectsService.projects
							};
						}
					}
				});

				modalInstance.result.then(function(entry) {
					$scope.attendanceService.updateAttendance(employeeId, entry, $scope.session.user).then(function(response) {
						if(response.result === 'success') {
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
					return;
				});
			};

			$scope.showEntryDetails = function(entry, type) {
				var modalInstance = $modal.open({
					templateUrl   	: 'views/modal/attendancelocationmodal.html',
					controller    	: 'AttendancelocationmodalCtrl',
					backdrop      	: 'static',
					backdropClass 	: 'backdrop-oas',
					windowClass   	: 'modal-oas vertical-center attendanceentry-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								entry 	: entry,
								type 	: type
							};
						}
					}
				});
			};
			
			// DROPDOWN STUFF
			//********************************************************************/
			
			$scope.selectedProject = 'All projects';

			$scope.chooseProject = function(projectId, projectName) {
				if(projectId === 0) { // ALL PROJECTS
					delete $scope.attendanceParams.project_id;
					delete $scope.attendanceParams.incomplete;
				}
				else if(projectId === -1) { // INCOMPLETE ENTRIES
					delete $scope.attendanceParams.project_id;
					$scope.attendanceParams.incomplete = 1;
				}
				else { // NORMAL PROJECT SELECTION
					delete $scope.attendanceParams.incomplete;
					$scope.attendanceParams.project_id = projectId;
				}
				$rootScope.$broadcast('alphabetlist_reset');
				$('.attendance-list').scrollTop(0);
				$scope.enableInfiniteScroll = false;
				$scope.attendanceParams.page = 1;
				$scope.attendanceParams.name = undefined;
				$scope.attendanceParams.name_start_with = undefined;
				$scope.attendanceService.getAttendances($scope.attendanceDate, $scope.attendanceParams, $scope.session.user).then(toggleAttendanceInfiniteScroll);
				$scope.selectedProject = projectName;
			};

			$scope.showAttendanceSummary = function(employee, month, date) {
				console.log('In showAttendanceSummary :', employee, month, date);
				$scope.attendanceService.getEmployeeAttendanceSummary(employee.id, date, $scope.session.user).then(function(response) {
					console.log('getEmployeeAttendanceSummary done. Response : ', response);

					if(response.result === 'success') {
						var modalInstance = $modal.open({
							templateUrl   	: 'views/modal/attendancesummarymodal.html',
							controller    	: 'AttendancesummarymodalCtrl',
							backdrop      	: 'static',
							backdropClass 	: 'backdrop-oas',
							windowClass   	: 'modal-oas vertical-center attendancesummary-modal',
							resolve 		: {
								modalInfo: function() {
									return {
										employee 	: employee,
										month 		: month,
										year 		: $scope.attendanceDate.substr(0,4),
										data 		: response.data
									};
								}
							}
						});
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

			// DATEPICKER STUFF
			//********************************************************************/
			$scope.datepickers = {
				attendanceDate : false
			};

			$scope.dateOptions = {
				showWeeks 			: false,
				startingDay 		: 0,
				formatDay 			: 'dd',
				formatMonth 		: 'MMMM',
				formatYear 			: 'yy',
				minDate 			: '2014-01-01'
			};

			$scope.open = function($event) {
				console.log($scope.settingsService.settings);
				$event.preventDefault();
				$event.stopPropagation();

				var datepickersReset = {
					attendanceDate : false
				};

				angular.copy(datepickersReset, $scope.datepickers);
				$scope.datepickers[$event.target.name] = true;
			};

			$scope.shiftDay = function(num) {
				console.log('shiftDay', num);
				var type 	= typeof $scope.attendanceDate,
					val 	= $scope.attendanceDate,
					date 	= new Date(val),
					day, month, year;

				if(type === 'string') {
					var dateArr = val.split('-');

					year 	= parseInt(dateArr[0]);
					month 	= parseInt(dateArr[1])-1;
					day 	= parseInt(dateArr[2]);
					date 	= new Date(year, month, day);
				}

				date.setDate(date.getDate() + num);
				day 	= date.getDate();
				month 	= date.getMonth()+1;
				year  	= date.getFullYear();

				if(month < 10) { month='0' + month; }
				if(day < 10) { day = '0' + day; }

				$scope.attendanceDate = year+'-'+month+'-'+day;
			};
			//********************************************************************/
		}
	]).directive('manpowerAttendance', function() {
		return {
			templateUrl: 'views/attendance.html'
		};
	});
