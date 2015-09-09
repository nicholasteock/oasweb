'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:SalarycardmonthlyCtrl
 * @description
 * # SalarycardmonthlyCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('SalarycardmonthlyCtrl',[
		'$rootScope',
		'$scope',
		function ($rootScope, $scope) {

			$scope.employee.sixteenDays 	= [	'01','02','03','04','05','06','07','08',
									'09','10','11','12','13','14','15','16'];

			$scope.employee.records = [];

			// For stealth mode
			$scope.exceed_overtime 	= $scope.employee.overtime_wage > $scope.employee.capped_overtime_wage;
			// $scope.exceed_overtime 	= $scope.employee.overtime_wage < $scope.employee.capped_overtime_wage;

			// $scope.employee.selectedForPrinting = false;

			// Parses records and forms array of records for view.
			// Fills empty records with -.
			var fillRecords = function(daysInMonth) {
				var records = $scope.employee.dates;
				var day;
				var tempNum;
				var entry;

				for(var i=0; i<daysInMonth; i++) {
					day = i+1;
					day = day<10 ? '0'+day : ''+day;
					$scope.employee.records[i] = {
						day: day,
						overtime_hour_count: '-',
						projects_abbrev_name: '-'
					};
				}

				for(var j=0, jLen=records.length; j<jLen; j++) {
					entry = records[j];
					tempNum = Number(entry.date);
					$scope.employee.records[tempNum-1] = {
						day: entry.date,
						overtime_hour_count: entry.overtime_hour_count,
						projects_abbrev_name: entry.projects_abbrev_name
					};
				}
			};

			$scope.selectForPrinting = function(employee) {
				// console.log('employee selected for printing', $scope.employee.selectedForPrinting);
				$rootScope.$broadcast('print_add_employee', $scope.employee);
			};

			$scope.$watch('monthlyParams.month', function(newDate, oldDate) {
				console.log('newDate: ', newDate, oldDate);

				if(newDate === '') {
					newDate = oldDate;
					return;
				}

				var year, month;

				// If its a Date object we parse it into a date string first.
				if(typeof newDate === 'object') {
					var date 	= new Date(newDate);
						
					month 	= date.getMonth() + 1;
					year  	= date.getFullYear();

					if(month < 10) { month='0' + month; }
					newDate = year+'-'+month;
				}

				year 		= newDate.substring(0,4);
				month 		= newDate.substring(5,7);

				var daysInMonth = new Date(year, month, 0).getDate(),
					tempArr 	= [];

				for(var i=0, iLen=daysInMonth-16; i<iLen; i++) {
					tempArr.push(i+17);
				}
				$scope.employee.remainingDaysInMonth = tempArr;
				fillRecords(daysInMonth);
			});
		}
	])
	.directive('salaryCardMonthly', function() {
		return {
			templateUrl: 'views/salarycardmonthly.html'
		};
	});