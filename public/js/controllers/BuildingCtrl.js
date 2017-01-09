var app = angular.module('BuildingCtrl', ['MainService']);

app.controller('BuildingController', 
	function($scope,$rootScope){ 
		var max_cost = 100; //Millions of dollars
		var min_cost = 0;
		var min_energy = 0;
		var max_energy = 15000; //KwH per day 

		$scope.costimg = "/img/logos/white-dollar.png"; 
		$scope.coststate = false;
	    $scope.togglecost = function() {
        	$scope.coststate = !$scope.coststate;
        	if($scope.coststate){
        		$scope.costimg = "/img/logos/green-dollar.png"; 
        		$scope.costStyle = { "opacity" : "1" };
        	}
        	else
        	{
        		$scope.costimg = "/img/logos/white-dollar.png"; 
        		$scope.costStyle = { "opacity" : "0.3" };
        	}
    	};
    	$scope.costStyle = { "opacity" : "0.3" };

		$scope.energyimg = "/img/logos/green-energy.png"; 
		$scope.energystate = true;
	    $scope.toggleenergy = function() {
        	$scope.energystate = !$scope.energystate;
        	if($scope.energystate){
        		$scope.energyimg = "/img/logos/green-energy.png"; 
        		$scope.energyStyle = { "opacity" : "1" };
        	}
        	else
        	{
        		$scope.energyimg = "/img/logos/white-energy.png"; 
        		$scope.energyStyle = { "opacity" : "0.3" };
        	}
    	};
    	$scope.energyStyle = { "opacity" : "1" };

		$scope.footprintimg = "/img/logos/white-footprint.png"; 
		$scope.footprintstate = false;
	    $scope.togglefootprint = function() {
        	$scope.footprintstate = !$scope.footprintstate;
        	if($scope.footprintstate){
        		$scope.footprintimg = "/img/logos/green-footprint.png"; 
        	}
        	else
        	{
        		$scope.footprintimg = "/img/logos/white-footprint.png"; 
        	}
    	};


		$scope.outputConsumption = "EnergyConsumption"
		$scope.showConsumption = ($scope.outputConsumption == "EnergyConsumption");
		$scope.zoomState = {
			description : "right",
			plot:"right"
		}
        $scope.costLow = min_cost;
        $scope.costHigh = max_cost; 

        $scope.energyLow = min_energy;
        $scope.energyHigh = max_energy;

        $scope.$watchGroup(['costLow','costHigh','energyLow','energyHigh'], function(newValues,oldValues,scope) {
	        $rootScope.costLow = newValues[0]; 
	        $rootScope.costHigh = newValues[1];
	        $rootScope.energyLow = newValues[2];
	        $rootScope.energyHigh = newValues[3];
	        if($rootScope.buildingsList != undefined){
		        for(var i=0; i<$rootScope.buildingsList.length;i++){ 
		        	var building = $rootScope.buildingsList[i];
		        	if(building.mesh != undefined){
			        	if($rootScope.costLow*1000000 > building.params.bCost || $rootScope.costHigh*1000000 < building.params.bCost || $rootScope.energyLow > building.params.tot_energy2014 || $rootScope.energyHigh < building.params.tot_energy2014){
			        		building.mesh.isVisible = false; 
			        	}
			        	else{ 
			        			building.mesh.isVisible = true; 
			        		}
			        	
		        	}

		        }
		    }
        }, true);


        $scope.heatmapBool = false;
        $rootScope.heatmapBool = false;
        $scope.energyheatmapBool = false;
        $rootScope.energyheatmapBool = false;
        var firstrender = true;

        $scope.$watch('heatmapBool', function() { 
        	if(!firstrender){ 
	    		$rootScope.heatmapBool = $scope.heatmapBool;
	        	if($scope.heatmapBool && $rootScope.energyheatmapBool){
	        		$scope.energyheatmapBool = false;
	        	}

	        	if($rootScope.buildingsList != undefined){
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i];
		        		if(!building.params.noCost){
			        		if($scope.heatmapBool){ console.log("here");
				        		var cost = building.params.bCost; 
				        		var ratio = (cost-min_cost*1000000)/(max_cost*1000000-min_cost*1000000);
				        		var mod_ratio = Math.log(1+ratio)/Math.log(2);
				        		var bendpower = 10;
				        		for(var k=0; k<bendpower;k++){
				        			var mod_ratio = Math.log(1+mod_ratio)/Math.log(2);
				        		}
				        		var heatMaterials_index = 50-Math.floor(50*mod_ratio);
				        		if(building.mesh != undefined){
				        			building.mesh.material = $rootScope.heatMaterials[heatMaterials_index];
				        		}
			        		}
			        		else{
			        			if(building.mesh != undefined && !$scope.energyheatmapBool){ console.log("here1")
			        				building.mesh.material = $rootScope.materialBuilding;
			        			}
		        			}	
		        		}
		        		if(!$scope.heatmapBool && $scope.energyheatmapBool && building.params.noEnergy && building.mesh != undefined){console.log("here2");
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}

		        	} 
	        	}
        	}
			firstrender = false; 
        }, true);


        $scope.$watch('energyheatmapBool', function() { console.log("here energy")
        	if(!firstrender){
	        	$rootScope.energyheatmapBool = $scope.energyheatmapBool;
	        	if($scope.energyheatmapBool && $rootScope.heatmapBool){
	        		$scope.heatmapBool = false;
	        	}
	        	if($rootScope.buildingsList != undefined){
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i];
		        		if(!building.params.noEnergy){
			        		if($scope.energyheatmapBool){ 
				        		var energy = building.params.tot_energy2014; 
				        		var ratio = (energy-min_energy)/(max_energy-min_energy);
				        		var mod_ratio = Math.log(1+ratio)/Math.log(2);
				        		var bendpower = 3;
				        		for(var k=0; k<bendpower;k++){
				        			var mod_ratio = Math.log(1+mod_ratio)/Math.log(2);
				        		}
				        		var heatMaterials_index = 50-Math.floor(50*mod_ratio);
				        		if(building.mesh != undefined ){
				        			building.mesh.material = $rootScope.heatMaterials[heatMaterials_index];
				        		}
			        		}
			        		else{
			        			if(building.mesh != undefined && !$scope.heatmapBool){console.log("material energy")
			        				building.mesh.material = $rootScope.materialBuilding;
			        			}
		        			}	
		        		}
		        				        		if(!$scope.energyheatmapBool && $scope.heatmapBool && building.params.noCost && building.mesh != undefined){console.log("here3");
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}
		        	} 
	        	}
        	} 
        	firstrender = false; 
        }, true);

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
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
	            style:{
            		color: "white"
            	}
            }

        },
        yAxis: {
            title: {
                text: 'Average Energy/Day (KwH)',
                style:{
                	color: "white"
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            labels: {
	            style:{
            		color: "white"
            	}
            }
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

