'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AllocationCtrl
 * @description
 * # AllocationCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AllocationCtrl', ['$rootScope', '$scope', 'AllocationService', function ($rootScope, $scope, AllocationService) {
		var startWatching = false;
		
		var toggleNormalInfiniteScroll = function(pageLimit) {
			if(pageLimit === $scope.normalParams.page) {
				console.log('normal allocation limit reached');
				$scope.enableInfiniteScroll.normal = false;
			}
			else {
				$scope.enableInfiniteScroll.normal = true;
			}
		};

		var toggleOvertimeInfiniteScroll = function(pageLimit) {
			if(pageLimit === $scope.overtimeParams.page) {
				console.log('overtime allocation limit reached');
				$scope.enableInfiniteScroll.overtime = false;
			}
			else {
				$scope.enableInfiniteScroll.overtime = true;
			}
		};

		$scope.firstLoad = true;
		$scope.enableInfiniteScroll = {normal:false, overtime: false};

		$scope.normalParams = {
			month: $scope.today,
			type: 0,
			page: 1
		};

		$scope.overtimeParams = {
			month: $scope.today,
			type: 1,
			page: 1
		};

		$scope.allocationService = AllocationService;
		$scope.allocationService.normal = AllocationService.normal;
		$scope.allocationService.overtime = AllocationService.overtime;

		$scope.viewtype = 'normal-allocation';

		$scope.$on('tab_changed', function() {
			$('.allocation-normal').scrollTop(0);
			$('.allocation-overtime').scrollTop(0);
			$scope.enableInfiniteScroll = {normal: false, overtime: false};
		});

		$scope.$watch('allocationDate', function(newDate, oldDate) {
			if(oldDate === undefined) return;
			if(!startWatching) return;
			console.log('allocationDate changed : ', newDate, oldDate);

			if(newDate === '') {
				newDate = oldDate;
				return;
			}

			if(typeof newDate === 'object') {
				var date 	= new Date(newDate),
					day 	= date.getDate(),
					month 	= date.getMonth() + 1,
					year  	= date.getFullYear();
				if(month < 10) { month='0' + month; }
				if(day < 10) { day = '0' + day; }
				newDate = year+'-'+month+'-'+day;
			}

			$('.allocation-normal').scrollTop(0);
			$('.allocation-overtime').scrollTop(0);
			$scope.normalParams.month = newDate;
			$scope.overtimeParams.month = newDate;
			$scope.normalParams.page = 1;
			$scope.overtimeParams.page = 1;
			$scope.allocationService.getNormalAllocations($scope.normalParams, $scope.session.user).then(toggleNormalInfiniteScroll);
			$scope.allocationService.getOvertimeAllocations($scope.overtimeParams, $scope.session.user).then(toggleOvertimeInfiniteScroll);
		});

		$scope.$on('update_allocation', function(event, reset) {
			console.log('update_allocation triggered');
			if(reset || $scope.firstLoad) {
				$scope.firstLoad = false;
				$rootScope.$broadcast('alphabetlist_reset');
				$scope.enableInfiniteScroll = {normal: false, overtime: false};
				$scope.normalParams = {
					month: $scope.today,
					type: 0,
					page: 1
				};

				$scope.overtimeParams = {
					month: $scope.today,
					type: 1,
					page: 1
				};
				$scope.allocationDate = $scope.today;
				startWatching = true;
				$scope.allocationService.getNormalAllocations($scope.normalParams, $scope.session.user).then(toggleNormalInfiniteScroll);
				$scope.allocationService.getOvertimeAllocations($scope.overtimeParams, $scope.session.user).then(toggleOvertimeInfiniteScroll);
			}
		});

		$scope.nextPage = function() {
			switch($scope.viewtype) {
				case 'normal-allocation':
					if(!$scope.enableInfiniteScroll.normal) {
						return;
					}
					$scope.normalParams.page += 1;
					$scope.allocationService.getNormalAllocations($scope.normalParams, $scope.session.user).then(toggleNormalInfiniteScroll);
					break;
				case 'overtime-allocation':
					if(!$scope.enableInfiniteScroll.overtime) {
						return;
					}
					$scope.overtimeParams.page += 1;
					$scope.allocationService.getOvertimeAllocations($scope.overtimeParams, $scope.session.user).then(toggleOvertimeInfiniteScroll);
					break;
			}
		};

		//********************************************************************/

		// DATEPICKER STUFF
		//********************************************************************/
		$scope.datepickers = {
			allocationDate : false
		};

		$scope.dateOptions = {
			showWeeks 			: false,
			startingDay 		: 0,
			formatDay 			: 'dd',
			formatMonth 		: 'MMMM',
			formatYear 			: 'yy',
			minDate 			: '2014-01-01'
		};

		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			var datepickersReset = {
				allocationDate : false
			};

			angular.copy(datepickersReset, $scope.datepickers);
			$scope.datepickers[$event.target.name] = true;
		};

		$scope.shiftMonth = function(num) {
			var type 	= typeof $scope.allocationDate,
				val 	= $scope.allocationDate,
				date 	= new Date(val),
				day, month, year;

			if(type === 'string') {
				var dateArr = val.split('-');

				year 	= parseInt(dateArr[0]);
				month 	= parseInt(dateArr[1])-1;
				day 	= parseInt(dateArr[2]);
				date 	= new Date(year, month, day);
			}

			date.setMonth(date.getMonth() + num);
			day 	= date.getDate();
			month 	= date.getMonth()+1;
			year  	= date.getFullYear();

			if(month < 10) { month='0' + month; }
			if(day < 10) { day = '0' + day; }

			$scope.allocationDate = year+'-'+month+'-'+day;
		};
	}])
	.directive('manpowerAllocation', function() {
		return {
			templateUrl: 'views/allocation.html'
		};
	});
