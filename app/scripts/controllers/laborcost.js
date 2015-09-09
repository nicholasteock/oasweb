'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:LaborcostctrlCtrl
 * @description
 * # LaborcostctrlCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('LaborcostCtrl', ['$scope', 'ProjectsService', function ($scope, ProjectsService) {
  		var startWatching = false;
  		$scope.projectsService = ProjectsService;

  		$scope.laborcostDate = $scope.today;
  		$scope.chartData = {
  			normal: {
  				dates: [],
  				costs: []
  			},
  			overtime: {
  				dates: [],
  				costs: []
  			},
  			total_cost: 0
  		};
  		$scope.totalCost = null;
  		$scope.chartParams = null;

  		$scope.chartConfig = {
			options: {
				credits: {
					enabled: false
				},
				chart: {
					type: 'area',
					backgroundColor: 'rgba(0,0,0,0)'
				},
				legend: {
					enabled: false
				},
				xAxis: {
					labels: {
						formatter: function() {
							return this.value[8] + this.value[9];
						}
					},
					title: {enabled: false}
				},
				yAxis: {
					title: {
						enabled: false
					},
					labels: {
						format: '${value}'
					},
					gridLineWidth: 2
				},
				plotOptions: {
					area: {
						stacking: 'normal',
						lineColor: '#666666',
						lineWidth: 0,
						marker: {
							symbol: 'circle'
						},
						states: {
							hover: {
								lineWidthPlus: 0
							}
						}
					}
				},
				tooltip: {
					shared: true,
					valuePrefix: '$',
					crosshairs: [{
						width: 15,
						color: 'rgba(153,153,153,0.5)',
						zIndex: 22
					}],
					headerFormat: '',
					pointFormat: '<div class="top-gap text-center bold laborcost-tooltip-title">{series.name}</div><div class="top-gap text-center laborcost-tooltip-value" style="color: {series.color};">{point.y}</div>',
					backgroundColor: '#000',
					borderColor: '#000',
					borderRadius: 15,
					useHTML: true,
					valueDecimals: 2,
					style: {
						padding: '10px 25px'
					}
				}
			},
			series: [
				{
					name: 'OT WORKING HOURS COST',
					data: [],
					fillColor: '#fbd133',
					color: '#bf9c24'
				},
				{
					name: 'NORMAL WORKING HOURS COST',
					data: [],
					fillColor: '#1e8fc1',
					color: '#2d7ea6'
				}
			],
			title: {
				text: ''
			},
			loading: false
		};

		$scope.$watch('laborcostDate', function(newDate, oldDate) {
			if(!startWatching) return;
			console.log('laborcost month changed : ', newDate, oldDate);

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
			// $('.salary-monthly').scrollTop(0);
			// $scope.monthlyParams.page = 1;
			$scope.projectsService.getLaborCost($scope.laborcostDate, $scope.selectedProject.id, $scope.session.user).then(function(data) {
  				$scope.chartData = data.labor_cost;
  				$scope.totalCost = data.total_cost;

  				$scope.chartConfig.series[0].data = data.labor_cost.overtime;
  				$scope.chartConfig.series[1].data = data.labor_cost.normal;
  				$scope.chartConfig.options.xAxis.categories = data.labor_cost.dates;

  				console.log('update_laborcost success. response : ', data);
  			}, function(error) {
  				console.log('Error in update_laborcost : ', error);
  			});
		});

  		$scope.$on('update_laborcost', function() {
  			$scope.projectsService.getLaborCost($scope.laborcostDate, $scope.selectedProject.id, $scope.session.user).then(function(data) {
  				$scope.chartData = data.labor_cost;
  				$scope.totalCost = data.total_cost;

  				$scope.chartConfig.series[0].data = data.labor_cost.overtime;
  				$scope.chartConfig.series[1].data = data.labor_cost.normal;
  				$scope.chartConfig.options.xAxis.categories = data.labor_cost.dates;

  				startWatching = true;
  				console.log('update_laborcost success. response : ', data);
  			}, function(error) {
  				console.log('Error in update_laborcost : ', error);
  			});
  		});


		// DATEPICKER STUFF
		//********************************************************************/
		$scope.datepickers = {
			laborcostDate : false
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
			// console.log($scope.settingsService.settings);
			$event.preventDefault();
			$event.stopPropagation();

			var datepickersReset = {
				laborcostDate : false
			};

			angular.copy(datepickersReset, $scope.datepickers);
			$scope.datepickers[$event.target.name] = true;
		};

		$scope.shiftMonth = function(num) {
			var type 	= typeof $scope.laborcostDate,
				val 	= $scope.laborcostDate,
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

			$scope.laborcostDate = year+'-'+month+'-'+day;
		};
		//********************************************************************/

  	}])
	.directive('projectLaborcost', function() {
		return {
  			templateUrl: 'views/laborcost.html'
		};
	});
