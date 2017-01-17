var app = angular.module('BuildingCtrl', ['MainService']);

app.controller('BuildingController', 
	function($scope,$rootScope){ 
		var max_cost = 100; //Millions of dollars
		var min_cost = 0;
		var min_energy = 0;
		var min_footprint = 0;
		var max_energy_year = 15000; //KwH per day 
		var max_energy_month = 1500; //KwH per day 
		var max_footprint_month = 1500*0.614; //KwH per day 
		var max_footprint_year = 9000; //KwH per day 

		$scope.showEnergyGraph = true;
		$scope.showFootprintGraph = false;

		$scope.toggleEnergyGraph = function() {
			if($scope.showEnergyGraph){
				$scope.showFootprintGraph = false;
			}
		}	

		$scope.toggleFootprintGraph = function() {
			if($scope.showFootprintGraph){
				$scope.showEnergyGraph = false;
			}
		}

		$scope.coststate = true;
		$scope.costimg = $scope.coststate ? "/img/logos/green-dollar.png" : "/img/logos/white-dollar.png"; 
		
	    $scope.togglecost = function() {
        	$scope.coststate = !$scope.coststate;
        	if($scope.coststate){
        		$scope.costimg = "/img/logos/green-dollar.png"; 
        		/*$scope.costStyle = { "opacity" : "1" };*/
        	}
        	else
        	{
        		$scope.costimg = "/img/logos/white-dollar.png"; 
        		/*$scope.costStyle = { "opacity" : "0.2" };*/
        	}
    	};
    	/*$scope.costStyle = { "opacity" : "1" };*/

    	$scope.energystate = true;
		$scope.energyimg = $scope.energystate ? "/img/logos/green-energy.png" : "/img/logos/white-energy.png"; 
		
	    $scope.toggleenergy = function() {
        	$scope.energystate = !$scope.energystate;
        	if($scope.energystate){
        		$scope.energyimg = "/img/logos/green-energy.png"; 
        		/*$scope.energyStyle = { "opacity" : "1" };*/
        	}
        	else
        	{
        		$scope.energyimg = "/img/logos/white-energy.png"; 
        		/*$scope.energyStyle = { "opacity" : "0.2" };*/
        		$scope.energyheatmapBool = false; 
        	}
    	};
    	/*$scope.energyStyle = { "opacity" : "1" };*/

    	$scope.footprintstate = true;
		$scope.footprintimg = $scope.footprintstate ? "/img/logos/green-footprint.png" : "/img/logos/white-footprint.png"; 
		
	    $scope.togglefootprint = function() {
        	$scope.footprintstate = !$scope.footprintstate;
        	if($scope.footprintstate){
        		$scope.footprintimg = "/img/logos/green-footprint.png";
        		/*$scope.footprintStyle = { "opacity" : "1" };*/
        	}
        	else
        	{
        		$scope.footprintimg = "/img/logos/white-footprint.png"; 
        		/*$scope.footprintStyle = { "opacity" : "0.2" };*/
        	}
    	};
    	/*$scope.footprintStyle = { "opacity" : "0.2" };*/

    	  $scope.dt = new Date("September 13, 2015 11:13:00");		
    	  $scope.footprint_dt = new Date("September 13, 2015 11:13:00");		
    	  $scope.monthPickerOptions = {
		    datepickerMode: 'month',
		    minMode: 'month',
		    minDate: new Date("October 1, 2012 11:13:00"),
		    maxDate: new Date("September 13, 2015 11:13:00")
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
        $scope.energyHigh = max_energy_year;

        $scope.footprintLow = min_footprint;
        $scope.footprintHigh = max_footprint_year;

        $scope.$watchGroup(['costLow','costHigh','energyLow','energyHigh','footprintLow','footprintHigh'], function(newValues,oldValues,scope) {
	        $rootScope.costLow = newValues[0]; 
	        $rootScope.costHigh = newValues[1];
	        $rootScope.energyLow = newValues[2];
	        $rootScope.energyHigh = newValues[3];
	        $rootScope.footprintLow = newValues[4];
	        $rootScope.footprintHigh = newValues[5];
	        if($rootScope.buildingsList != undefined){
		        for(var i=0; i<$rootScope.buildingsList.length;i++){ 
		        	var building = $rootScope.buildingsList[i];
		        	if(building.mesh != undefined){
			        	if($rootScope.costLow*1000000 > building.params.bCost || $rootScope.costHigh*1000000 < building.params.bCost || $rootScope.energyLow > building.params.tot_energy2014 || $rootScope.energyHigh < building.params.tot_energy2014 || $rootScope.footprintLow > building.params.tot_footprint2014 || $rootScope.footprintHigh < building.params.tot_footprint2014){
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
        $scope.footprintheatmapBool = false;
        $rootScope.footprintheatmapBool = false;
        var firstrender = true;

        $scope.$watch('heatmapBool', function() { 
        	if(!firstrender){ 
	    		$rootScope.heatmapBool = $scope.heatmapBool;
	        	if($scope.heatmapBool && $rootScope.energyheatmapBool){
	        		$scope.energyheatmapBool = false;
	        	}
	        	if($scope.heatmapBool && $rootScope.footprintheatmapBool){ //ADD
	        		$scope.footprintheatmapBool = false;
	        	}

	        	if($rootScope.buildingsList != undefined){
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i];
		        		if(!building.params.noCost){
			        		if($scope.heatmapBool){
				        		var cost = building.params.bCost; 
				        		var ratio = (cost-min_cost*1000000)/(max_cost*1000000-min_cost*1000000);
				        		var mod_ratio = Math.log(1+ratio)/Math.log(2);
				        		var bendpower = 5;
				        		for(var k=0; k<bendpower;k++){
				        			var mod_ratio = Math.log(1+mod_ratio)/Math.log(2);
				        		}
				        		var heatMaterials_index = 50-Math.floor(50*mod_ratio);
				        		if(building.mesh != undefined){
				        			building.mesh.material = $rootScope.heatMaterials[heatMaterials_index];
				        		}
			        		}
			        		else{
			        			if(building.mesh != undefined && !$scope.energyheatmapBool && !$scope.footprintheatmapBool){ //ADD
			        				building.mesh.material = $rootScope.materialBuilding;
			        			}
		        			}	
		        		}
		        		if(!$scope.heatmapBool && $scope.energyheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}		        	
	        			if(!$scope.heatmapBool && $scope.footprintheatmapBool && building.params.noEnergy && building.mesh != undefined){ //ADD
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}

		        	} 
	        	}
        	}
			firstrender = false; 
        }, true);



        $scope.$watchGroup(['energyheatmapBool','dt'], function(newValues,oldValues,scope) { 
        	if(!firstrender){
        		$scope.energyheatmapBool = newValues[0];
        		var month = newValues[1].getMonth(); 
        		var year = newValues[1].getFullYear(); 
        		var date_str = monthToStr(month,year);
	        	$rootScope.energyheatmapBool = $scope.energyheatmapBool;

	        	if($scope.energyheatmapBool && $rootScope.heatmapBool){
	        		$scope.heatmapBool = false;
	        	}	        	
	        	if($scope.energyheatmapBool && $rootScope.footprintheatmapBool){
	        		$scope.footprintheatmapBool = false;
	        	}

	        	if($rootScope.buildingsList != undefined){
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i]; 
		        		if(!building.params.noEnergy){
			        		if($scope.energyheatmapBool){ 
				        		/*var energy = building.params.tot_energy2014; */
				        		var energy = building.params.monthly_energy[date_str]; 
				        		var ratio = (energy-min_energy)/(max_energy_month-min_energy);
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
			        			if(building.mesh != undefined && !$scope.heatmapBool && !$scope.footprintheatmapBool){
			        				building.mesh.material = $rootScope.materialBuilding;
			        			}
		        			}	
		        		}
		        		if(!$scope.energyheatmapBool && $scope.heatmapBool && building.params.noCost && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}		        		
		        		if(!$scope.energyheatmapBool && $scope.footprintheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}
		        	} 
	        	}
        	} 
        	firstrender = false; 
        }, true);

        $scope.$watchGroup(['footprintheatmapBool','footprint_dt'], function(newValues,oldValues,scope) { 
        	if(!firstrender){
        		$scope.footprintheatmapBool = newValues[0];
        		var month = newValues[1].getMonth(); 
        		var year = newValues[1].getFullYear(); 
        		var date_str = monthToStr(month,year);
	        	$rootScope.footprintheatmapBool = $scope.footprintheatmapBool;

	        	if($scope.footprintheatmapBool && $rootScope.heatmapBool){
	        		$scope.heatmapBool = false;
	        	}	        	
	        	if($scope.footprintheatmapBool && $rootScope.energyheatmapBool){
	        		$scope.energyheatmapBool = false;
	        	}

	        	if($rootScope.buildingsList != undefined){
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i]; 
		        		if(!building.params.noEnergy){
			        		if($scope.footprintheatmapBool){ 
				        		/*var energy = building.params.tot_energy2014; */
				        		var footprint = building.params.monthly_footprint[date_str]; 
				        		var ratio = (footprint-min_footprint)/(max_footprint_month-min_footprint);
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
			        			if(building.mesh != undefined && !$scope.heatmapBool && !$scope.energyheatmapBool){
			        				building.mesh.material = $rootScope.materialBuilding;
			        			}
		        			}	
		        		}
		        		if(!$scope.footprintheatmapBool && $scope.heatmapBool && building.params.noCost && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}		        		
		        		if(!$scope.footprintheatmapBool && $scope.energyheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}
		        	} 
	        	}
        	} 
        	firstrender = false; 
        }, true);



        function monthToStr(num,year){
        	year = year.toString();
        	var month_arr = new Array();
			month_arr[0] = "January";
			month_arr[1] = "February";
			month_arr[2] = "March";
			month_arr[3] = "April";
			month_arr[4] = "May";
			month_arr[5] = "June";
			month_arr[6] = "July";
			month_arr[7] = "August";
			month_arr[8] = "September";
			month_arr[9] = "October";
			month_arr[10] = "November";
			month_arr[11] = "December";
			return month_arr[num].substring(0,3) + '-' + year.substring(2,4) ; 
        }

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

	$rootScope.footprintchartOptions = {
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
                text: 'Average Footprint/Day (kg CO2)',
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
            valueSuffix: 'Kg CO2'
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

