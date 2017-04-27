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
        $rootScope.chosenScenario = $scope.chosenScenario; 
        $rootScope.currentScenario = $scope.currentScenario; 
        //$rootScope.isBldgClicked = false; 
        //$rootScope.nDiesel = $rootscope.nFleet - $rootScope.nElectric; 
        $rootScope.nFleet = 10; 
        $rootScope.nElectric = 0;
        $rootScope.editFleetTitle = "Buses Editor"; 
        $rootScope.predictedSolar = 0; 
        if($rootScope.isBldgClicked){
        	$rootScope.bldgClicked.desanimate(); 
        	$rootScope.bldgClicked.animateState = 2; 
	 		$rootScope.bldgClicked = ""; 
	 		$rootScope.isBldgClicked = false; 
	 		$rootScope.BusClicked = ""; 
	 		$rootScope.isBusClicked = false; 
        }

        $rootScope.chosenScenario = $rootScope.scenarioList[0];

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

/*        if($rootScope.firstrender){ 
	        $rootScope.scenarioList = [ //IN THEORY SHOULD GET INITIAL SCENARIO LIST FROM THE DB, JUST THE NAMES OR ID
		        {
		        	name : "Initial Campus", 
		        	buildingsList : $rootScope.buildingsList, 
		        }
	        ]; 
	        $rootScope.firstrender = false; 
	        $rootScope.chosenScenario = $rootScope.scenarioList[0];
        }*/



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
        	newBldg.duplicatedID = bldgDuplicatedId;
        	$scope.isBuildingMovable = true; 
        	var duplicatedMesh = bldgDuplicated.mesh; 
        	var newMesh = duplicatedMesh.clone($scope.createdBuildingName + "dupli"); 
        	newMesh.position.x = 0; 
        	newMesh.position.z = -128; 
        	newMesh.material = $rootScope.materialLightBlue; 
        	newMesh.building = newBldg; 
			newMesh.building.inity = newMesh.position.y; 
			newMesh.building.initroty = newMesh.rotation.y;
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

        $rootScope.loadScenario = function() {
        	for(var k=0; k<$rootScope.scenarioList.length; k++){
        		if($rootScope.scenarioList[k].name == $scope.chosenScenario.name){
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
				var newScenario = {
					name: $scope.saveScenarioName, 
					buildingsList: copylist, 
				};
				$rootScope.scenarioList.push(newScenario); 
				$rootScope.currentScenario = $rootScope.scenarioList[$rootScope.scenarioList.length-1]; 

				//decircularize the struct before saving it to json 
				var datatosave = []; 
				for(var i=0; i<copylist.length; i++){
					var bldg = copylist[i];
					var bldgtosave =  {}; 
					bldgtosave.params = bldg.params; 
					bldgtosave.bldgid = bldg.id; 
					bldgtosave.inity = bldg.inity; 
					bldgtosave.initroty = bldg.initroty; 
					bldgtosave.name = bldg.name; 
					if(bldg.duplicatedID != undefined){
						bldgtosave.duplicatedID = bldg.duplicatedID;
					}
					if(bldg.mesh != undefined){
						bldgtosave.meshposition = bldg.mesh.position; 
					}
					datatosave.push(bldgtosave);
				}
				var scenarioToSave = {
						name: $scope.saveScenarioName, 
						data: datatosave, 
				};
				var scenarioJSON = angular.toJson(scenarioToSave);
				var scenarioClient = new HttpClient();
				scenarioClient.post('/api/scenarioDB/', scenarioJSON ,function(response) { 

				});

				$scope.saveScenarioName = ""; 
			}
			else{
				alert("This scenario name already exists in the scenario list!");
			}

        	
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
				if($rootScope.currentScenario.name == $rootScope.scenarioList[j].name){
					var ind = j; 
					break; 
				}
			}
			$rootScope.scenarioList[ind] = {
				name: $rootScope.currentScenario.name, 
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

