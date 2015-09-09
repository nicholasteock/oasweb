'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:PersonalsettingsCtrl
 * @description
 * # PersonalsettingsCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('PersonalsettingsCtrl', [
		'$scope',
		'$timeout',
		'AccountsService',
		function ($scope, $timeout, AccountsService) {
			$scope.position         = 'Employee Position';
			$scope.email            = 'Employee@oas.com';

			$scope.newPasswordFields = {
				id 						: $scope.session.user.id,
				current_password 		: undefined,
				password 				: undefined,
				password_confirmation 	: undefined
			};

			$scope.updatePersonalSettings = function() {
				var params = {};
				params.formDetails = $scope.newPasswordFields;
				params.file = $scope.selectedImage;

				AccountsService.updateAccount(params, $scope.session.user).then(function(response) {
					console.log('update account done', response);

					if(response.result === 'success') {
						$scope.files = null;
						$scope.newPasswordFields = {
							id 						: $scope.session.user.id,
							current_password 		: undefined,
							password 				: undefined,
							password_confirmation 	: undefined
						};
						$scope.session.restoreSession();
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

			// IMAGE UPLOAD STUFF
			//********************************************************************/
			$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
			$scope.selectedImage = [];
			$scope.avatarThumb = null;

			$scope.onImageSelect = function ($files) {
				$scope.selectedImage = $files;
			};

			$scope.$watch('files', function(files) {
				$scope.formUpload = false;
				if (files != null) {
					for (var i = 0; i < files.length; i++) {
						$scope.errorMsg = null;
						(function(file) {
							$scope.generateThumb(file);
						})(files[i]);
					}
				}
			});

			$scope.generateThumb = function(file) {
				if (file != null) {
					if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
						$timeout(function() {
							var fileReader = new FileReader();
							fileReader.readAsDataURL(file);
							fileReader.onload = function(e) {
								$timeout(function() {
									$scope.avatarThumb = e.target.result;
								});
							};
						});
					}
				}
			};
		}
	])
	.directive('settingsPersonal', function() {
		return {
			templateUrl: 'views/personalsettings.html'
		};
	});
