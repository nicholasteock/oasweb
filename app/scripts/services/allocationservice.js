'use strict';

/**
 * @ngdoc service
 * @name oasApp.allocationService
 * @description
 * # allocationService
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('AllocationService', [
		'$http',
		'AuthService',
		'ApiHandlerService',
		function ($http, AuthService, ApiHandlerService) {
			var urlPrefix = ApiHandlerService.getUrlPrefix();

			var allocationService = {};

			// Format api response JSON to UI friendly format
			var formatAllocation = function(page, data, output) {
				var nationalities 		= data.nationalities,
					projects 			= data.projects,
					allocations 		= data.allocations,
					dateArray 			= [],
					allocationArray 	= [],
					allocationResult 	= {},
					finalOutput 		= {},
					entry 				= 0,
					entryTotal 			= 0;

				projects.map(function(project) {
					project.total = [];
					nationalities.map(function(nationality) {
						project[nationality] = [];
					});
					allocationResult[project.id] = project;
				});

				allocations.map(function(allocation) {
					dateArray.push(allocation.date.substr(8));
				});

				allocations.map(function(allocation) {
					var projects = allocation.projects;
					projects.map(function(project) {
						entryTotal = 0;
						nationalities.map(function(nationality) {
							entry = project.nationalities[nationality] ? project.nationalities[nationality] : 0;
							entryTotal += entry;
							allocationResult[project.id][nationality].push(entry);
						});
						allocationResult[project.id].total.push(entryTotal);
					});
				});

				angular.forEach(allocationResult, function(allocation) {
					allocationArray.push(allocation);
				});

				if(page > 1) {
					finalOutput.nationalities = $.extend(output.nationalities, nationalities);
					finalOutput.nationalitiesCount = finalOutput.nationalities.length;
					finalOutput.dates = dateArray;
					finalOutput.data = output.data.concat(allocationArray);
				}
				else {
					finalOutput.nationalities 		= nationalities;
					finalOutput.nationalitiesCount 	= nationalities.length;
					finalOutput.dates 				= dateArray;
					finalOutput.data 				= allocationArray;
				}
				console.log('Allocation finalOutput : ', finalOutput);
				angular.copy(finalOutput, output);
				ApiHandlerService.triggerLoaded();
			};

			// allocationService.allocations = { normal: {}, overtime: {} };

			allocationService.normal = {};
			allocationService.overtime = {};

			allocationService.getNormalAllocations = function(params, user) {
				console.log('In allocationService.getNormalAllocations', params);

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'allocations',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					console.log('before formatAllocation : ', params.page, res.data);
					formatAllocation(params.page, res.data, allocationService.normal);
					return res.data.num_pages;
				});
			};

			allocationService.getOvertimeAllocations = function(params, user) {
				console.log('In allocationService.getOvertimeAllocations', params);

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'allocations',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					formatAllocation(params.page, res.data, allocationService.overtime);
					return res.data.num_pages;
				});
			};

			return allocationService;
		}
	]);