'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:ProfilesCtrl
 * @description
 * # ProfilesCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('ProfilesCtrl', [
		'$rootScope',
		'$scope',
		'$modal',
		'$filter',
		'ManpowerService',
		function ($rootScope, $scope, $modal, $filter, ManpowerService) {
			var toggleCurrentInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.currentParams.page) {
					console.log('current profiles limit reached');
					$scope.enableInfiniteScroll.current = false;
				}
				else {
					$scope.enableInfiniteScroll.current = true;
				}
			};

			var toggleArchiveInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.archiveParams.page) {
					console.log('archive profiles limit reached');
					$scope.enableInfiniteScroll.archive = false;
				}
				else {
					$scope.enableInfiniteScroll.archive = true;
				}
			};

			$scope.firstLoad = true;

			$scope.enableInfiniteScroll = {current: false, archive: false};

			$scope.currentParams = {
				name 			: undefined,
				name_start_with	: undefined,
				page 			: 1
			};

			$scope.archiveParams = {
				name 			: undefined,
				name_start_with	: undefined,
				page 			: 1
			};

			$scope.manpowerService 					= ManpowerService;
			$scope.manpowerService.profiles 		= ManpowerService.profiles;
			$scope.manpowerService.profilesArchived = ManpowerService.profilesArchived;
			// $scope.manpowerService.getProfiles($scope.session.user, $scope.currentParams).then(toggleCurrentInfiniteScroll);
			// $scope.manpowerService.getProfilesArchived($scope.session.user, $scope.archiveParams).then(toggleArchiveInfiniteScroll);

			$scope.viewtype = 'current';
			$scope.newProfile = false;

			$scope.$on('tab_changed', function() {
				// $scope.enableInfiniteScroll = {current: false, archive: false};
				// $('.profiles-current').scrollTop(0);
				// $('.profiles-archive').scrollTop(0);
			});

			$scope.$on('update_profiles', function(event, reset) {
				console.log('update_profiles triggered', reset);
				if(reset || $scope.firstLoad) {
					$scope.firstLoad = false;
					$rootScope.$broadcast('alphabetlist_reset');
					$scope.enableInfiniteScroll = {current: false, archive: false};
					$scope.currentParams = {
						name 			: undefined,
						name_start_with	: undefined,
						page 			: 1
					};

					$scope.archiveParams = {
						name 			: undefined,
						name_start_with	: undefined,
						page 			: 1
					};
					$scope.newProfile = false;
					$scope.manpowerService.getProfiles($scope.session.user, $scope.currentParams).then(toggleCurrentInfiniteScroll);
					$scope.manpowerService.getProfilesArchived($scope.session.user, $scope.archiveParams).then(toggleArchiveInfiniteScroll);
				}
			});

			// $scope.$on('update_profiles', function(event, reset) {
			// 	console.log('update_profiles triggered', reset);
			// 	if(reset) {
			// 		$rootScope.$broadcast('reset');
			// 		$scope.enableInfiniteScroll = {current: false, archive: false};
			// 		$scope.currentParams = {
			// 			name 			: undefined,
			// 			name_start_with	: undefined,
			// 			page 			: 1
			// 		};

			// 		$scope.archiveParams = {
			// 			name 			: undefined,
			// 			name_start_with	: undefined,
			// 			page 			: 1
			// 		};
			// 	}
			// 	$scope.newProfile = false;
			// 	$scope.manpowerService.getProfiles($scope.session.user, $scope.currentParams).then(toggleCurrentInfiniteScroll);
			// 	$scope.manpowerService.getProfilesArchived($scope.session.user, $scope.archiveParams).then(toggleArchiveInfiniteScroll);
			// });

			$scope.$on('profiles_search', function(event, query) {
				// console.log('search_changed triggered : ', query);
				$scope.enableInfiniteScroll = {current: false, archive: false};
				switch($scope.viewtype) {
					case 'current':
						$scope.currentParams.name = query;
						$scope.currentParams.page = 1;
						$scope.manpowerService.getProfiles($scope.session.user, $scope.currentParams).then(toggleCurrentInfiniteScroll);
						break;
					case 'archive':
						$scope.archiveParams.name = query;
						$scope.archiveParams.page = 1;
						$scope.manpowerService.getProfilesArchived($scope.session.user, $scope.archiveParams).then(toggleArchiveInfiniteScroll);
						break;
				}
			});

			$scope.$on('profiles_current_alphabet_changed', function(event, alphabet) {
				$scope.currentParams.name_start_with = alphabet;
				$scope.currentParams.page = 1;
				$scope.enableInfiniteScroll.current = false;
				$scope.manpowerService.getProfiles($scope.session.user, $scope.currentParams).then(toggleCurrentInfiniteScroll);
			});

			$scope.$on('profiles_archive_alphabet_changed', function(event, alphabet) {
				$scope.archiveParams.name_start_with = alphabet;
				$scope.archiveParams.page = 1;
				$scope.enableInfiniteScroll.archive = false;
				$scope.manpowerService.getProfilesArchived($scope.session.user, $scope.archiveParams).then(toggleArchiveInfiniteScroll);
			});

			$scope.nextPage = function() {
				switch($scope.viewtype) {
					case 'current':
						if(!$scope.enableInfiniteScroll.current) {
							return;
						}
						$scope.currentParams.page += 1;
						$scope.manpowerService.getProfiles($scope.session.user, $scope.currentParams).then(toggleCurrentInfiniteScroll);
						break;
					case 'archive':
						if(!$scope.enableInfiniteScroll.archive) {
							return;
						}
						$scope.archiveParams.page += 1;
						$scope.manpowerService.getProfilesArchived($scope.session.user, $scope.archiveParams).then(toggleArchiveInfiniteScroll);
						break;
				}
			};

			$scope.deleteProfileConfirmation = function(employeeId) {
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
								type: 'profile'
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if (confirm) {
						$scope.manpowerService.deleteProfile(employeeId, $scope.session.user).then(function(response) {
							if(response.result === 'success') {
								console.log('profile deleted :', employeeId);
								var deletedProfile, deleteIndex;
								switch ($scope.viewtype) {
									case 'current':
										deletedProfile 	= $filter('filter')($scope.manpowerService.profiles, {id: employeeId});
										deleteIndex 	= $scope.manpowerService.profiles.indexOf(deletedProfile[0]);
										$scope.manpowerService.profiles.splice(deleteIndex, 1);
										break;
									case 'archive':
										deletedProfile 	= $filter('filter')($scope.manpowerService.profilesArchived, {id: employeeId});
										deleteIndex 	= $scope.manpowerService.profilesArchived.indexOf(deletedProfile[0]);
										$scope.manpowerService.profilesArchived.splice(deleteIndex, 1);
										break;
								}
								return;
							}
							else {
								switch(response.status) {
									case 500:
										console.error('500: ', response.data);
										$scope.launchErrorModal(['Internal server error']);
										break;
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

			$scope.archive = function(employeeId) {
				console.log('archiving employee with id : ', employeeId);
				$scope.manpowerService.archiveProfile(employeeId, $scope.session.user).then(function(response) {
					console.log('archive profile done', response);
					if(response.result === 'success') {
						$rootScope.$broadcast('update_profiles', true);
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

			$scope.unarchive = function(employeeId) {
				console.log('unarchiving employee with id : ', employeeId);
				$scope.manpowerService.unarchiveProfile(employeeId, $scope.session.user).then(function(response) {
					console.log('unarchive profile done', response);
					if(response.result === 'success') {
						$rootScope.$broadcast('update_profiles', true);
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
		}
	]).directive('manpowerProfiles', function() {
		return {
			templateUrl: 'views/profiles.html'
		};
	});
