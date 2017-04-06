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
        $scope.isBuildingMovable = false; 
        $rootScope.isBldgClicked = false; 
        $rootScope.predictedSolar = 0; 
/*        $rootScope.$watch('currentBuiltDate', function() { 
        	console.log("currentBuiltDate rootscope has changed ")
        });   */   

        $rootScope.buildingTypeList = [
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
     	$scope.chosenBuildingType = $rootScope.buildingTypeList[0].id;  


        $rootScope.$watchGroup(['currentBuiltDate','currentRenovDate','currentMaterialBuilding'], function(newValues,oldValues,scope) {  
        	$scope.currentBuiltDate = newValues[0];
        	$scope.currentRenovDate = newValues[1];
        	$scope.currentMaterialBuilding = newValues[2]; 
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
	        $scope.chosenScenario = $rootScope.scenarioList[0];
        }



        $scope.currentScenario = $rootScope.scenarioList[0]; 
        function getRandomInt(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min)) + min;
		}

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
        	var newBldg = new Building(bldgDuplicatedId+getRandomInt(1000, 10000),$scope.createdBuildingName,bldgDuplicated.bClass,bldgDuplicated.environment); 
        	newBldg.params = angular.copy(bldgDuplicated.params); 
        	newBldg.departmentList = bldgDuplicated.departmentList; 
        	newBldg.isMovable = true; 
        	$scope.isBuildingMovable = true; 
        	var duplicatedMesh = bldgDuplicated.mesh; 
        	var newMesh = duplicatedMesh.clone($scope.createdBuildingName + "dupli"); 
        	newMesh.position.x = 0; 
        	newMesh.position.z = -128; 
        	newMesh.material = $rootScope.materialLightBlue; 
        	newMesh.building = newBldg; 

        	newBldg.mesh = newMesh; 
        	$rootScope.editableBuildingsList.push(newBldg); 
        	$rootScope.currentMovableBuilding = newBldg; 
        	$rootScope.buildingToEdit = newBldg; 
        	$rootScope.editPanelTitle = "Edit the newly created building...";
        	$rootScope.isBldgClicked = true; 
        	$scope.createdBuildingName = ""; 

        }

        $scope.deleteBuilding = function(){
        	if($rootScope.buildingToEdit == undefined){
        		alert("You did not select any building to delete"); 
        	}
        	else{
	        	for(var k=0; k<$rootScope.editableBuildingsList.length; k++){ 
        			if($rootScope.editableBuildingsList[k].id == $rootScope.buildingToEdit.id){
        			var ind = k;
        			break;
        			}
        		}
        		$rootScope.editableBuildingsList[ind].mesh.isVisible = false;  
	        	alert("Building successfully deleted");
        	}
        }

        $scope.solarPanelToggle = function(){

        }

        $rootScope.loadScenario = function() { console.log($rootScope.scenarioList);
        	for(var k=0; k<$rootScope.scenarioList.length; k++){
        		if($rootScope.scenarioList[k].name == $scope.chosenScenario){
        			var ind = k; 
        			break; 
        		}
        	}
        	$scope.currentScenario = $rootScope.scenarioList[ind]; 
        	        	console.log($scope.currentScenario.buildingsList.length); 
        	console.log($rootScope.editableBuildingsList.length); 
        	for(var k=0; k<$rootScope.editableBuildingsList.length; k++){ // loop on scene meshes to update building info.
        		var mesh = $rootScope.editableBuildingsList[k].mesh; //some of the buildings dont have meshes ie are not in the scene!
        		if(mesh != undefined){
        			var bldgIsInList = false;
        			for(var i=0; i<$scope.currentScenario.buildingsList.length;i++){
/*        				if(k==200){console.log($scope.currentScenario.buildingsList[i].id); console.log(mesh.building.id);}*/
        				if(mesh.building.id == $scope.currentScenario.buildingsList[i].id){ // update building info
        					mesh.building = $scope.currentScenario.buildingsList[i];
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

        $rootScope.deleteScenario = function() { 
        	console.log("Deleting scenario " + $rootScope.editableScenario.name + '...'); 
        };        

        $rootScope.saveNewScenario = function() { //should write the scenarios in the db
        	var copylist = [];
			for(var k=0; k<$rootScope.editableBuildingsList.length;k++){
				if($rootScope.editableBuildingsList[k].mesh != undefined && $rootScope.editableBuildingsList[k].mesh.isVisible == true){
					copylist.push(jQuery.extend(true, {}, $rootScope.editableBuildingsList[k]));
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

        $rootScope.saveCurrentScenario = function(){
        	var copylist = [];
			for(var k=0; k<$rootScope.editableBuildingsList.length;k++){
				if($rootScope.editableBuildingsList[k].mesh != undefined && $rootScope.editableBuildingsList[k].mesh.isVisible == true){
					copylist.push(jQuery.extend(true, {}, $rootScope.editableBuildingsList[k]));
				}
				
/*				if($rootScope.editableBuildingsList[k].isMovable != undefined){
					if($rootScope.editableBuildingsList[k].isMovable){
						$rootScope.editableBuildingsList[k].mesh.material = $rootScope.materialBuilding; 
						$rootScope.editableBuildingsList[k].isMovable = false; 
					}
				}*/
			}
			for(var j=0; j<$rootScope.scenarioList.length; j++){
				if($scope.currentScenario.name == $rootScope.scenarioList[j].name){
					var ind = j; 
					break; 
				}
			}
			$rootScope.scenarioList[ind] = {
				name: $scope.currentScenario.name, 
				buildingsList: copylist, 
			};

        	alert("Scenario saved!"); 
        };

        $rootScope.saveBuildingParams = function(){
        	if($rootScope.buildingToEdit == undefined){
        		alert("You did not select any building to edit"); 
        	}
        	else{
	        	for(var k=0; k<$rootScope.editableBuildingsList.length; k++){ 
        			if($rootScope.editableBuildingsList[k].id == $rootScope.buildingToEdit.id){
        			var ind = k;
        			break;
        			}
        		} 

	        	$rootScope.editableBuildingsList[ind].params.bBuilt = angular.copy($scope.currentBuiltDate);
	        	$rootScope.editableBuildingsList[ind].params.bRenov = angular.copy($scope.currentRenovDate);
	        	$rootScope.editableBuildingsList[ind].params.bType = angular.copy($scope.currentMaterialBuilding);
	        	$rootScope.editableBuildingsList[ind].mesh.building = $rootScope.editableBuildingsList[ind]; // update DISPLAYED building. IF NEW MESH PAY ATTENTION TO INDICES
	        	alert("Parameters for this building have been successfully saved");
        	}

        };

        $rootScope.saveBuildingPosition = function(){ 
        	$rootScope.currentMovableBuilding.mesh.material = $rootScope.materialBuilding; 
        	$rootScope.currentMovableBuilding.isMovable = false; 
        	$scope.isBuildingMovable = false; 
        	$rootScope.currentMovableBuilding.mesh.actionManager = new BABYLON.ActionManager($rootScope.scene);
			$rootScope.currentMovableBuilding.mesh.actionManager.registerAction($rootScope.pointerMeshActionOPOverT);
			$rootScope.currentMovableBuilding.mesh.actionManager.registerAction($rootScope.pointerMeshActionOPOutT);
			$rootScope.currentMovableBuilding.mesh.actionManager.registerAction($rootScope.pointerMeshActionOPickT);
        }
	}

);

