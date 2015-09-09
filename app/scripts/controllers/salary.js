'use strict';

/**
	* @ngdoc function
	* @name oasApp.controller:SalaryCtrl
	* @description
	* # SalaryCtrl
	* Controller of the oasApp
*/
angular.module('oasApp')
	.controller('SalaryCtrl', [
		'$rootScope',
		'$scope',
		'$filter',
		'PrinterService',
		'SalaryService',
		'STEALTH_ENTRIES',
		function ($rootScope, $scope, $filter, PrinterService, SalaryService, STEALTH_ENTRIES) {
			var toggleDailyInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.dailyParams.page) {
					console.log('daily salary limit reached');
					$scope.enableInfiniteScroll.daily = false;
				}
				else {
					$scope.enableInfiniteScroll.daily = true;
				}
			};

			var toggleMonthlyInfiniteScroll = function(pageLimit) {
				if(pageLimit === $scope.monthlyParams.page) {
					console.log('monthly salary limit reached');
					$scope.enableInfiniteScroll.monthly = false;
				}
				else {
					$scope.enableInfiniteScroll.monthly = true;
				}
			};

			$scope.firstLoad = true;
			$scope.enableInfiniteScroll = {daily: false, monthly: false};

			$scope.dailyParams = {
				date 			: $scope.today,
				name 			: undefined,
				name_start_with	: undefined,
				page 			: 1
			};

			$scope.monthlyParams = {
				month 			: $scope.today,
				name 			: undefined,
				name_start_with	: undefined,
				page 			: 1
			};

			$scope.printArray = [];

			var startWatching = false;
			$scope.salaryService 	= SalaryService;
			$scope.salary			= SalaryService.salary;
			$scope.stealthEntries 	= STEALTH_ENTRIES;

			$scope.$watch('dailyParams.date', function(newDate, oldDate) {
				if(!startWatching) return;
				console.log('salary day changed : ', newDate, oldDate);

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
				$('.salary-daily').scrollTop(0);
				$scope.dailyParams.page = 1;
				$scope.salaryService.getDailySalary($scope.dailyParams, $scope.session.user).then(toggleDailyInfiniteScroll);
			});

			$scope.$watch('monthlyParams.month', function(newDate, oldDate) {
				if(!startWatching) return;
				console.log('salary month changed : ', newDate, oldDate);

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
				$('.salary-monthly').scrollTop(0);
				$scope.monthlyParams.page = 1;
				$scope.salaryService.getMonthlySalary($scope.monthlyParams, $scope.session.user).then(toggleMonthlyInfiniteScroll);
			});

			$scope.$on('tab_changed', function() {
				// $('.salary-daily').scrollTop(0);
				// $('.salary-monthly').scrollTop(0);
				// $scope.enableInfiniteScroll = {daily: false, monthly: false};
			});

			$scope.$on('update_salary', function(event, reset) {
				console.log('update_salary triggered', reset);
				if(reset || $scope.firstLoad) {
					$scope.firstLoad = false;
					$rootScope.$broadcast('alphabetlist_reset');
					$('.salary-daily').scrollTop(0);
					$('.salary-monthly').scrollTop(0);
					$scope.enableInfiniteScroll = {daily: false, monthly: false};
					$scope.dailyParams = {
						date 			: $scope.today,
						name 			: undefined,
						name_start_with	: undefined,
						page 			: 1
					};

					$scope.monthlyParams = {
						month 			: $scope.today,
						name 			: undefined,
						name_start_with	: undefined,
						page 			: 1
					};
					startWatching = true;
					$scope.salaryService.getDailySalary($scope.dailyParams, $scope.session.user).then(toggleDailyInfiniteScroll);
					$scope.salaryService.getMonthlySalary($scope.monthlyParams, $scope.session.user).then(toggleMonthlyInfiniteScroll);
				}
			});

			// $scope.$on('update_salary', function(event, reset) {
			// 	console.log('update_salary triggered', reset);
			// 	if(reset) {
			// 		$rootScope.$broadcast('reset');
			// 		$('.salary-daily').scrollTop(0);
			// 		$('.salary-monthly').scrollTop(0);
			// 		$scope.enableInfiniteScroll = {daily: false, monthly: false};
			// 		$scope.dailyParams = {
			// 			date 			: $scope.today,
			// 			name 			: undefined,
			// 			name_start_with	: undefined,
			// 			page 			: 1
			// 		};

			// 		$scope.monthlyParams = {
			// 			month 			: $scope.today,
			// 			name 			: undefined,
			// 			name_start_with	: undefined,
			// 			page 			: 1
			// 		};
			// 		startWatching = true;
			// 	}
			// 	$scope.salaryService.getDailySalary($scope.dailyParams, $scope.session.user).then(toggleDailyInfiniteScroll);
			// 	$scope.salaryService.getMonthlySalary($scope.monthlyParams, $scope.session.user).then(toggleMonthlyInfiniteScroll);
			// });

			$scope.$on('salary_search', function(event, query) {
				console.log('search_changed triggered : ', query);
				$scope.enableInfiniteScroll = {daily: false, monthly: false};
				switch($scope.viewtype) {
					case 'daily':
						$scope.dailyParams.name = query;
						$scope.dailyParams.page = 1;
						$scope.salaryService.getDailySalary($scope.dailyParams, $scope.session.user).then(toggleDailyInfiniteScroll);
						break;
					case 'monthly':
						$scope.monthlyParams.name = query;
						$scope.monthlyParams.page = 1;
						$scope.salaryService.getMonthlySalary($scope.monthlyParams, $scope.session.user).then(toggleMonthlyInfiniteScroll);
						break;
				}
			});

			$scope.$on('salary_daily_alphabet_changed', function(event, alphabet) {
				$scope.dailyParams.name_start_with = alphabet;
				$scope.dailyParams.page = 1;
				$scope.enableInfiniteScroll.daily = true;
				$scope.salaryService.getDailySalary($scope.dailyParams, $scope.session.user).then(toggleDailyInfiniteScroll);
			});

			$scope.$on('salary_monthly_alphabet_changed', function(event, alphabet) {
				$scope.monthlyParams.name_start_with = alphabet;
				$scope.monthlyParams.page = 1;
				$scope.enableInfiniteScroll.monthly = true;
				$scope.salaryService.getMonthlySalary($scope.monthlyParams, $scope.session.user).then(toggleMonthlyInfiniteScroll);
			});

			// Triggered when print checkbox is selected.
			// If employee found in printArray, implies selected before so we remove it
			// If employee not found, we add it into printArray
			$scope.$on('print_add_employee', function(event, employee) {
				var index = $scope.printArray.indexOf(employee);
				
				if(index === -1) {
					$scope.printArray.push(employee);
					// console.log('after adding employee : ', $scope.printArray);
				}
				else {
					$scope.printArray.splice(index, 1); 
					// console.log('after removing employee : ', $scope.printArray);
				}
			});

			$scope.nextPage = function() {
				switch($scope.viewtype) {
					case 'daily':
						if(!$scope.enableInfiniteScroll.daily) {
							return;
						}
						$scope.dailyParams.page += 1;
						$scope.salaryService.getDailySalary($scope.dailyParams, $scope.session.user).then(toggleDailyInfiniteScroll);
						break;
					case 'monthly':
						if(!$scope.enableInfiniteScroll.monthly) {
							return;
						}
						console.log('monthly nextPage');
						$scope.monthlyParams.page += 1;
						$scope.salaryService.getMonthlySalary($scope.monthlyParams, $scope.session.user).then(toggleMonthlyInfiniteScroll);
						break;
				}
			};
			//********************************************************************/

			// ADDITIONAL FUNCTION CALLS
			//********************************************************************/
			$scope.viewtype   = 'daily';
			$scope.salarymode = 'live';
			$scope.editMode = false;

			$scope.printAllSalary = function() {
				var printArray 	= [];
				var tempScope 	= {};
				var params = {
					month 			: $scope.monthlyParams.month,
					name 			: undefined,
					name_start_with	: undefined,
					page 			: 0
				};

				var date 		= new Date(params.month);
				var month 		= date.getMonth() + 1;
				var year 		= date.getFullYear();
				var daysInMonth = new Date(year, month, 0).getDate();


				var sixteenDays 			= $scope.salary.monthly[0].sixteenDays;
				var remainingDaysInMonth 	= $scope.salary.monthly[0].remainingDaysInMonth;

				$scope.salaryService.getAllMonthlySalary(params, $scope.session.user).then(function(data) {
					data.map(function(employee) {
						employee.sixteenDays = sixteenDays;
						employee.remainingDaysInMonth = remainingDaysInMonth;
						employee.records = [];

						var records = employee.dates;
						var day;
						var tempNum;
						var entry;

						for(var i=0; i<daysInMonth; i++) {
							day = i+1;
							day = day<10 ? '0'+day : ''+day;
							employee.records[i] = {
								day: day,
								overtime_hour_count: '-',
								projects_abbrev_name: '-'
							};
						}

						for(var j=0, jLen=records.length; j<jLen; j++) {
							entry = records[j];
							tempNum = Number(entry.date);
							employee.records[tempNum-1] = {
								day: entry.date,
								overtime_hour_count: entry.overtime_hour_count,
								projects_abbrev_name: entry.projects_abbrev_name
							};
						}
					});
					tempScope.printArray = data;
					console.log('printAllSalary array : ', tempScope);
					PrinterService.print('views/printtemplate.html', tempScope);
					return;
				});
			};

			$scope.printSelectedSalary = function() {
				// var printArray 	= [];
				var tempScope 	= {};

				// $scope.salary.monthly.map(function(employee) {
				// 	if(employee.selectedForPrinting) {
				// 		printArray.push(employee);
				// 	}
				// });

				if($scope.printArray.length === 0) {
					alert('No employees selected for printing.');
					return;
				}

				tempScope.printArray = $scope.printArray;

				PrinterService.print('views/printtemplate.html', tempScope);
				$scope.salary.monthly.map(function(employee) {
					employee.selectedForPrinting = false;
				});
			};

			$scope.printSingle = function(id) {

				var printArray 	= [];
				var tempScope 	= {};

				printArray = $filter('filter')($scope.salary.monthly, function(employee) {
					return employee.id === id;
				});

				tempScope.printArray = printArray;

				PrinterService.print('views/printtemplate.html', tempScope);
				$scope.salary.monthly.map(function(employee) {
					employee.selectedForPrinting = false;
				});
			};

			// DATEPICKER STUFF
			//********************************************************************/
			$scope.datepickers = {
				salaryDate : false
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
					salaryDate : false
				};

				angular.copy(datepickersReset, $scope.datepickers);
				$scope.datepickers[$event.target.name] = true;
			};

			$scope.shiftDay = function(num) {
				var type 	= typeof $scope.dailyParams.date,
					val 	= $scope.dailyParams.date,
					date 	= new Date(val),
					day, month, year;

				if(type === 'string') {
					var dateArr = val.split('-');

					year 	= parseInt(dateArr[0]);
					month 	= parseInt(dateArr[1])-1;
					day 	= parseInt(dateArr[2]);
					date 	= new Date(year, month, day);
				}

				date.setDate(date.getDate() + num);
				day 	= date.getDate();
				month 	= date.getMonth()+1;
				year  	= date.getFullYear();

				if(month < 10) { month='0' + month; }
				if(day < 10) { day = '0' + day; }

				$scope.dailyParams.date = year+'-'+month+'-'+day;
			};

			$scope.shiftMonth = function(num) {
				var type 	= typeof $scope.monthlyParams.month,
					val 	= $scope.monthlyParams.month,
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

				$scope.monthlyParams.month = year+'-'+month+'-'+day;
			};
			//********************************************************************/
		}
	])
	.directive('manpowerSalary', function() {
		return {
			templateUrl: 'views/salary.html'
		};
	});
