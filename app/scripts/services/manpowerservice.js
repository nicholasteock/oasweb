'use strict';

/**
 * @ngdoc service
 * @name oasApp.ManpowerService
 * @description
 * # ManpowerService
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('ManpowerService', [
		'$http',
		'$upload',
		'AuthService',
		'ApiHandlerService',
		function ($http, $upload, AuthService, ApiHandlerService) {
			
			var urlPrefix = ApiHandlerService.getUrlPrefix();

			var formatProfiles = function(data) {
				// data.map(function(employee) {
				// 	if(employee.date_of_birth) {
				// 		var date_of_birth = new Date(employee.date_of_birth.replace(/-/g,'/'));
				// 		employee.date_of_birth = date_of_birth;
				// 	}
				// 	if(employee.joined_date) {
				// 		employee.joined_date = new Date(employee.joined_date);
				// 	}
				// 	if(employee.application_date) {
				// 		employee.application_date = new Date(employee.application_date);
				// 	}
				// 	if(employee.wp_expired_at) {
				// 		employee.wp_expired_at = new Date(employee.wp_expired_at);
				// 	}
				// 	if(employee.passport_expired_at) {
				// 		employee.passport_expired_at = new Date(employee.passport_expired_at);
				// 	}
				// 	if(employee.commence_date) {
				// 		employee.commence_date = new Date(employee.commence_date);
				// 	}
				// 	return employee;
				// });
				angular.copy(data, manpowerService.profiles);
			};

			var manpowerService = {};

			manpowerService.profiles = [];
			manpowerService.profilesArchived = [];

			manpowerService.getProfiles = function(user, params) {
				console.log('In manpowerService profiles', params);

				if(user === undefined) AuthService.retrieveSession();

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'employees',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					if(params.page > 1) {
						var temp = manpowerService.profiles.concat(res.data.employees);
						angular.copy(temp, manpowerService.profiles);
					}
					else {	
						angular.copy(res.data.employees, manpowerService.profiles);
					}

					ApiHandlerService.triggerLoaded();
					return res.data.num_pages;
				});
			};

			manpowerService.getProfilesArchived = function(user, params) {
				console.log('In manpowerService getProfilesArchived', params);

				if(user === undefined) AuthService.retrieveSession();

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'employees/archives',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					if(params.page > 1) {
						var temp = manpowerService.profilesArchived.concat(res.data.employees);
						angular.copy(temp, manpowerService.profilesArchived);
					}
					else {	
						angular.copy(res.data.employees, manpowerService.profilesArchived);
					}
					ApiHandlerService.triggerLoaded();
					return res.data.num_pages;
				});
			};

			manpowerService.createProfile = function(newProfile, user) {
				var request 	= {},
					response 	= {};

				console.log('In manpowerService.createProfile', newProfile);

				ApiHandlerService.triggerLoading();

				request = {
					method  : 'POST',
					url     : urlPrefix + 'employees/',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : JSON.parse(angular.toJson(newProfile.formDetails))
				};

				if(newProfile.file.length !== 0) {
					request.file = newProfile.file[0];
					request.fileFormDataName = 'avatar';
				}

				return $upload.upload(request)
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			manpowerService.updateProfile = function(newProfile, user) {
				var request 	= {},
					response 	= {};

				console.log('In manpowerService.updateProfile', newProfile);

				ApiHandlerService.triggerLoading();

				request = {
					method  : 'PUT',
					url     : urlPrefix + 'employees/' + newProfile.formDetails.id,
					headers : {
						'Content-Type': undefined,
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : JSON.parse(angular.toJson(newProfile.formDetails))
				};

				if(newProfile.file.length !== 0) {
					request.file = newProfile.file[0];
					request.fileFormDataName = 'avatar';
				}

				return $upload.upload(request)
				.then( 
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			manpowerService.updateSkillSoc = function(id, socDetails, socExpiryDates, skills, skillPassedDates, user) {
				console.log('In manpowerService.updateSkillSoc', id, socDetails, socExpiryDates, skills, skillPassedDates);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'PUT',
					url     : urlPrefix + 'employees/' + id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : {
						skill_passed 	: skills,
						passed_date 	: skillPassedDates,
						soc_details 	: socDetails,
						soc_expired_at 	: socExpiryDates
					}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			manpowerService.uploadDocument = function(params, user) {
				var request 	= {},
					response 	= {};

				console.log('In manpowerService.uploadDocument', params);

				ApiHandlerService.triggerLoading();

				request = {
					method  : 'POST',
					url     : urlPrefix + 'employees/' + params.id + '/employee_files',
					headers : {
						'Content-Type': undefined,
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				};

				if(params.file.length !== 0) {
					request.file = params.file[0];
					request.fileFormDataName = 'document';
				}

				return $upload.upload(request)
				.then( 
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			manpowerService.deleteDocument = function(documentId, user) {
				console.log('In manpowerService.deleteDocument');

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'employee_files/' + documentId,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then( 
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			manpowerService.archiveProfile = function(employeeId, user) {
				console.log('In manpowerService.archiveProfile');

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'POST',
					url     : urlPrefix + 'employees/' + employeeId + '/archive',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then( 
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			manpowerService.unarchiveProfile = function(employeeId, user) {
				console.log('In manpowerService.unarchiveProfile');

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'POST',
					url     : urlPrefix + 'employees/' + employeeId + '/unarchive',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then( 
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			manpowerService.deleteProfile = function(employeeId, user) {
				console.log('In manpowerService.deleteProfile');

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'employees/' + employeeId,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then( 
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			return manpowerService;
		}
	]);
