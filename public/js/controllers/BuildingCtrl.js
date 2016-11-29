var app = angular.module('BuildingCtrl', ['MainService']);

app.controller('BuildingController', 
	function($scope,$rootScope){
		$rootScope.mouseOverBuildingName = "No Building Selected"; 
		$rootScope.defaultcurrentparams =  [
			{
				name:"Address",
				value:"Select a building...",
			}, 
			{
				name:"Architect",
				value:"Select a building...",
			},
			{
				name:"Build Date",
				value:"Select a building...",
			},
			{
				name:"Contractor",
				value:"Select a building...",
			},
			{
				name:"Cost",
				value:"Select a building...",
			},
			{
				name:"Renovation Date",
				value:"Select a building...",
			},
			{
				name:"Material",
				value:"Select a building...",
			},
			{
				name:"Named After",
				value:"Select a building...",
			},

		]; 
		$rootScope.currentparams = $rootScope.defaultcurrentparams; 


		$rootScope.chartOptions = {
        chart: {
            backgroundColor: null,
            
        },
        title: {
            text: 'Select a building...',
         style: {
             color: 'white',
             font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
         }
        },
        xAxis: {
            categories:  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Energy (KwH)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'KwH'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        credits: { 
            enabled: false
        },
        series: [{
            name: '2012',
            data: []
        }, {
            name: '2013',
            data: []
        }, {
            name: '2014',
            data: []
        }, {
            name: '2015',
            data: []
        }]
    }; 

		

	}

);

