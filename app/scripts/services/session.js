'use strict';

/**
 * @ngdoc service
 * @name oasApp.Session
 * @description
 * # Session
 * Service in the oasApp.
 */
angular.module('oasApp')
	.factory('Session', [
		'$rootScope',
		'$cookies',
		'$cookieStore',
		'$http',
		'$location',
		'$timeout',
		'HTTP_PARAMS',
		function ($rootScope, $cookies, $cookieStore, $http, $location, $timeout, HTTP_PARAMS) {
			var urlPrefix = '';

			if($location.host() === 'mobility.oaspainting.com') {
				urlPrefix = HTTP_PARAMS.prodApi;
			}
			else {
				urlPrefix = HTTP_PARAMS.devApi;
			}

			var session = {};

			session.user = {};

			session.create = function(sessionObject) {
				var isAdmin = (sessionObject.admin === 1);

				var user = {
					id          : sessionObject.id,
					name        : sessionObject.name,
					email 		: sessionObject.email,
					// avatar 		: sessionObject.avatar_original_url,
					avatarMedium: sessionObject.avatar_medium_url,
					avatarThumb : sessionObject.avatar_thumb_url,
					authToken   : sessionObject.authentication_token,
					admin 		: isAdmin,
					roles 		: {}
				};

				if(isAdmin) {
					user.position = 'Admin';
					user.roles = {
						employee_profile 	: true,
						employee_attendance : true,
						salary 				: true,
						allocation 			: true,
						labor_cost 			: true,
						material_cost 		: true,
						project_cost 		: true
					};
				}
				else {
					user.position = sessionObject.position;
					angular.forEach(sessionObject.roles, function(role) {
						user.roles[role] = true;
					});
				}

				$cookies.id 		= sessionObject.id;
				$cookies.authToken  = sessionObject.authentication_token;

				angular.copy(user, session.user);

				var lastViewed = {id: user.id, activePanel:'manpower',activeTab:'profiles'};
				localStorage.lastViewed = angular.toJson(lastViewed);

				$rootScope.$broadcast('session_created', sessionObject.shown_settings);
			};
			session.destroy = function() {
				angular.copy({}, session.user);
				localStorage.clear();
				$cookieStore.remove('userId');
				$cookieStore.remove('user');
				$cookieStore.remove('authToken');
			};
			session.restoreSession = function() {
				var id 			= $cookies.id,
					authToken 	= $cookies.authToken,
					user 		= {};

				$http({
					method  : 'GET',
					url     : urlPrefix+'sessions',
					headers : {
						'X-USER-ID'     : id,
						'X-USER-TOKEN'  : authToken
					}
				})
				.then(function(res) {
					console.log('restore call res : ', res);
					var sessionObject = res.data;

					var isAdmin = (sessionObject.admin === 1);

					user = {
						id          : sessionObject.id,
						name        : sessionObject.name,
						email 		: sessionObject.email,
						position	: sessionObject.position,
						avatar 		: sessionObject.avatar_original_url,
						avatarMedium: sessionObject.avatar_medium_url,
						avatarThumb : sessionObject.avatar_thumb_url,
						admin 		: isAdmin,
						authToken   : authToken,
						roles 		: {}
					};

					if(isAdmin) {
						user.position = 'Admin';
						user.roles = {
							employee_profile 	: true,
							employee_attendance : true,
							salary 				: true,
							allocation 			: true,
							labor_cost 			: true,
							material_cost 		: true,
							project_cost 		: true
						};
					}
					else {
						angular.forEach(sessionObject.roles, function(role) {
							user.roles[role] = true;
						});
					}
					angular.copy(user, session.user);
					
					// Check if current user is from previous session
					var lastViewed = angular.fromJson(localStorage.lastViewed);
					if(user.id !== lastViewed.id) {
						lastViewed = {id: user.id, activePanel:'manpower',activeTab:'profiles'};
						localStorage.lastViewed = angular.toJson(lastViewed);
					}

					$rootScope.$broadcast('session_restored');
				});

			};
			return session;
		}
	]);
