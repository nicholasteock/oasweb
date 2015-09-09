'use strict';

/**
 * @ngdoc service
 * @name oasApp.AuthService
 * @description
 * # AuthService
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('AuthService', [
		'$http',
		'$location',
		'$cookies',
		'Session',
		'HTTP_PARAMS',
		function ($http, $location, $cookies, Session, HTTP_PARAMS) {
			var urlPrefix = '';

			if($location.host() === 'mobility.oaspainting.com') {
				urlPrefix = HTTP_PARAMS.prodApi;
			}
			else {
				urlPrefix = HTTP_PARAMS.devApi;
			}

			var successResponse = function(result) {
				var response = {};
				response.result = 'success';
				response.data 	= result.data;
				return response;
			};

			var errorResponse = function(result) {
				var response = {};
				response.result = 'failure';
				response.status = result.status;
				response.data 	= result.data.errors;
				return response;
			};

			var authService = {};

			authService.login = function(credentials) {
				console.log('In authservice login');
				return $http({
					method  : 'POST',
					url     : urlPrefix+'sessions',
					headers : {
						'X-APP-SECRET': HTTP_PARAMS.appSecret
					},
					params  : {
						email   : credentials.email,
						password: credentials.password
					}
				})
				.then(successResponse, errorResponse);
			};

			authService.userInfo = function(userId, authToken) {
				console.log('In authservice userinfo');
				return $http({
					method  : 'GET',
					url     : urlPrefix+'sessions',
					headers : {
						'X-USER-ID'     :userId,
						'X-USER-TOKEN'  :authToken
					}
				})
				.then(function(res) {
					return res.data;
				});
			};

			authService.isAuthenticated = function() {
				return !!$cookies.authToken;
			};

			authService.isAuthorized = function(authorizedRoles) {
				if(!angular.isArray(authorizedRoles)) {
					authorizedRoles = [authorizedRoles];
				}
				return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
			};

			authService.forgotPassword = function(email) {
				console.log('In authservice forgotPassword', email);
				return $http({
					method  : 'POST',
					url     : urlPrefix+'forgot_passwords',
					headers : {
						'X-APP-SECRET': HTTP_PARAMS.appSecret
					},
					data  : {
						email   : email
					}
				})
				.then(successResponse, errorResponse);
			};

			return authService;
		}
	]);
