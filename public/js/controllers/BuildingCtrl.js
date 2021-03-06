var app = angular.module('BuildingCtrl', ['MainService']);

app.controller('BuildingController', 
	function($scope,$rootScope){ console.log("starting bldg ctrl")
		var max_cost = 100; //Millions of dollars
		var min_cost = 0;
		var min_energy = 0;
		var min_areaenergy = 0;
		var min_footprint = 0;
		var max_energy_year = 15000; //KwH per day 
		var max_energy_month = 1500; //KwH per day 	
		var max_areaenergy_year = 2.4; //KwH/msq per day 
		var max_areaenergy_month = 0.25; //KwH/msq per day 
		var max_footprint_month = 1500*0.614; //KwH per day 
		var max_footprint_year = 9000; //KwH per day 

		$scope.showEnergyGraph = true;
		$scope.showAreaEnergyGraph = false;
		$scope.showFootprintGraph = false;

		$rootScope.isBldgClicked = false; 
	/*	$rootScope.bldgClicked = ""; */
		$rootScope.viewmode = true; 


        if($rootScope.firstrender){ 
        	console.log('bldg ctrl first rendering');
        	var scenarioGetClient = new HttpClient(); 
        	scenarioGetClient.get('/api/scenarioDB/', function(response){
        		var scenariosJSON = JSON && JSON.parse(response) || $.parseJSON(response);
		        $rootScope.scenarioList = [
			        {
			        	name : "Initial Campus", 
			        	buildingsList : $rootScope.buildingsList, 
			        }
		        ]; 
        		for(i in scenariosJSON){ // avoid doublons 
        			var scenarioData = scenariosJSON[i]; 
        			var scenarioBL = []; 
        			for(j in scenarioData.data){
        				var building = scenarioData.data[j];
        				var reconstructedBldg = $rootScope.reconstructBldgFromData(building); 
        				scenarioBL.push(reconstructedBldg); 
        			} 
        			console.log(scenarioBL);
        			var scenario = {
        				name: scenarioData.name, 
        				buildingsList: scenarioBL, 
        			}; 
        			$rootScope.scenarioList.push(scenario); 
        		}
	        	$rootScope.firstrender = false; 
	        	$rootScope.chosenScenarioViewmode = $rootScope.scenarioList[0];
	        	$rootScope.currentScenario = $rootScope.scenarioList[0]; 
	        	$rootScope.chosenScenario = $rootScope.chosenScenarioViewmode;
        	});


        }

    	if($rootScope.currentMovableBuilding != undefined && $rootScope.currentMovableBuilding.isMovable == true){ //if going to view mode but didnt save the created bldg
    		$rootScope.currentMovableBuilding.mesh.material = $rootScope.materialBuilding; 
			$rootScope.currentMovableBuilding.isMovable = false;
        	$rootScope.isBuildingMovable = false; 
        	$rootScope.currentMovableBuilding.mesh.actionManager = new BABYLON.ActionManager($rootScope.scene);
			$rootScope.currentMovableBuilding.mesh.actionManager.registerAction($rootScope.pointerMeshActionOPOverT);
			$rootScope.currentMovableBuilding.mesh.actionManager.registerAction($rootScope.pointerMeshActionOPOutT);
			$rootScope.currentMovableBuilding.mesh.actionManager.registerAction($rootScope.pointerMeshActionOPickT);
    	}

/*        $rootScope.initScenarioList = function(){

        }*/
        function getRandomInt(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min)) + min;
		}

        $rootScope.reconstructBldgFromData = function(data){ // takes json bldg obj from DB, returns building type js obj 
        // do not forget mesh visib
	        	for(var k=0; k<$rootScope.buildingsList.length; k++){
	        		var isBldgCreated = data.duplicatedID != undefined;
	        		var idtofind = data.duplicatedID == undefined ? data.bldgid : data.duplicatedID; 
	        		if($rootScope.buildingsList[k].id == idtofind){
	        			if(isBldgCreated){ 
	        				var bldgDuplicated = $rootScope.buildingsList[k];
	        				var returnedBldg = new Building(data.duplicatedID+getRandomInt(1000, 10000),data.name,bldgDuplicated.bClass,bldgDuplicated.environment); 
	        				returnedBldg.params = data.params; 
	        				returnedBldg.departmentList = bldgDuplicated.departmentList;
	        				returnedBldg.isMovable = false; 
				        	var duplicatedMesh = bldgDuplicated.mesh; 
        					var newMesh = duplicatedMesh.clone(data.name + "dupli"); 
        					newMesh.position = data.meshposition; 
        					newMesh.material = $rootScope.materialBuilding;
        					newMesh.building = returnedBldg;
        					newMesh.isVisible = false; 
        					newMesh.actionManager = new BABYLON.ActionManager($rootScope.scene);
							newMesh.actionManager.registerAction($rootScope.pointerMeshActionOPOverT);
							newMesh.actionManager.registerAction($rootScope.pointerMeshActionOPOutT);
							newMesh.actionManager.registerAction($rootScope.pointerMeshActionOPickT);
        					returnedBldg.inity = data.inity; 
        					returnedBldg.initroty = data.initroty; 
        					returnedBldg.mesh = newMesh;
        					$rootScope.editableBuildingsList.push(returnedBldg);  
        					return returnedBldg;
	        			}
	        			else{
		        			var returnedBldg = jQuery.extend(true, {}, $rootScope.buildingsList[k]);
		        			returnedBldg.params = data.params; //also change position? later
		        			return returnedBldg; 
	        			}
	        		}
	        	}

        };

		$scope.toggleEnergyGraph = function() {
			if($scope.showEnergyGraph){
				$scope.showFootprintGraph = false;
				$scope.showAreaEnergyGraph = false;
			}
		}			

		$scope.toggleAreaEnergyGraph = function() {
			if($scope.showAreaEnergyGraph){
				$scope.showFootprintGraph = false;
				$scope.showEnergyGraph = false;
			}
		}	

		$scope.toggleFootprintGraph = function() {
			if($scope.showFootprintGraph){
				$scope.showEnergyGraph = false;
				$scope.showAreaEnergyGraph = false;
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

    	$scope.populationstate = true;
		$scope.populationimg = $scope.populationstate ? "/img/logos/green-population.png" : "/img/logos/white-population.png"; 
		
	    $scope.togglepopulation = function() {
        	$scope.populationstate = !$scope.populationstate;
        	if($scope.populationstate){
        		$scope.populationimg = "/img/logos/green-population.png";
        		/*$scope.footprintStyle = { "opacity" : "1" };*/
        	}
        	else
        	{
        		$scope.populationimg = "/img/logos/white-population.png"; 
        		/*$scope.footprintStyle = { "opacity" : "0.2" };*/
        	}
    	};

    	$scope.buildingsstate = true;
		$scope.buildingsimg = $scope.buildingsstate ? "/img/logos/orange-buildings.png" : "/img/logos/white-buildings.png"; 
		
	    $scope.togglebuildings = function() {
        	$scope.buildingsstate = !$scope.buildingsstate;
        	if($scope.buildingsstate){
        		$scope.buildingsimg = "/img/logos/orange-buildings.png";
        		if($rootScope.buildingsList != undefined){
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){ 
		        		var building = $rootScope.buildingsList[i];
		        		if(building.mesh != undefined){
		        			building.mesh.isVisible = true; 
		        		}
		        	}
		        }
        	}
        	else
        	{
        		$scope.buildingsimg = "/img/logos/white-buildings.png"; 
        		if($rootScope.buildingsList != undefined){
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){ 
		        		var building = $rootScope.buildingsList[i];
		        		if(building.mesh != undefined){
		        			building.mesh.isVisible = false; 
		        		}
		        	}
		        }
        	}
    	};    	

    	$rootScope.transportationstate = false;
		$scope.transportationimg = $rootScope.transportationstate ? "/img/logos/orange-transportation.png" : "/img/logos/white-transportation.png"; 
		/*$rootScope.transportationstate = $scope.transportationstate; */
		
	    $scope.toggletransportation = function() {
        	$rootScope.transportationstate = !$rootScope.transportationstate;
    	};

    	$rootScope.$watch('transportationstate', function() {
    		$scope.transportationimg = $rootScope.transportationstate ? "/img/logos/orange-transportation.png" : "/img/logos/white-transportation.png";
			if($rootScope.busesList != undefined){
	        	for(var i=0; i<$rootScope.busesList.length;i++){ 
	        		var busMesh = $rootScope.busesList[i];
	        			busMesh.isVisible = $rootScope.transportationstate; 
	        			if(busMesh.bus.id == 408){
	        				busMesh.isVisible = false;
	        			}
	        	}
	        }
    	});     	

    	$rootScope.safetystate = false;
		$scope.safetyimg = $rootScope.safetystate ? "/img/logos/orange-safety.png" : "/img/logos/white-safety.png"; 
		/*$rootScope.safetystate = $scope.safetystate; */

		 $rootScope.loadScenarioViewmode = function() { 
        	for(var k=0; k<$rootScope.scenarioList.length; k++){
        		if($rootScope.scenarioList[k].name == $scope.chosenScenarioViewmode.name){
        			var ind = k; 
        			break; 
        		}
        	}
        	console.log(ind);
        	$rootScope.currentScenario = $rootScope.scenarioList[ind]; 

        	for(var k=0; k<$rootScope.editableBuildingsList.length; k++){ // loop on scene meshes to update building info.
        		var mesh = $rootScope.editableBuildingsList[k].mesh; //some of the buildings dont have meshes ie are not in the scene!
        		if(mesh != undefined){
        			var bldgIsInList = false;
        			for(var i=0; i<$rootScope.currentScenario.buildingsList.length;i++){
/*        				if(k==200){console.log($rootScope.currentScenario.buildingsList[i].id); console.log(mesh.building.id);}*/
        				if(mesh.building.id == $rootScope.currentScenario.buildingsList[i].id){ // update building info
        					mesh.building = $rootScope.currentScenario.buildingsList[i];
        					mesh.isVisible = true; 
        					var bldgIsInList = true; 
        					break; 
        				}
        			}
        			if(!bldgIsInList){ 
        				mesh.isVisible = false; 
        			}
        		}
        	}
        	console.log("Loading scenario " + $rootScope.scenarioList[ind].name + '...'); 
        };         
		
	    $scope.togglesafety = function() {
        	$rootScope.safetystate = !$rootScope.safetystate;
    	};

    	$rootScope.$watch('safetystate', function() {
    		$scope.safetyimg = $rootScope.safetystate ? "/img/logos/orange-safety.png" : "/img/logos/white-safety.png";
    	}); 



    	$rootScope.busClicked = ''; 
    	$scope.isBusClicked = false; 
    	$scope.busTooltipStyle = {
            'background-color': 'rgba(120,120,120,0.2)',
			 'border': '0px solid transparent',
			'border-radius': '6px',
			'width' : '15%',
			'height' : '5%',
         }; 
    	$scope.busTooltipTitle = ''; 
    	$rootScope.$watch('busClicked', function() {
			$scope.isBusClicked = ($rootScope.busClicked != ''); 
			if($scope.isBusClicked){
				var bus = $rootScope.busClicked; 
				$scope.busTooltipTitle = bus.route + " Route";
				if($rootScope.currentEvt != undefined){
					var xevt = $rootScope.currentEvt.pointerX; 
					var yevt = $rootScope.currentEvt.pointerY; 
				}
				var screenx = $(window).width();
				var screeny = $(window).height();
				var xratio = xevt/screenx;
				var yratio = yevt/screeny;
				var offsetX = 15;
				var offsetY = 15;
				var width_perc_str = (Math.floor(xratio*100)-offsetX).toString() + "%"; 
				var height_perc_str = (Math.floor(yratio*100)-offsetY).toString() + "%"; 
				$scope.busTooltipStyle.left = width_perc_str; 
				$scope.busTooltipStyle.top = height_perc_str; 
			}
    	}); 




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

        $scope.areaenergyLow = min_areaenergy;
        $scope.areaenergyHigh = max_areaenergy_year;

        $scope.footprintLow = min_footprint;
        $scope.footprintHigh = max_footprint_year;

        $scope.$watchGroup(['costLow','costHigh','energyLow','energyHigh','areaenergyLow','areaenergyHigh','footprintLow','footprintHigh'], function(newValues,oldValues,scope) {
	        $rootScope.costLow = newValues[0]; 
	        $rootScope.costHigh = newValues[1];
	        $rootScope.energyLow = newValues[2];
	        $rootScope.energyHigh = newValues[3];
	        $rootScope.areaenergyLow = newValues[4];
	        $rootScope.areaenergyHigh = newValues[5];
	        $rootScope.footprintLow = newValues[6];
	        $rootScope.footprintHigh = newValues[7];
	        if($rootScope.buildingsList != undefined){
		        for(var i=0; i<$rootScope.buildingsList.length;i++){ 
		        	var building = $rootScope.buildingsList[i];
		        	if(building.mesh != undefined){
			        	if($rootScope.costLow*1000000 > building.params.bCost || $rootScope.costHigh*1000000 < building.params.bCost || $rootScope.energyLow > building.params.tot_energy2014 || $rootScope.energyHigh < building.params.tot_energy2014 || $rootScope.areaenergyLow > building.params.tot_areaenergy2014 || $rootScope.areaenergyHigh < building.params.tot_areaenergy2014 || $rootScope.footprintLow > building.params.tot_footprint2014 || $rootScope.footprintHigh < building.params.tot_footprint2014){
			        		building.mesh.isVisible = false; 
			        		if(building.solarPanelMesh != undefined){
			        			building.solarPanelMesh.isVisible = false; 
			        		}
			        	}
			        	else{ 
			        			building.mesh.isVisible = true; 
				        		if(building.solarPanelMesh != undefined){
				        			building.solarPanelMesh.isVisible = true; 
				        		}
			        		}
			        	
		        	}

		        }
		    }
        }, true);


        $scope.heatmapBool = false;
        $rootScope.heatmapBool = false;
        $scope.energyheatmapBool = false;
        $rootScope.energyheatmapBool = false;
        $scope.areaenergyheatmapBool = false;
        $rootScope.areaenergyheatmapBool = false;
        $scope.footprintheatmapBool = false;
        $rootScope.footprintheatmapBool = false;
        var firstrender = true;
        var rankingSize = 10;

        $scope.$watch('heatmapBool', function() { 
        	if(!firstrender){ 
	    		$rootScope.heatmapBool = $scope.heatmapBool;
	    		
	        	if($scope.heatmapBool && $rootScope.energyheatmapBool){
	        		$scope.energyheatmapBool = false;
	        	}
	        	if($scope.heatmapBool && $rootScope.areaenergyheatmapBool){
	        		$scope.areaenergyheatmapBool = false;
	        	}
	        	if($scope.heatmapBool && $rootScope.footprintheatmapBool){ //ADD
	        		$scope.footprintheatmapBool = false;
	        	}

	        	if($rootScope.buildingsList != undefined){
	        		if($scope.heatmapBool){var rankedCost = [];}
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i];
		        		if(!building.params.noCost){
			        		if($scope.heatmapBool){
			        			$scope.heatmapTitle = "Construction cost";
				        		var cost = building.params.bCost; 
				        		if(i==0){rankedCost.push([building.name,cost]);}
				        		else{
				        			for(var k=0; k<rankedCost.length; k++){
				        				if(cost > rankedCost[k][1]){
				        					rankedCost.splice(k,0,[building.name,cost]);
				        					if(rankedCost.length > rankingSize){
				        						rankedCost.splice(rankingSize,1);
				        					}
				        					break;
				        				}
			        				}
			        				if(rankedCost.length < rankingSize){
			        					rankedCost.push([building.name,cost]);
			        				}
				        		}
				        		var ratio = (cost-min_cost*1000000)/(max_cost*1000000-min_cost*1000000);
				        		var mod_ratio = Math.log(1+ratio)/Math.log(2);
				        		var bendpower = 6;
				        		for(var k=0; k<bendpower;k++){
				        			var mod_ratio = Math.log(1+mod_ratio)/Math.log(2);
				        		}
				        		var heatMaterials_index = 50-Math.floor(50*mod_ratio);
				        		if(building.mesh != undefined){
				        			building.mesh.material = $rootScope.heatMaterials[heatMaterials_index];
				        		}
			        		}
			        		else{
			        			if(building.mesh != undefined && !$scope.energyheatmapBool && !$scope.areaenergyheatmapBool && !$scope.footprintheatmapBool ){ //ADD
			        				building.mesh.material = $rootScope.materialBuilding;
			        			}
		        			}	
		        		}
		        		if(!$scope.heatmapBool && $scope.energyheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}		        		
		        		if(!$scope.heatmapBool && $scope.areaenergyheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}		        	
	        			if(!$scope.heatmapBool && $scope.footprintheatmapBool && building.params.noEnergy && building.mesh != undefined){ //ADD
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}

		        	} 
		        	if($scope.heatmapBool){
			        	$scope.dataRankingChart = rankedCost; 
		        	    $scope.yAxisRankingChart = 'Cost (Millions of $)';
		        	    $scope.tooltipRankingChart = 'Construction cost: <b>{point.y:.1f} $</b>';
		        	    $scope.nameSeriesRankingChart = 'Cost';
		        	    $scope.titleRankingChart = 'Construction Cost Ranking';
	        	    	$rootScope.rankchartOptions = {
					        chart: {
					            type: 'column',
					            backgroundColor: null,
					        },
					        title: {
					            text: $scope.titleRankingChart,
				                     style: {
							             color: 'white',
							             font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
							         }
					        },
					        xAxis: {
					            type: 'category',
					            labels: {
					                rotation: -45,
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif',
					                    color:'white'
					                }
					            }
					        },
					        yAxis: {
					            min: 0,
					            title: {
					                text: $scope.yAxisRankingChart,
	                                style:{
					                	color: "white"
					                }
					            }
					        },
					        legend: {
					            enabled: false
					        },
					        tooltip: {
					            pointFormat: $scope.tooltipRankingChart,
					        },
					        credits: { 
					            enabled: false
					        },
					        series: [{
					            name: $scope.nameSeriesRankingChart,
					            data: $scope.dataRankingChart,
					            dataLabels: {
					                enabled: true,
					                rotation: -90,
					                color: '#FFFFFF',
					                align: 'right',
					                y: 10, // 10 pixels down from the top
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif'
					                }
					            }
					        }]
					    };
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
	        	if($scope.energyheatmapBool && $rootScope.areaenergyheatmapBool){
	        		$scope.areaenergyheatmapBool = false;
	        	}	        	
	        	if($scope.energyheatmapBool && $rootScope.footprintheatmapBool){
	        		$scope.footprintheatmapBool = false;
	        	}

	        	if($rootScope.buildingsList != undefined){
	        		if($scope.energyheatmapBool){ var rankedEnergy = [];}
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i]; 
		        		if(!building.params.noEnergy){
			        		if($scope.energyheatmapBool){ 
			        			$scope.heatmapTitle = "Energy consumption";
				        		/*var energy = building.params.tot_energy2014; */
				        		var energy = building.params.monthly_energy[date_str]; 
				        		if(i==0){rankedEnergy.push([building.name,energy]);}
				        		else{
				        			for(var k=0; k<rankedEnergy.length; k++){
				        				if(energy > rankedEnergy[k][1]){
				        					rankedEnergy.splice(k,0,[building.name,energy]);
				        					if(rankedEnergy.length > rankingSize){
				        						rankedEnergy.splice(rankingSize,1);
				        					}
				        					break;
				        				}
			        				}
			        				if(rankedEnergy.length < rankingSize){
			        					rankedEnergy.push([building.name,energy]);
			        				}
				        		}
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
			        			if(building.mesh != undefined && !$scope.heatmapBool && !$scope.areaenergyheatmapBool && !$scope.footprintheatmapBool){
			        				building.mesh.material = $rootScope.materialBuilding;
			        			}
		        			}	
		        		}
		        		if(!$scope.energyheatmapBool && $scope.heatmapBool && building.params.noCost && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}			        		
		        		if(!$scope.energyheatmapBool && $scope.areaenergyheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}		        		
		        		if(!$scope.energyheatmapBool && $scope.footprintheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}
		        	} 
		        	if($scope.energyheatmapBool){
		        		$scope.dataRankingChart = rankedEnergy; 
		        	    $scope.yAxisRankingChart = 'Average Energy/Day (KwH)';
		        	    $scope.tooltipRankingChart = 'Energy: <b>{point.y:.1f} KwH</b>';
		        	    $scope.nameSeriesRankingChart = 'Energy Consumption per day';
		        	    $scope.titleRankingChart = 'Energy per day consumption ranking'
	        	    	$rootScope.rankchartOptions = {
					        chart: {
					            type: 'column',
					            backgroundColor: null,
					        },
					        title: {
					            text: $scope.titleRankingChart,
				                     style: {
							             color: '#ebb027',
							             font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
							         }
					        },
					        xAxis: {
					            type: 'category',
					            labels: {
					                rotation: -45,
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif',
					                    color:'white'
					                }
					            }
					        },
					        yAxis: {
					            min: 0,
					            title: {
					                text: $scope.yAxisRankingChart,
	                                style:{
					                	color: "white"
					                }
					            }
					        },
					        legend: {
					            enabled: false
					        },
					        tooltip: {
					            pointFormat: $scope.tooltipRankingChart,
					        },
					        credits: { 
					            enabled: false
					        },
					        series: [{
					            name: $scope.nameSeriesRankingChart,
					            data: $scope.dataRankingChart,
					            dataLabels: {
					                enabled: true,
					                rotation: -90,
					                color: '#FFFFFF',
					                align: 'right',
					                y: 10, // 10 pixels down from the top
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif'
					                }
					            }
					        }]
					    };
		        	}
	        	}
        	} 
        	firstrender = false; 
        }, true);

        $scope.$watchGroup(['areaenergyheatmapBool','dt'], function(newValues,oldValues,scope) { 
        	if(!firstrender){
        		
        		$scope.areaenergyheatmapBool = newValues[0];
        		var month = newValues[1].getMonth(); 
        		var year = newValues[1].getFullYear(); 
        		var date_str = monthToStr(month,year);
	        	$rootScope.areaenergyheatmapBool = $scope.areaenergyheatmapBool;

	        	if($scope.areaenergyheatmapBool && $rootScope.heatmapBool){
	        		$scope.heatmapBool = false;
	        	}	        	
	        	if($scope.areaenergyheatmapBool && $rootScope.energyheatmapBool){
	        		$scope.energyheatmapBool = false;
	        	}	        	
	        	if($scope.areaenergyheatmapBool && $rootScope.footprintheatmapBool){
	        		$scope.footprintheatmapBool = false;
	        	}

	        	if($rootScope.buildingsList != undefined){
	        		if($scope.areaenergyheatmapBool){ var rankedAreaEnergy = [];}
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i]; 
		        		if(!building.params.noEnergy){
			        		if($scope.areaenergyheatmapBool){ 
			        			$scope.heatmapTitle = "Energy per area";
				        		/*var areaenergy = building.params.tot_areaenergy2014; */
				        		var areaenergy = building.params.monthly_areaenergy[date_str]; 
				        		if(i==0){rankedAreaEnergy.push([building.name,areaenergy]);}
				        		else{
				        			for(var k=0; k<rankedAreaEnergy.length; k++){
				        				if(areaenergy > rankedAreaEnergy[k][1]){
				        					rankedAreaEnergy.splice(k,0,[building.name,areaenergy]);
				        					if(rankedAreaEnergy.length > rankingSize){
				        						rankedAreaEnergy.splice(rankingSize,1);
				        					}
				        					break;
				        				}
			        				}
			        				if(rankedAreaEnergy.length < rankingSize){
			        					rankedAreaEnergy.push([building.name,areaenergy]);
			        				}
				        		}
				        		var ratio = (areaenergy-min_areaenergy)/(max_areaenergy_month-min_areaenergy);
				        		var mod_ratio = Math.log(1+ratio)/Math.log(2);
				        		var bendpower = 4;
				        		for(var k=0; k<bendpower;k++){
				        			var mod_ratio = Math.log(1+mod_ratio)/Math.log(2);
				        		}
				        		var heatMaterials_index = 50-Math.floor(50*mod_ratio);
				        		if(building.mesh != undefined ){
				        			building.mesh.material = $rootScope.heatMaterials[heatMaterials_index];
				        		}
			        		}
			        		else{
			        			if(building.mesh != undefined && !$scope.heatmapBool && !$scope.footprintheatmapBool && !$scope.energyheatmapBool){
			        				building.mesh.material = $rootScope.materialBuilding;
			        			}
		        			}	
		        		}
		        		if(!$scope.areaenergyheatmapBool && $scope.heatmapBool && building.params.noCost && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}		
		        		if(!$scope.areaenergyheatmapBool && $scope.energyheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}        		
		        		if(!$scope.areaenergyheatmapBool && $scope.footprintheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}
		        	} 
		        	if($scope.areaenergyheatmapBool){
		        		$scope.dataRankingChart = rankedAreaEnergy; 
		        	    $scope.yAxisRankingChart = 'Average Energy/GSF/Day (KwH/m. sq)';
		        	    $scope.tooltipRankingChart = 'Energy/GSF: <b>{point.y:.3f} KwH/m. sq</b>';
		        	    $scope.nameSeriesRankingChart = 'Energy per Gross Square Footage';
		        	    $scope.titleRankingChart = 'Energy per Gross Square Footage ranking'
	        	    	$rootScope.rankchartOptions = {
					        chart: {
					            type: 'column',
					            backgroundColor: null,
					        },
					        title: {
					            text: $scope.titleRankingChart,
				                     style: {
							             color: '#ebb027',
							             font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
							         }
					        },
					        xAxis: {
					            type: 'category',
					            labels: {
					                rotation: -45,
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif',
					                    color:'white'
					                }
					            }
					        },
					        yAxis: {
					            min: 0,
					            title: {
					                text: $scope.yAxisRankingChart,
	                                style:{
					                	color: "white"
					                }
					            }
					        },
					        legend: {
					            enabled: false
					        },
					        tooltip: {
					            pointFormat: $scope.tooltipRankingChart,
					        },
					        credits: { 
					            enabled: false
					        },
					        series: [{
					            name: $scope.nameSeriesRankingChart,
					            data: $scope.dataRankingChart,
					            dataLabels: {
					                enabled: true,
					                rotation: -90,
					                color: '#FFFFFF',
					                align: 'right',
					                y: 10, // 10 pixels down from the top
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif'
					                }
					            }
					        }]
					    };
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
	        	if($scope.footprintheatmapBool && $rootScope.areaenergyheatmapBool){
	        		$scope.areaenergyheatmapBool = false;
	        	}

	        	if($rootScope.buildingsList != undefined){
	        		if($scope.footprintheatmapBool){ var rankedFootprint = [];}
		        	for(var i=0; i<$rootScope.buildingsList.length;i++){
		        		var building = $rootScope.buildingsList[i]; 
		        		if(!building.params.noEnergy){
			        		if($scope.footprintheatmapBool){ 
			        			$scope.heatmapTitle = "Footprint";
				        		var footprint = building.params.monthly_footprint[date_str]; 
				        		if(i==0){rankedFootprint.push([building.name,footprint]);}
				        		else{
				        			for(var k=0; k<rankedFootprint.length; k++){
				        				if(footprint > rankedFootprint[k][1]){
				        					rankedFootprint.splice(k,0,[building.name,footprint]);
				        					if(rankedFootprint.length > rankingSize){
				        						rankedFootprint.splice(rankingSize,1);
				        					}
				        					break;
				        				}
			        				}
			        				if(rankedFootprint.length < rankingSize){
			        					rankedFootprint.push([building.name,footprint]);
			        				}
				        		}
				        		var ratio = (footprint-min_footprint)/(max_footprint_month-min_footprint);
				        		var mod_ratio = Math.log(1+ratio)/Math.log(2);
				        		var bendpower = 2;
				        		for(var k=0; k<bendpower;k++){
				        			var mod_ratio = Math.log(1+mod_ratio)/Math.log(2);
				        		}
				        		var heatMaterials_index = 50-Math.floor(50*mod_ratio);
				        		if(building.mesh != undefined ){
				        			building.mesh.material = $rootScope.heatMaterials_footprint[heatMaterials_index];
				        		}
			        		}
			        		else{
			        			if(building.mesh != undefined && !$scope.heatmapBool && !$scope.energyheatmapBool && !$scope.areaenergyheatmapBool){
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
		        		if(!$scope.footprintheatmapBool && $scope.areaenergyheatmapBool && building.params.noEnergy && building.mesh != undefined){
		        			building.mesh.material = $rootScope.materialBuilding;
		        		}
		        	} 
		        	if($scope.footprintheatmapBool){
		        		$scope.dataRankingChart = rankedFootprint; 
		        	    $scope.yAxisRankingChart = 'Average Footprint/Day (kg of CO2)';
		        	    $scope.tooltipRankingChart = 'Footprint: <b>{point.y:.3f} kg CO2</b>';
		        	    $scope.nameSeriesRankingChart = 'Footprint';
		        	    $scope.titleRankingChart = 'Footprint ranking'
	        	    	$rootScope.rankchartOptions = {
					        chart: {
					            type: 'column',
					            backgroundColor: null,
					        },
					        title: {
					            text: $scope.titleRankingChart,
				                     style: {
							             color: '#ebb027',
							             font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
							         }
					        },
					        xAxis: {
					            type: 'category',
					            labels: {
					                rotation: -45,
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif',
					                    color:'white'
					                }
					            }
					        },
					        yAxis: {
					            min: 0,
					            title: {
					                text: $scope.yAxisRankingChart,
	                                style:{
					                	color: "white"
					                }
					            }
					        },
					        legend: {
					            enabled: false
					        },
					        tooltip: {
					            pointFormat: $scope.tooltipRankingChart,
					        },
					        credits: { 
					            enabled: false
					        },
					        series: [{
					            name: $scope.nameSeriesRankingChart,
					            data: $scope.dataRankingChart,
					            dataLabels: {
					                enabled: true,
					                rotation: -90,
					                color: '#FFFFFF',
					                align: 'right',
					                y: 10, // 10 pixels down from the top
					                style: {
					                    fontSize: '13px',
					                    fontFamily: 'Verdana, sans-serif'
					                }
					            }
					        }]
					    };
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

		$rootScope.populationPieChartOptions = {
	        chart: {
	        	marginTop:0,
	        	backgroundColor:null,
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },
	        title: {
	            text: '<b>Population per department</b>',
	            style:{
	            	color:'rgb(204, 82, 0)',
	            	fontSize:'15',
	            }
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
	        },
	        plotOptions: {
	            pie: {
	            	size: '20%',
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                	padding:0,
	                	allowOverlap: true,
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.y}',
	                    style: {
	                    	fontSize: 10,
	                        color: 'white'
	                    }
	                }
	            }
	        },
	        credits: { 
	            enabled: false
	        },
	        series: [{
	            name: 'Departments',
	            colorByPoint: true,
	            data: []
	        }]

		}		

		$rootScope.energyusagePieChartOptions = {
	        chart: {
	        	marginTop:0,
	        	backgroundColor:null,
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },
	        title: {
	            text: '<b>Energy use breakdown</b>',
	            style:{
	            	color:'rgb(204, 82, 0)',
	            	fontSize:'15',
	            }
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
	        },
	        plotOptions: {
	            pie: {
	            	size: '20%',
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                	padding:0,
	                	allowOverlap: true,
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.y}KwH',
	                    style: {
	                    	fontSize: 10,
	                        color: 'white'
	                    }
	                }
	            }
	        },
	        credits: { 
	            enabled: false
	        },
	        series: [{
	            name: 'Usages',
	            colorByPoint: true,
	            data: []
	        }]

		}

		$rootScope.populationPieChartStyle = {
			 	'position': 'absolute',
				'top': '20%',
				'left': '45%',
				'width': '25%',
				'height': '20%',
				'margin':'0px',
				'background-color': 'rgba(0,0,0,0)',
		}		

		$rootScope.energyusagePieChartStyle = {
			 	'position': 'absolute',
				'top': '20%',
				'left': '25%',
				'width': '25%',
				'height': '20%',
				'margin':'0px',
				'background-color': 'rgba(0,0,0,0)',
		}

		$rootScope.$watch('bldgClicked', function() {
			if($rootScope.bldgClicked != undefined){
				if($rootScope.bldgClicked.params != undefined){
					if($rootScope.currentEvt != undefined){
						var xevt = $rootScope.currentEvt.pointerX; 
						var yevt = $rootScope.currentEvt.pointerY; 
					}
					var screenx = $(window).width();
					var screeny = $(window).height();
					var xratio = xevt/screenx;
					var yratio = yevt/screeny;
					var offsetX = 0;
					var offsetY = 15;
					var width_perc_str = (Math.floor(xratio*100)-offsetX).toString() + "%"; 
					var height_perc_str = (Math.floor(yratio*100)-offsetY).toString() + "%"; 
/*					$rootScope.populationPieChartStyle.left = width_perc_str; 
					$rootScope.populationPieChartStyle.top = height_perc_str; */
					$rootScope.populationPieChartOptions.series[0].data = $rootScope.bldgClicked.params.population; 
					$rootScope.energyusagePieChartOptions.series[0].data = $rootScope.bldgClicked.params.energyUsage; 
				}
			}
		});  



		$rootScope.chartOptions = {
        chart: {
            backgroundColor: null,
            
        },
        title: {
            text: 'Select a building...',
         style: {
             color: '#ebb027',
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

    $rootScope.areaenergychartOptions = {
        chart: {
            backgroundColor: null,
            
        },
        title: {
            text: 'Select a building...',
         style: {
             color: '#ebb027',
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
                text: 'Average Energy/GSF (KwH/m. sq)',
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
            valueSuffix: 'KwH/m. sq'
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
             color: '#ebb027',
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

 

	$rootScope.rankchartOptions = {
        chart: {
            type: 'column',
            backgroundColor: null,
        },
        title: {
            text: 'Ranking'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat:'',
        },
        credits: { 
            enabled: false
        },
        series: [{
            name: '',
            data: [],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    };

		

	}

);

