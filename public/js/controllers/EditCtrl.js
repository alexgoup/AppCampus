var app = angular.module('EditCtrl', []);

app.controller('EditController', 
	function($scope,$rootScope){
		console.log("starting edit ctrl"); 
		$rootScope.viewmode = false;
		$rootScope.editPanelTitle = "Please select a building..."
		$rootScope.currentBuiltDate =  "";  
        $rootScope.currentRenovDate = "";  
        $rootScope.currentMaterialBuilding = "";
        $rootScope.matBuildingList = ["Steel/Concrete" , "Heavy Timber/Laminate" , "Wood Frame/Brick" , "Metal"]; 
        $scope.$watch('currentMaterialBuilding', function() { 
        	console.log("detected");
        })

        $rootScope.scenarioList = [
        {
        	name : "Initial Campus", 
        	buildingList : $rootScope.buildingsList, 
        }
        ]; 

        $rootScope.currentScenario = $rootScope.scenarioList[0]; //baseline scenario campus

        $rootScope.loadScenario = function() { 
        	console.log("Loading scenario " + $rootScope.currentScenario.name + '...'); 
        };         

        $rootScope.deleteScenario = function() { 
        	console.log("Deleting scenario " + $rootScope.currentScenario.name + '...'); 
        };        

        $rootScope.saveScenario = function() { 
        	console.log("Saving scenario " + $rootScope.currentScenario.name + '...'); 
        };

/*        $rootScope.saveBuildingParams = function(){
        	for(var k=0; k<$rootScope.currentScenario.buildingList.length; k++){
        		if($rootScope.currentScenario.buildingList[k].id == $rootScope.bldgClicked.id){
        			var ind = k; 
        		}
        	}
        	$rootScope.currentScenario.buildingList[ind].params.bBuilt = $rootScope.currentBuiltDate;
        	console.log(ind);
        	console.log($rootScope.buildingsList);
        }*/


	}

);

