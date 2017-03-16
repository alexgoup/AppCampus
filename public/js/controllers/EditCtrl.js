var app = angular.module('EditCtrl', []);

app.controller('EditController', 
	function($scope,$rootScope){
		console.log("starting edit ctrl"); 
		$rootScope.transportationstate = false; 
		$rootScope.viewmode = false;
		$rootScope.editPanelTitle = "Please select a building..."
		$rootScope.editableBuiltDate =  "";  
        $rootScope.editableRenovDate = "";  
        $rootScope.editableMaterialBuilding = "";
        $rootScope.matBuildingList = ["Steel/Concrete" , "Heavy Timber/Laminate" , "Wood Frame/Brick" , "Metal"]; 


/*        $rootScope.$watch('currentBuiltDate', function() { 
        	console.log("currentBuiltDate rootscope has changed ")
        });   */   

        $scope.buildingTypeList = [
        	{
        		type: "Sports Building", //CRC
        		id : 160, 
        	},
        	{
        		type: "Parking deck", //Student center parking deck
        		id : 54, 
        	},
        	{
        		type: "Stadium", //Bobby Dodd Stadium
        		id: 17, 
        	}, 
        	{
        		type: "Arena", //Mccamish pavilion
        		id: 73,
        	}, 
        	{
        		type: "Student Center", //Student center
        		id: 114, 
        	}, 
        	{
        		type: "Classroom building", //Skiles building
        		id: 2, 
        	},
        	{
        		type: "Modern Laboratory", //ASDL
        		id: 84, 
        	}, 
        	{
        		type: "Living Center", //GLC
        		id: 52, 
        	}


        ];



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

        if($rootScope.firstrender){ 
	        $rootScope.scenarioList = [ //IN THEORY SHOULD GET INITIAL SCENARIO LIST FROM THE DB, JUST THE NAMES OR ID
		        {
		        	name : "Initial Campus", 
		        	buildingsList : $rootScope.buildingsList, 
		        }
	        ]; 
	        $rootScope.firstrender = false; 
        }



        $scope.currentScenario = $rootScope.scenarioList[0]; 

        $scope.createBuilding = function(){ 
        	var bldgDuplicatedId = $scope.chosenBuildingType; 
        	for(var k=0; k<$rootScope.buildingsList.length; k++){
        		if($rootScope.buildingsList[k].id == bldgDuplicatedId){
        			var ind = k; 
        			break; 
        		}
        	}
        	var bldgDuplicated = $rootScope.buildingsList[ind]; 
        	console.log(bldgDuplicated);
        	var newBldg = new Building(bldgDuplicatedId+1000,$scope.createdBuildingName,bldgDuplicated.bClass,bldgDuplicated.environment); 
        	newBldg.params = bldgDuplicated.params; 
        	newBldg.departmentList = bldgDuplicated.departmentList; 
        	newBldg.isMovable = true; 
        	var duplicatedMesh = bldgDuplicated.mesh; 
        	var newMesh = duplicatedMesh.clone($scope.createdBuildingName + "dupli"); 
        	newMesh.position.x = 0; 
        	newMesh.position.z = -128; 
        	newMesh.material = $rootScope.materialLightBlue; 
        	newMesh.building = newBldg; 
        	newBldg.mesh = newMesh; 
        	$rootScope.editableBuildingsList.push(newBldg); 

        	$scope.createdBuildingName = ""; 

        }

        $rootScope.loadScenario = function() {
        	for(var k=0; k<$rootScope.scenarioList.length; k++){
        		if($rootScope.scenarioList[k].name == $scope.chosenScenario){
        			var ind = k; 
        			break; 
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

        $rootScope.saveScenario = function() { //should write the scenarios in the db
        	var copylist = [];
			for(var k=0; k<$rootScope.editableBuildingsList.length;k++){
				copylist.push(jQuery.extend(true, {}, $rootScope.editableBuildingsList[k])) ;
				if($rootScope.editableBuildingsList[k].isMovable != undefined){
					if($rootScope.editableBuildingsList[k].isMovable){
						$rootScope.editableBuildingsList[k].mesh.material = $rootScope.materialBuilding; 
						$rootScope.editableBuildingsList[k].isMovable = false; 
					}
				}
			}
			var scenarioNameAlreadyExists = false; 
			for(var j=0; j<$rootScope.scenarioList.length; j++){
				if($scope.saveScenarioName == $rootScope.scenarioList[j].name){
					var scenarioNameAlreadyExists = true; 
				}
			}
			if(!scenarioNameAlreadyExists){
				$rootScope.scenarioList.push({
					name: $scope.saveScenarioName, 
					buildingsList: copylist, 
				}); 
				$scope.saveScenarioName = ""; 
				$scope.currentScenario = $rootScope.scenarioList[$rootScope.scenarioList.length-1]; 
			}
			else{
				alert("This scenario name already exists in the scenario list!");
			}

        	console.log("Saving scenario " + $scope.saveScenarioName + '...'); 
        };

        $rootScope.saveBuildingParams = function(){
        	for(var k=0; k<$rootScope.editableBuildingsList.length; k++){ 
        		if($rootScope.editableBuildingsList[k].id == $rootScope.bldgClicked.id){
        			var ind = k; 
        		}
        	} 
        	$rootScope.editableBuildingsList[ind].params.bBuilt = $scope.currentBuiltDate;
        	$rootScope.editableBuildingsList[ind].params.bRenov = $scope.currentRenovDate;
        	$rootScope.editableBuildingsList[ind].params.bType = $scope.currentMaterialBuilding;
        	$rootScope.buildingsList[ind].mesh.building = $rootScope.editableBuildingsList[ind]; // update DISPLAYED building. IF NEW MESH PAY ATTENTION TO INDICES
        	alert("Parameters for this building have been successfully saved")
        }


	}

);

