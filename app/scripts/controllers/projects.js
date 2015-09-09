'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('ProjectsCtrl', [
		'$rootScope',
		'$scope',
		'$modal',
		'ProjectsService',
		function ($rootScope, $scope, $modal, ProjectsService) {
			// Get today's date as string
			var today 	= new Date(),
				day 	= today.getDate(),
				month 	= today.getMonth() + 1,
				year  	= today.getFullYear();
			if(month < 10) { month='0' + month; }
			if(day < 10) { day = '0' + day; }
			$scope.today = year+'-'+month+'-'+day;

			$scope.projectsService = ProjectsService;
			$scope.projectsService.projects = ProjectsService.projects;

			$scope.changeTab = function(tab) {
				if(tab !== 'laborcost' && tab !== 'materialscost' && tab !== 'projectscost') {
					tab = 'laborcost';
				}
				$scope.activeTab = tab;
				$scope.lastViewed.activeTab = tab;
				// $scope.searchQuery = undefined;
				$rootScope.$broadcast('tab_changed', tab);
				switch(tab) {
					case 'laborcost':
						$rootScope.$broadcast('update_laborcost', true);
						break;
					case 'materialscost':
						$rootScope.$broadcast('update_materialscost', true);
						break;
					case 'projectscost':
						$rootScope.$broadcast('update_costsummary', true);
						break;
					default:
						$scope.lastViewed.activeTab = 'laborcost';
						$rootScope.$broadcast('update_laborcost', true);
						break;
				}
			};

			$scope.refreshTab = function() {
				switch($scope.activeTab) {
					case 'laborcost':
						$rootScope.$broadcast('update_laborcost', true);
						break;
					case 'materialscost':
						$rootScope.$broadcast('update_materialscost', true);
						break;
					case 'projectscost':
						$rootScope.$broadcast('update_costsummary', true);
						break;
					default:
						$rootScope.$broadcast('update_laborcost', true);
						break;
				}
			};

			// laborcost | materialscost | projectscost
			// $scope.activeTab = 'laborcost';

			$scope.$on('update_projects', function() {
				console.log('update projects');
				$scope.showProjectsList = true;
				$scope.selectedProject 	= null;
				$scope.projectsService.getProjects($scope.session.user);
			});

			$scope.$on('panel_changed', function(event, panel) {
				if(panel==='projects') {
					setTimeout( function() {
						$rootScope.$broadcast('update_projects');
						$scope.changeTab($scope.lastViewed.activeTab);
					}, 100);
				}
			});

			$scope.showProjectsList = true;
			$scope.selectedProject 	= null;
			$scope.editProject 		= false;

			$scope.selectProject = function(projectId) {
				$scope.showProjectsList = false;
				$scope.selectedProject = $.grep($scope.projectsService.projects, function(project) {return project.id === projectId;})[0];
				
				$scope.projectsService.getProjectDetails(projectId, $scope.session.user).then(function(response) {
					$scope.selectedProject 		= response;
				});

				$scope.refreshTab();
			};

			$scope.updateProject = function(params) {
				ProjectsService.updateProject(params, $scope.session.user).then(function(response) {
					console.log('updateProject done', response);
					if(response.result === 'success') {
						$scope.editProject = false;
						$rootScope.$broadcast('update_projects', true);
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
			};

			$scope.deleteProject = function(id) {
				console.log(id);
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
								type: 'project'
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if (confirm) {
						console.log('Deleting project : ', id);
						$scope.projectsService.deleteProject(id, $scope.session.user).then(function(response) {
							console.log('delete project done', response);
							if(response.result === 'success') {
								$scope.changeTab('laborcost');
								$rootScope.$broadcast('update_projects', true);
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

			$scope.showNewProjectModal = function() {
				// $scope.showProjectsList = false;
				var modalInstance = $modal.open({
					templateUrl 	: 'views/modal/createproject.html',
					controller 		: 'CreateprojectCtrl',
					backdrop 		: 'static',
					backdropClass 	: 'backdrop-oas',
					windowClass 	: 'modal-oas vertical-center createproject-modal'
				});

				modalInstance.result.then(function(newProjectParams) {
					console.log('creating new project: ', newProjectParams);
					$scope.projectsService.createProject(newProjectParams, $scope.session.user).then( function(response) {
						console.log('create new project done', response);
						if(response.result === 'success') {
							console.log('Success response : ', response);
							$rootScope.$broadcast('update_projects');
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
		}
	])
	.directive('projectsTab', function() {
		return {
			templateUrl: 'views/projects.html'
		};
	});
