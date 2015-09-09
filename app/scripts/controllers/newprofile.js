'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:NewprofileCtrl
 * @description
 * # NewprofileCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('NewprofileCtrl', [ '$rootScope', '$scope', '$modal', '$timeout', function ($rootScope, $scope, $modal, $timeout) {
		var clearNewProfileFields = function() {
			$scope.newEmployee = {
				name 					: 'New Employee',
				avatar 					: null,
				avatar_medium_url 		: null,
				login_id 				: null,
				passcode 				: null,
				dormitory_address 		: null,
				nationality 			: null,
				foreign 				: 0,
				date_of_birth 			: null,
				position 				: 'Worker',
				joined_date 			: null,
				work_permit_number		: null,
				application_date 		: null,
				commence_date 			: null,
				employment_period 		: null,
				fin 					: null,
				wp_expired_at 			: null,
				passport 				: null,
				passport_expired_at 	: null,
				skill_passed 			: [],
				passed_date 			: [],
				soc_details 			: [],
				soc_expired_at 			: [],
				additional_qualification: null,
				others 					: null,
				basic_rate 				: null,
				skill_rate				: null,
				overtime_rate 			: null,
				levy_rate 				: null,
				meal_allowance 			: null,
				employee_files 			: null
			};
		};

		clearNewProfileFields();

		$scope.$watch('newProfile', function() {
			clearNewProfileFields();
		});

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

		$scope.newSoc = {
			soc 			: null,
			soc_expired_at 	: null
		};

		$scope.newSkill = {
			skill_passed 	: null,
			passed_date 	: null
		};

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
		// 	formatYear 			: 'yy'
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
			$scope.newEmployee.soc_details.push($scope.newSoc.soc);
			$scope.newEmployee.soc_expired_at.push($scope.newSoc.soc_expired_at);
			$scope.newSoc = {
				soc 			: null,
				soc_expired_at 	: null
			};
		};

		$scope.addNewSkill = function() {
			if(!$scope.newSkill.skill_passed || !$scope.newSkill.passed_date) {
				return;
			}
			$scope.newEmployee.skill_passed.push($scope.newSkill.skill_passed);
			$scope.newEmployee.passed_date.push($scope.newSkill.passed_date);
			$scope.newSkill = {
				skill_passed 	: null,
				passed_date 	: null
			};
		};

		$scope.removeSocEntry = function(index) {
			$scope.newEmployee.soc_details.splice(index, 1);
			$scope.newEmployee.soc_expired_at.splice(index, 1);
		};

		$scope.removeSkillEntry = function(index) {
			$scope.newEmployee.skill_passed.splice(index, 1);
			$scope.newEmployee.passed_date.splice(index, 1);
		};

		$scope.createEmployee = function() {
			if(!$scope.profileForm.$valid) {
				$scope.launchErrorModal(['Form invalid. Please check before submission.']);
				return;
			}
			var params = {};
			params.formDetails = $scope.newEmployee;
			params.file = $scope.selectedFile;

			$scope.manpowerService.createProfile(params, $scope.session.user).then(function(response) {
				console.log('create profile done', response);
				if(response.result === 'success') {
					if($scope.newEmployee.soc_details.length > 0 || $scope.newEmployee.skill_passed.length > 0) {
						$scope.manpowerService.updateSkillSoc(response.data.id, $scope.newEmployee.soc_details, $scope.newEmployee.soc_expired_at, $scope.newEmployee.skill_passed, $scope.newEmployee.passed_date, $scope.session.user).then(function(response) {
							if(response.result === 'success') {
								clearNewProfileFields();
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
					}
					else {
						clearNewProfileFields();
						$rootScope.$broadcast('update_profiles', true);
					}
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
		$scope.selectedFile = [];
		$scope.avatarThumb = "";
		$scope.onFileSelect = function ($files) {
			$scope.selectedFile = $files;
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
		
	}])
	.directive('newprofileCard', function() {
		return {
			templateUrl: 'views/newprofilecard.html'
		};
	});
