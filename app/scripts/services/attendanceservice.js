'use strict';

/**
* @ngdoc service
* @name oasApp.AttendanceService
* @description
* # AttendanceService
* Factory in the oasApp.
*/
angular.module('oasApp')
.factory('AttendanceService', [
	'$http',
	'$filter',
	'AuthService',
	'ApiHandlerService',
	function ($http, $filter, AuthService, ApiHandlerService) {
		var urlPrefix = ApiHandlerService.getUrlPrefix();

		// Form timeline shown at the top of attendance
		var formTimeline = function(startString) {
			var tempArr 	= [	'00:00','01:00','02:00','03:00','04:00',
								'05:00','06:00','07:00','08:00','09:00',
								'10:00','11:00','12:00','13:00','14:00',
								'15:00','16:00','17:00','18:00','19:00',
								'20:00','21:00','22:00','23:00' ];

			var startHour 	= Number(startString[0]+startString[1]),
				tempBack 	= tempArr.slice(0,startHour),
				tempFront	= tempArr.slice(startHour),
				timelineArr = tempFront.concat(tempBack);

			return timelineArr.concat([startString]);
		};

		var formCheckoutArray = function(entriesArray, startMs) {

			// console.log('formCheckoutArray : ', entriesArray, startMs);

			var checkoutHour, checkoutMin, checkoutMs;

			var checkoutArr  = entriesArray.map(function(entry) {
					if( entry.type_code === 2 ||
						entry.type_code === 3 ||
						entry.type_code === 4 ) {
						return;
					}
					if(entry.check_out_time === null) {
						entry.type_code = 0;
						return;
					}
					checkoutHour= Number(entry.check_out_time.slice(11, 13));
					checkoutMin = Number(entry.check_out_time.slice(14, 16));
					checkoutMs 	= ((checkoutHour*60)+checkoutMin)*60*1000;

					if(checkoutMs < startMs) {
						checkoutMs += 86400000;
					}

					return checkoutMs;
				});

			checkoutArr.unshift(startMs);
			checkoutArr.sort(function(a, b){return a-b;});
			return checkoutArr;
		};

		var calculateEntryStyles = function(entryIdx, entry, checkoutArr, startMs, overtimeMs, latetimeMs) {
			// console.log('in calculateEntryStyles : ', entry);
			var idx = 0;
			var entryClasses = "";
			var period;
			var checkinHour, checkinMin, checkinMs;
			var checkoutHour, checkoutMin, checkoutMs;
			var entryWidth, leftMargin, wallMargin, infoClasses;

			switch(entry.type_code) {
				case 1:
					checkoutHour= Number(entry.check_out_time.slice(11, 13));
					checkoutMin = Number(entry.check_out_time.slice(14, 16));
					checkoutMs 	= ((checkoutHour*60)+checkoutMin)*60*1000;

					checkinHour = Number(entry.check_in_time.slice(11, 13));
					checkinMin  = Number(entry.check_in_time.slice(14, 16));
					checkinMs 	= ((checkinHour*60)+checkinMin)*60*1000;

					// Corrects time for next day entries (eg 3am)
					if(checkinMs < startMs) {
						checkinMs += 86400000;
					}
					if(checkoutMs < startMs) {
						checkoutMs += 86400000;
					}

					entryWidth 	= (checkoutMs - checkinMs) / 864000;
					// entryWidth = Math.floor(entryWidth);

					idx = checkoutArr.length;
					while(idx>0) {
						idx--;
						if(checkoutArr[idx] <= checkinMs) {
							leftMargin = (checkinMs - checkoutArr[idx]) / 864000;
							// leftMargin = Math.floor(leftMargin);
							idx = 0;
						}
						// Checks if this is the earliest entry.
						// Then checks if it is a late time.
						if(idx === 1 && checkinMs >= latetimeMs) {
							entryClasses = "late ";
						}
					}

					if(entry.incomplete === 1) {
						entryClasses += 'attendance-entry red-bar';
					}
					else if(checkinMs >= overtimeMs) {
						entryClasses += 'attendance-entry yellow-bar';
					}
					else {
						entryClasses += 'attendance-entry blue-bar';
					}

					break;
				case 5:
					checkoutHour= Number(entry.check_out_time.slice(11, 13));
					checkoutMin = Number(entry.check_out_time.slice(14, 16));
					checkoutMs 	= ((checkoutHour*60)+checkoutMin)*60*1000;

					checkinHour = Number(entry.check_in_time.slice(11, 13));
					checkinMin  = Number(entry.check_in_time.slice(14, 16));
					checkinMs 	= ((checkinHour*60)+checkinMin)*60*1000;

					// Corrects time for next day entries (eg 3am)
					if(checkinMs < startMs) {
						checkinMs += 86400000;
					}
					if(checkoutMs < startMs) {
						checkoutMs += 86400000;
					}

					entryWidth 	= (checkoutMs - checkinMs) / 864000;
					// entryWidth = Math.floor(entryWidth);

					idx = checkoutArr.length;
					while(idx>0) {
						idx--;
						if(checkoutArr[idx] <= checkinMs) {
							leftMargin = (checkinMs - checkoutArr[idx]) / 864000;
							// leftMargin = Math.floor(leftMargin);
							idx = 0;
						}
						// Checks if this is the earliest entry.
						// Then checks if it is a late time.
						if(idx === 1 && checkinMs >= latetimeMs) {
							entryClasses = "late ";
						}
					}
					entryClasses = 'attendance-entry dark-blue-bar';
					break;
				case 2:
					entryWidth = 100;
					leftMargin = 0;
					entryClasses = 'attendance-entry green-bar';
					break;
				case 3:
					entryWidth = 100;
					leftMargin = 0;
					entryClasses = 'attendance-entry green-bar';
					break;
				case 4:
					entryWidth = 100;
					leftMargin = 0;
					entryClasses = 'attendance-entry purple-bar';
					break;
				default:
					checkinHour = Number(entry.check_in_time.slice(11, 13));
					checkinMin  = Number(entry.check_in_time.slice(14, 16));
					checkinMs 	= ((checkinHour*60)+checkinMin)*60*1000;

					period 		= 86400000 - checkinMs + checkoutArr[0];
						
					entryWidth	= period / 864000;
					// entryWidth = Math.floor(entryWidth);

					idx = checkoutArr.length;
					while(idx>0) {
						idx--;
						if(checkoutArr[idx] <= checkinMs) {
							leftMargin = (checkinMs - checkoutArr[idx]) / 864000;
							// leftMargin = Math.floor(leftMargin);
							idx = 0;
						}
					}
					entryClasses = 'attendance-entry red-bar';
					break;
			}

			wallMargin = (checkinMs - checkoutArr[0]) / 864000;
			infoClasses = "attendance-info left";

			if(wallMargin > 50) {
				wallMargin 	= wallMargin - 50;
				infoClasses = "attendance-info right";
			}

			// wallMargin = Math.floor(wallMargin);
			entryWidth += '%';
			leftMargin += '%';
			wallMargin += '%';

			return {
				entryWidth 	: entryWidth,
				leftMargin 	: leftMargin,
				wallMargin 	: wallMargin,
				infoClasses : infoClasses,
				classes 	: entryClasses
			};
		};

		var formatAttendance = function(data, page) {

			// console.log('Begin format attendance : ', data);

			// Calculate start time ms
			var	startTime 		= data.check_in_start_at,
				startTemp 		= startTime.split(':'),
				startHours 		= Number(startTemp[0]),
				startMinutes 	= Number(startTemp[1]),
				startMs 		= ((startHours*60)+startMinutes)*60*1000;

			// Calculate over time ms
			var	overTime 		= data.overtime_at,
				overTemp 		= overTime.split(':'),
				overHours 		= Number(overTemp[0]),
				overMinutes 	= Number(overTemp[1]),
				overtimeMs 		= ((overHours*60)+overMinutes)*60*1000;

			// Calculate over time ms
			var	lateTime 		= data.late_after,
				lateTemp 		= lateTime.split(':'),
				lateHours 		= Number(lateTemp[0]),
				lateMinutes 	= Number(lateTemp[1]),
				latetimeMs 		= ((lateHours*60)+lateMinutes)*60*1000;

			data.timeline = formTimeline(startTime);

			data.employees.map(function(employee) {
				var entriesArray 	= employee.attendances;
				var checkoutArr 	= formCheckoutArray(entriesArray, startMs);

				entriesArray.map(function(entry, entryIdx) {
					entry.styles = calculateEntryStyles(entryIdx, entry, checkoutArr, startMs, overtimeMs, latetimeMs);
					return entry;
				});

				employee.checkoutArr = checkoutArr;
				return employee;
			});

			if(page > 1) {
				var tempEmployees = attendanceService.attendances.employees.concat(data.employees);

				data.employees = tempEmployees;

				ApiHandlerService.triggerLoaded();
				angular.copy(data, attendanceService.attendances);
			}
			else {
				ApiHandlerService.triggerLoaded();
				angular.copy(data, attendanceService.attendances);
			}
		};

		var attendanceService = { attendances: [] };

		attendanceService.refreshEmployeeAttendance = function(employeeId) {
			console.log("In attendanceService.refreshEmployeeAttendance : ", employeeId);

			// Calculate start time ms
			var	startTime 		= attendanceService.attendances.check_in_start_at,
				startTemp 		= startTime.split(':'),
				startHours 		= Number(startTemp[0]),
				startMinutes 	= Number(startTemp[1]),
				startMs 		= ((startHours*60)+startMinutes)*60*1000;

			// Calculate over time ms
			var	overTime 		= attendanceService.attendances.overtime_at,
				overTemp 		= overTime.split(':'),
				overHours 		= Number(overTemp[0]),
				overMinutes 	= Number(overTemp[1]),
				overtimeMs 		= ((overHours*60)+overMinutes)*60*1000;

			// Calculate over time ms
			var	lateTime 		= attendanceService.attendances.late_after,
				lateTemp 		= lateTime.split(':'),
				lateHours 		= Number(lateTemp[0]),
				lateMinutes 	= Number(lateTemp[1]),
				latetimeMs 		= ((lateHours*60)+lateMinutes)*60*1000;

			var employee = $filter('filter')(attendanceService.attendances.employees, {id: employeeId})[0];

			employee.checkoutArr = formCheckoutArray(employee.attendances, employee.checkoutArr[0]);
			employee.attendances.map(function(entry, entryIdx) {
				entry.styles = calculateEntryStyles(entryIdx, entry, employee.checkoutArr, startMs, overtimeMs, latetimeMs);
				// return entry;
			});
		};

		attendanceService.getAttendances = function(date, params, user) {
			console.log('In attendanceService.getAttendances', date, params);

			if(user === undefined) {AuthService.retrieveSession();}

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'GET',
				url     : urlPrefix + 'attendances/' + date,
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				params  : params
			})
			.then( function(res) {
				// console.log('before formatAttendance : ', res);
				formatAttendance(res.data, params.page);
				return res.data.num_pages;
			});
		};

		attendanceService.createAttendance = function(newAttendance, employeeId, user) {
			console.log('In attendanceService.createAttendance');

			if(user === undefined) {
				AuthService.retrieveSession();
			}

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'POST',
				url     : urlPrefix + 'employees/' + employeeId + '/attendances',
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				params  : newAttendance
			})
			.then( 
				function(result) {
					// console.log('createAttendance POST result : ', result);
					var employee = $filter('filter')(attendanceService.attendances.employees, {id: employeeId})[0];
					var tempAttendances = [];
					employee.attendances.push(result.data);

					employee.attendances.map(function(entry) {
						var tempString = angular.toJson(entry);
						tempAttendances.push(angular.fromJson(tempString));
					});

					angular.copy(tempAttendances, employee.attendances);

					attendanceService.refreshEmployeeAttendance(employeeId);

					var response = {};
					response.result = 'success';
					response.data 	= result.data;
					ApiHandlerService.triggerLoaded();
					return response;
				},
				ApiHandlerService.errorResponse
			);
		};

		attendanceService.updateAttendance = function(employeeId, newAttendance, user) {
			console.log('In attendanceService.updateAttendance');

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'PUT',
				url     : urlPrefix + 'attendances/' + newAttendance.id,
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				data 	: newAttendance
			})
			.then( 
				function(result) {
					var employee = $filter('filter')(attendanceService.attendances.employees, {id: employeeId})[0];
					var tempAttendances = [];

					var editedEntry = $filter('filter')(employee.attendances, {id: result.data.id})[0];
					var editedEntryIdx = employee.attendances.indexOf(editedEntry);
					employee.attendances[editedEntryIdx] = result.data;
					attendanceService.refreshEmployeeAttendance(employeeId);

					var response = {};
					response.result = 'success';
					response.data 	= result.data;
					ApiHandlerService.triggerLoaded();
					return response;
				},
				ApiHandlerService.errorResponse
			);
		};

		attendanceService.deleteAttendance = function(employeeId, attendanceId, user) {
			console.log('In attendanceService.deleteAttendance', attendanceService.attendances);

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'DELETE',
				url     : urlPrefix + 'attendances/' + attendanceId,
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				}
			})
			.then(
				function(result) {
					var deletedAttendance, deleteIndex;
					var entryDeleted = false;
					attendanceService.attendances.employees.map(function(employee) {
						if(entryDeleted) {
							return;
						}
						var deletedAttendance = $filter('filter')(employee.attendances, {id: attendanceId});
						deleteIndex = employee.attendances.indexOf(deletedAttendance[0]);

						if(deleteIndex !== -1) {
							var tempAttendances = [];
							employee.attendances.splice(deleteIndex, 1);
							employee.attendances.map(function(entry) {
								var tempString = angular.toJson(entry);
								tempAttendances.push(angular.fromJson(tempString));
							});
							angular.copy(tempAttendances, employee.attendances);
							entryDeleted = true;
						}
					});

					attendanceService.refreshEmployeeAttendance(employeeId);

					var response = {};
					response.result = 'success';
					response.data 	= result.data;
					ApiHandlerService.triggerLoaded();
					return response;
				},
				ApiHandlerService.errorResponse
			);
		};

		attendanceService.getEmployeeAttendanceSummary = function(employeeId, date, user) {
			console.log('In attendanceService getEmployeeAttendanceSummary', employeeId, date);

			if(user === undefined) {
				AuthService.retrieveSession();
			}

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'GET',
				url     : urlPrefix + 'employees/' + employeeId + '/attendances',
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				params  : {
					month : date
				}
			})
			.then( 
				ApiHandlerService.successResponse,
				ApiHandlerService.errorResponse
			);
		};

		return attendanceService;
	}
]);
