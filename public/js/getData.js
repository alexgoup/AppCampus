var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

var jsonToLoad = ['/api/buildingsnames','/api/zones','/api/buildingspos','/api/buildingsparams','/api/buildingsparamsbis','/api/buildingsfloors'];
var njson = jsonToLoad.length;
var nLoadJsonFinished = 0;
var buildingsnamesJSON,
	zonesList, 
	buildingsposJSON,
	buildingsparamsJSON,
	buildingsfloorsJSON; 

function getMonthly(building,request){ 
	if(request){
		buildingClient = new HttpClient();
		buildingClient.get('/api/buildingsmonthly/' + building.id.toString(), function(response) {
	   		buildingmonthlyJSON = JSON && JSON.parse(response) || $.parseJSON(response);
			var obj = buildingmonthlyJSON["0"]; 
			if(obj != undefined){
				building.params.monthly_energy = obj;
				building.params.tot_energy2014 = obj["Jan-14"]+obj["Feb-14"]+obj["Mar-14"]+obj["Apr-14"]+obj["May-14"]+obj["Jun-14"]+obj["Jul-14"]+obj["Aug-14"]+obj["Sep-14"]+obj["Oct-14"]+obj["Nov-14"]+obj["Dec-14"];
				building.params.noEnergy = false; 
				building.footprintModel();
			}
			else{
				building.params.tot_energy2014 = 0;
				building.params.noEnergy = true;
			}
		});
	}
	else{
			building.environment.scope.$apply(function(){ 
		if(building.params.monthly_energy != undefined){ 
			building.environment.scope.chartOptions.series = [{
	            name: '2012',
	            data: [null,null,null,null,null,null,null,null,null, building.params.monthly_energy["Oct-12"], building.params.monthly_energy["Nov-12"], building.params.monthly_energy["Dec-12"]]
	        }, {
	            name: '2013',
	            data: [building.params.monthly_energy["Jan-13"],building.params.monthly_energy["Feb-13"],building.params.monthly_energy["Mar-13"],building.params.monthly_energy["Apr-13"],building.params.monthly_energy["May-13"],building.params.monthly_energy["Jun-13"],building.params.monthly_energy["Jul-13"],building.params.monthly_energy["Aug-13"],building.params.monthly_energy["Sep-13"],building.params.monthly_energy["Oct-13"],building.params.monthly_energy["Nov-13"],building.params.monthly_energy["Dec-13"]]
	        }, {
	            name: '2014',
	            data: [building.params.monthly_energy["Jan-14"],building.params.monthly_energy["Feb-14"],building.params.monthly_energy["Mar-14"],building.params.monthly_energy["Apr-14"],building.params.monthly_energy["May-14"],building.params.monthly_energy["Jun-14"],building.params.monthly_energy["Jul-14"],building.params.monthly_energy["Aug-14"],building.params.monthly_energy["Sep-14"],building.params.monthly_energy["Oct-14"],building.params.monthly_energy["Nov-14"],building.params.monthly_energy["Dec-14"]]
	        }, {
	            name: '2015',
	            data: [building.params.monthly_energy["Jan-15"],building.params.monthly_energy["Feb-15"],building.params.monthly_energy["Mar-15"],building.params.monthly_energy["Apr-15"],building.params.monthly_energy["May-15"],building.params.monthly_energy["Jun-15"],building.params.monthly_energy["Jul-15"],building.params.monthly_energy["Aug-15"],building.params.monthly_energy["Sep-15"],building.params.monthly_energy["Oct-15"],building.params.monthly_energy["Nov-15"],building.params.monthly_energy["Dec-15"]]
	        }];
	        building.environment.scope.chartOptions.title.text = building.name + " Energy Consumption";
        }
        else{ 
        	building.environment.scope.chartOptions.title.text ="No Data Available for this building...";
        	building.environment.scope.chartOptions.series =  [{
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
	        }];

        }
		});
	}

		
	
	
}

function initBuildings(environment) { 
	bClient = new HttpClient();
	bClient.get('/api/buildingsnames', function(response) {
	   buildingsnamesJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   nLoadJsonFinished ++; 
	   if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }

	});

	cClient = new HttpClient();
	cClient.get('/api/zones', function(response) {
	   zonesList = JSON && JSON.parse(response) || $.parseJSON(response);
	   nLoadJsonFinished ++;
	   if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});

	aClient = new HttpClient();
	aClient.get('/api/buildingspos', function(response) {
    	buildingsposJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   	nLoadJsonFinished ++;
	   	if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});

	dClient = new HttpClient();
	dClient.get('/api/buildingsparams', function(response) {
    	buildingsparamsJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   	nLoadJsonFinished ++;
	   	if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});

	fClient = new HttpClient();
	fClient.get('/api/buildingsparamsbis', function(response) {
    	buildingsparamsbisJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   	nLoadJsonFinished ++;
	   	if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});

	eClient = new HttpClient();
	eClient.get('/api/buildingsfloors', function(response) {
    	buildingsfloorsJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   	nLoadJsonFinished ++;
	   	if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});





}
/*
function initBuildingsMeshes(environment){

	aClient = new HttpClient();
	aClient.get('/api/buildingspos', function(response) {
    	var buildingsposJSON = JSON && JSON.parse(response) || $.parseJSON(response);
   		for(var j=0; j<buildingsposJSON.length; j++){
   			var mesh = buildingsposJSON[j]; 
   			var meshObj = new MeshBuilding(mesh.bId,mesh.zoneId,mesh.type,mesh.x0,mesh.y0,mesh.p1,mesh.p2,mesh.p3,mesh.p4,mesh.p5);
   			for(var k=0; k<initBuildingsList.length; k++){
   				var bldgObj = initBuildingsList[k];
   				if(bldgObj.id == meshObj.buildingID){
   					bldgObj.meshList.push(meshObj);
   					break;
   				}
   			}

   		}
	   
   		environment.currentBlist = initBuildingsList; 
   		console.log(environment);
	});
}*/