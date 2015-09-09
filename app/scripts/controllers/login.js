'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('LoginCtrl', [
		'$rootScope',
		'$scope',
		'$modal',
		'$timeout',
		'$location',
		'AUTH_EVENTS', 'AuthService',
		function ($rootScope, $scope, $modal, $timeout, $location, AUTH_EVENTS, AuthService) {
			// $scope.credentials = {
			// 	email     : 'testing@oaspainting.com',
			// 	password  : 'oasadmin123!'
			// };

			var launchErrorModal = function(errors, isNotification) {
				var modalInstance = $modal.open({
					templateUrl   : 'views/modal/errormodal.html',
					controller    : 'ErrormodalCtrl',
					backdrop      : 'static',
					backdropClass : 'backdrop-oas',
					size          : 'sm',
					windowClass   : 'modal-oas vertical-center error-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								isNotification: isNotification,
								errors: errors
							};
						}
					}
				});
			};

			$scope.credentials = {
				email     : '',
				password  : ''
			};

			$scope.login = function(credentials) {
				AuthService.login(credentials).then(function(response) {
					if(response.result === 'success') {
						response.data.email = credentials.email;
						$rootScope.session.create(response.data);
					}
					else {
						launchErrorModal(response.data);
					}
				});
			};

			$scope.forgotpassword = function() {
				var modalInstance = $modal.open({
							templateUrl   : 'views/modal/forgotpassword.html',
							controller    : 'ForgotpasswordCtrl',
							backdrop      : 'static',
							backdropClass : 'backdrop-oas',
							size          : 'sm',
							windowClass   : 'modal-oas vertical-center forgotpassword-modal',
				});

				modalInstance.result.then(function(email) {
					AuthService.forgotPassword(email).then(function(response) {
						if(response.result === 'success') {
							console.log('Success response : ', response);
							launchErrorModal(['A new password will be sent to this email address'], true);
							return;
						}
						else {
							switch(response.status) {
								case 422:
									console.error('422: ', response.data);
									launchErrorModal(response.data, false);
									break;
							}
						}
					});
				});
			};

			$scope.generalsettings = function() {
				var modalInstance = $modal.open({
							templateUrl   : 'views/modal/generalsettingsmodal.html',
							controller    : 'GeneralsettingsmodalCtrl',
							backdrop      : 'static',
							backdropClass : 'backdrop-oas',
							windowClass   : 'modal-oas generalsettings-modal',
				});

				modalInstance.result.then(function() {
					return;
				});
			};

			$scope.$on('session_created', function(event, shown_settings) {
				$location.path('/dashboard');
				// window.location.reload();
				if(!shown_settings) {
					$scope.generalsettings();
				}
			});
		}
	])
	.directive('login', function() {
		return {
			templateUrl: 'views/login.html'
		};
	});
