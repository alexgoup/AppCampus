var app = angular.module('EditCtrl', []);

app.controller('EditController', 
	function($scope,$rootScope){
		console.log("starting edit ctrl"); 
		$rootScope.viewmode = false;
		$rootScope.editPanelTitle = "Please select a building..."
		$rootScope.editableBuiltDate =  "";  
        $rootScope.editableRenovDate = "";  
        $rootScope.editableMaterialBuilding = "";
        $rootScope.matBuildingList = ["Steel/Concrete" , "Heavy Timber/Laminate" , "Wood Frame/Brick" , "Metal"]; 


/*        $rootScope.$watch('currentBuiltDate', function() { 
        	console.log("currentBuiltDate rootscope has changed ")
        });   */   

        $rootScope.$watchGroup(['currentBuiltDate','currentRenovDate','currentMaterialBuilding','editPanelTitle'], function(newValues,oldValues,scope) {  
        	$scope.currentBuiltDate = newValues[0];
        	$scope.currentRenovDate = newValues[1];
        	$scope.currentMaterialBuilding = newValues[2]; console.log(newValues[2]);
        }); 

/*        $scope.$watch('currentBuiltDate', function() { 
        	console.log("currentBuiltDate scope has changed ")
        }); */
        //$scope.currentBuiltDate = $rootScope.currentBuiltDate;

        $rootScope.buildingsList;
        $rootScope.editableBuildingsList;
        $rootScope.scenarioList = [
        {
        	name : "Initial Campus", 
        	buildingsList : $rootScope.buildingsList, 
        }
        ]; 

        $scope.currentScenario = $rootScope.scenarioList[0]; 

        $rootScope.loadScenario = function() {
        	for(var k=0; k<$rootScope.scenarioList.length; k++){
        		if($rootScope.scenarioList[k].name == $scope.chosenScenario){
        			var ind = k; console.log("loaded scenario has been founded in the list!")
        		}
        	}
        	$scope.currentScenario = $rootScope.scenarioList[ind]; 
        	for(var k=0; k<$rootScope.buildingsList.length; k++){ // loop on scene meshes to update building info.
        		var mesh = $rootScope.buildingsList[k].mesh; //some of the buildings dont have meshes ie are not in the scene!
        		if(mesh != undefined){
	        		mesh.building = $scope.currentScenario.buildingsList[k]; // CHECK INDICES IF NEW MESHES CREATED  
        		}


        	}
        	console.log("Loading scenario " + $rootScope.scenarioList[ind].name + '...'); 
        };         

        $rootScope.deleteScenario = function() { 
        	console.log("Deleting scenario " + $rootScope.editableScenario.name + '...'); 
        };        

        $rootScope.saveScenario = function() { 
        	var copylist = [];
			for(var k=0; k<$rootScope.editableBuildingsList.length;k++){
				copylist.push(jQuery.extend(true, {}, $rootScope.editableBuildingsList[k])) ;
			}
			$rootScope.scenarioList.push({
				name: $scope.saveScenarioName, 
				buildingsList: copylist, 
			}); 
        	console.log("Saving scenario " + $scope.saveScenarioName + '...'); 
        };

        $rootScope.saveBuildingParams = function(){
        	for(var k=0; k<$rootScope.editableBuildingsList.length; k++){ 
        		if($rootScope.editableBuildingsList[k].id == $rootScope.bldgClicked.id){
        			var ind = k; console.log("founded")
        		}
        	} console.log(ind);
        	$rootScope.editableBuildingsList[ind].params.bBuilt = $scope.currentBuiltDate;
        	$rootScope.editableBuildingsList[ind].params.bRenov = $scope.currentRenovDate;
        	$rootScope.editableBuildingsList[ind].params.bType = $scope.currentMaterialBuilding;
        	$rootScope.buildingsList[ind].mesh.building = $rootScope.editableBuildingsList[ind]; // update DISPLAYED building. IF NEW MESH PAY ATTENTION TO INDICES
        	console.log($rootScope.buildingsList);
        	console.log($rootScope.editableBuildingsList);
        }


	}

);

