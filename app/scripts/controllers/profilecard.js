'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:ProfilecardCtrl
 * @description
 * # ProfilecardCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('ProfilecardCtrl', [
		'$rootScope',
		'$scope',
		'$filter',
		'$timeout',
		function ($rootScope, $scope, $filter, $timeout) {
			$scope.foreignOptions = [
				{id:0, name:'Local'},
				{id:1, name:'Foreigner'}
			];

			$scope.positionOptions = [
				'Supervisor',
				'Asst Supervisor',
				'Worker'
			];

			$scope.nationalityOptions = [
				{abbrev:'Bgd', name:'Bangladeshi'},
				{abbrev:'Chn', name:'Chinese'},
				{abbrev:'Ind', name:'Indian'},
				{abbrev:'Mmr', name:'Myanmar'},
				{abbrev:'Mys', name:'Malaysian'},
				{abbrev:'Sgp', name:'Singaporean'},
				// {abbrev:'Vnm', name:'Vietnamese'},
				{abbrev:'Other', name:'Other'}
			];

			$scope.editMode = false;

			$scope.employee.date_of_birth 		= new Date($scope.employee.date_of_birth);
			$scope.employee.joined_date 		= new Date($scope.employee.joined_date);
			$scope.employee.application_date 	= new Date($scope.employee.application_date);
			$scope.employee.wp_expired_at 		= new Date($scope.employee.wp_expired_at);
			$scope.employee.passport_expired_at = new Date($scope.employee.passport_expired_at);
			$scope.employee.commence_date 		= new Date($scope.employee.commence_date);

			$scope.newSoc = {
				soc 			: null,
				soc_expired_at 	: null
			};

			$scope.newSkill = {
				skill_passed 	: null,
				passed_date 	: null
			};

			// // DATEPICKER STUFF
			// //********************************************************************/
			// $scope.datepickers = {
			// 	date_of_birth 		: false,
			// 	joined_date 		: false,
			// 	application_date 	: false,
			// 	wp_expired_at 		: false,
			// 	passport_expired_at : false,
			// 	commence_date 		: false
			// };

			// $scope.dateOptions = {
			// 	showWeeks 			: false,
			// 	startingDay 		: 0,
			// 	formatDay 			: 'dd',
			// 	formatMonth 		: 'MMMM',
			// 	formatYear 			: 'yy',
			// 	minDate 			: '2014-01-01'
			// };

			// $scope.open = function($event) {
			// 	$event.preventDefault();
			// 	$event.stopPropagation();

			// 	var datepickersReset = {
			// 		date_of_birth 		: false,
			// 		joined_date 		: false,
			// 		application_date 	: false,
			// 		wp_expired_at 		: false,
			// 		passport_expired_at : false,
			// 		commence_date 		: false
			// 	};

			// 	angular.copy(datepickersReset, $scope.datepickers);
			// 	$scope.datepickers[$event.target.name] = true;
			// };

			$scope.addNewSoc = function() {
				if(!$scope.newSoc.soc || !$scope.newSoc.soc_expired_at) {
					return;
				}
				$scope.employee.soc_details.push($scope.newSoc.soc);
				$scope.employee.soc_expired_at.push($scope.newSoc.soc_expired_at);
				$scope.newSoc = {
					soc 			: null,
					soc_expired_at 	: null
				};
			};

			$scope.addNewSkill = function() {
				if(!$scope.newSkill.skill_passed || !$scope.newSkill.passed_date) {
					return;
				}
				$scope.employee.skill_passed.push($scope.newSkill.skill_passed);
				$scope.employee.passed_date.push($scope.newSkill.passed_date);
				$scope.newSkill = {
					skill_passed 	: null,
					passed_date 	: null
				};
			};

			$scope.removeSocEntry = function(index) {
				$scope.employee.soc_details.splice(index, 1);
				$scope.employee.soc_expired_at.splice(index, 1);
			};

			$scope.removeSkillEntry = function(index) {
				$scope.employee.skill_passed.splice(index, 1);
				$scope.employee.passed_date.splice(index, 1);
			};

			$scope.toggleEdit = function() {
				$scope.editMode = !$scope.editMode;
			};

			$scope.saveChanges = function(profile) {
				if( !$scope.profileForm.$valid ) {
					$scope.launchErrorModal(['Form invalid.', 'Please check before submission.']);
					return;
				}
				if(profile.avatar === profile.avatar_medium_url) {
					profile.avatar = null;
				}
				var params = {};
				params.formDetails = profile;
				params.file = $scope.selectedImage;

				$scope.manpowerService.updateProfile(params, $scope.session.user).then(function(response) {
					console.log('update profile done', response);
					if(response.result === 'success') {
						$scope.employee.avatar_medium_url = response.data.avatar_medium_url;
						
						// Make another call to update array of soc and skills (due to array problem in multipart forms)
						$scope.manpowerService.updateSkillSoc($scope.employee.id, $scope.employee.soc_details, $scope.employee.soc_expired_at, $scope.employee.skill_passed, $scope.employee.passed_date, $scope.session.user).then(function(response) {
							if(response.result === 'success') {
								$scope.toggleEdit();
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

			// DOCUMENT STUFF
			//********************************************************************/
			$scope.onDocumentSelect = function ($files, id) {
				var params = {};
				params.id = id;
				params.file = $files;

				$scope.manpowerService.uploadDocument(params, $scope.session.user).then(function(response) {
					console.log('upload document done', response);
					if(response.result === 'success') {
						$scope.employee.employee_files.push(response.data);
						// $rootScope.$broadcast('update_profiles');
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
			};

			$scope.deleteDocument = function(documentId) {
				$scope.manpowerService.deleteDocument(documentId, $scope.session.user).then(function(response) {
					console.log('document deleted :', documentId);
					if(response.result === 'success') {
						var deletedDocument = $filter('filter')($scope.employee.employee_files, {id: documentId}),
							deleteIndex 	= $scope.employee.employee_files.indexOf(deletedDocument);
						$scope.employee.employee_files.splice(deleteIndex, 1);
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
			};
		}
	])
	.directive('profileCard', function() {
		return {
			templateUrl: 'views/profilecard.html'
		};
	});
