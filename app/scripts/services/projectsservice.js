'use strict';

/**
 * @ngdoc service
 * @name oasApp.ProjectsService
 * @description
 * # ProjectsService
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('ProjectsService', [
		'$http',
		'AuthService',
		'ApiHandlerService',
		function ($http, AuthService, ApiHandlerService) {
			var urlPrefix = ApiHandlerService.getUrlPrefix();

			var formatProjectDetails = function(data) {
				data.office_expense = data.office_expense * 100;
				ApiHandlerService.triggerLoaded();
				return data;
			};

			var parseLaborcostData = function(response) {
				var laborCost 		= response.data.labor_cost,
					normalData 		= [],
					overtimeData 	= [],
					dateData 		= [],
					result 			= [];

				laborCost.map(function(point) {
					normalData.push(point.normal);
					overtimeData.push(point.overtime);
					dateData.push(point.date);
				});

				result = {
					labor_cost: {
						normal: normalData,
						overtime: overtimeData,
						dates: dateData
					},
					total_cost: response.data.total_cost
				};

				console.log('parseLaborcostData : ', result);
				ApiHandlerService.triggerLoaded();
				return result;
			};

			var projectsService = {};

			projectsService.projects = [];

			projectsService.getProjects = function(user) {
				console.log('In projectsService.getProjects');

				if(user === undefined) { AuthService.retrieveSession(); }

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'projects',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then( function(res) {
					ApiHandlerService.triggerLoaded();
					angular.copy(res.data.projects, projectsService.projects);
				});
			};

			projectsService.getProjectDetails = function(id, user) {
				console.log('In projectsService.getProjectDetails');

				if(user === undefined) { AuthService.retrieveSession(); }

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'projects/' + id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then( function(res) {
					return formatProjectDetails(res.data);
				});
			};

			projectsService.getLaborCost = function(month, projectId, user) {
				console.log('In projectsService.getLaborCost', month, projectId);

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'projects/' + projectId + '/labor_costs',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params: { month: month }
				})
				.then(parseLaborcostData, ApiHandlerService.errorResponse);
			};

			projectsService.createProject = function(params, user) {
				console.log('In projectsService.createProject', params);

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'POST',
					url     : urlPrefix + 'projects/',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data: params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			projectsService.updateProject = function(params, user) {
				console.log('In projectsService.updateProject', params);

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'PUT',
					url     : urlPrefix + 'projects/' + params.id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data: params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			projectsService.deleteProject = function(id, user) {
				console.log('In projectsService.deleteProject : ', id);

				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'projects/' + id,
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

			return projectsService;
		}
	]);
