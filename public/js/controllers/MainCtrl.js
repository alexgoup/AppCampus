var app = angular.module('MainCtrl', ['MainService']);

app.controller('MainController', 
	function($scope,BuildingFactory){
		$scope.campus_str = 'Campus'; // AngularJS two way data-binding
		$scope.building_str = 'Building';
		$scope.buildings = [
		  {name: "CRC", cost: 15000000}, 
		  {name: "Clough Commons", cost: 30000000},
		  {name: "Bobby Dodd Stadium", cost: 20000000},
		];
		$scope.zones = [];
		BuildingFactory.getZones().then(function(result) {
    		$scope.zones = result.data;
			});
		$scope.mouseOverBuildingName = "No Building Selected"; 
		$scope.currentparams = [
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

		

	}

);

