Environment = function(application) {
    this.application = application;
    var scene = application.scene;
    this.scene = scene;
    this.currentBlist = []; 
    this.busMeshList = []; 
    this.busList = []; 
	this.shapeRoads = {
		'redRoad': [],
		'blueRoad': [],
		'greenRoad': [],
		'trolleyRoad': [],
		'nightRoad': [],
		'expressRoad': [],
		'emoryRoad': [],
	};
	this.shapeAllRoads = []; 
    this.Zlist = []; 

    this.hPlate = 0; 
    this.sZ0 = 0.25; 
    this.sV = 0.35;
    this.dx0 = -248; 
    this.dz0=-190;
    this.pixelToPos = 0.415;
    this.hscale = 2;

    this.isTilting = false;
    this.isDetilting = false;
    this.firstTimeDetilt = true;

    this.user = this.application.user;
    this.camera = this.user.camera; 


/*    console.log(geo2coord(33.7778988487049,-84.39238339662552).x/95.6571428571429);
    console.log(geo2coord(33.7778988487049,-84.39238339662552).y/34.59365079365082);
    console.log(geo2coord(33.77103253145226,-84.40280109643936).x/(-94.14117647058825));
    console.log(geo2coord(33.77103253145226,-84.40280109643936).y/(-118.52941176470588));*/

    /* Techwood and 6th
     33.7778988487049;
    -84.39240753650665;
    x=95.6571428571429;
    z=34.59365079365082*/ 

     /* Tech way building
     33.77103253145226;
    -84.40280109643936;
    x=-94.14117647058825;
    z=-118.52941176470588*/


    var _this = this;

    var imgTexture_path = "/img/wood.jpg"

    var elem = angular.element(document.querySelector('[ng-app]'));
	var injector = elem.injector(); 
 	var $rootScope = injector.get('$rootScope'); 
 	this.scope = $rootScope; 
 	this.scope.firstrender = true; 

 	scene.clearColor = new BABYLON.Color3(0, 0, 20/255);
 	/*scene.clearColor = new BABYLON.Color3(1,1,1);*/
    initBuildings(this);
    initBusesRoads(this);
    //busesPosition(this);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
	light.specular = new BABYLON.Color3(0, 0, 0);
	light.groundColor = new BABYLON.Color3(0, 0, 0);
  /*  var light = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 3000, -1000), new BABYLON.Vector3(0, -1, 0), 0.8, 2, scene);*/

    var materialGround = new BABYLON.StandardMaterial("groundTexture", scene);
   /* materialGround.emissiveTexture = new BABYLON.Texture("/img/campus_ground_resized.png", scene);*/
    materialGround.diffuseTexture = new BABYLON.Texture("/img/campus_ground_resized_fadeblue.png", scene);
/*    materialGround.emissiveTexture.uScale = 1;
    materialGround.emissiveTexture.vScale = 1;*/

    var ground = BABYLON.Mesh.CreateGround("campus_ground", 1024*this.pixelToPos, 843*this.pixelToPos, 2, scene);
    ground.material = materialGround;


	var materialBuilding = new BABYLON.StandardMaterial("wallTexture", scene);
/*	materialBuilding.emissiveTexture = new BABYLON.Texture(imgTexture_path, scene); */
	materialBuilding.diffuseColor = new BABYLON.Color3(199/255,172/255,163/255);
/*	materialBuilding.alpha = 0.9;*/
	this.materialBuilding = materialBuilding;
	this.scope.materialBuilding = materialBuilding;	

	var materialRed = new BABYLON.StandardMaterial("wallTexture", scene);
/*	materialRed.emissiveTexture = new BABYLON.Texture(imgTexture_path, scene); */
	materialRed.diffuseColor = new BABYLON.Color3(199/255,1/255,1/255);
/*	materialRed.alpha = 0.9;*/
	this.materialRed = materialRed;
	this.scope.materialRed = materialRed;

	var materialGreen = new BABYLON.StandardMaterial("wallTexture", scene);; 
	materialGreen.diffuseColor = new BABYLON.Color3(1/255,200/255,1/255);
	this.materialGreen = materialGreen;
	this.scope.materialGreen = materialGreen;	

	var materialBlue = new BABYLON.StandardMaterial("wallTexture", scene);; 
	materialBlue.diffuseColor = new BABYLON.Color3(1/255,1/255,200/255);
	this.materialBlue = materialBlue;
	this.scope.materialBlue = materialBlue;	

	var materialYellow = new BABYLON.StandardMaterial("wallTexture", scene);; 
	materialYellow.diffuseColor = new BABYLON.Color3(240/255,240/255,1/255);
	this.materialYellow = materialYellow;
	this.scope.materialYellow = materialYellow;


    var brightmaterialBuilding = new BABYLON.StandardMaterial("wallTexture", scene); 
    /*brightmaterialBuilding.emissiveTexture = new BABYLON.Texture(imgTexture_path, scene);*/
  /*  brightmaterialBuilding.diffuseColor = new BABYLON.Color3(237/255,205/255,194/255);*/
    brightmaterialBuilding.diffuseColor = new BABYLON.Color3(230/255,225/255,220/255);
 /*   brightmaterialBuilding.diffuseColor.level = 1.65;*/
    this.brightmaterialBuilding = brightmaterialBuilding;

    var brightermaterialBuilding = new BABYLON.StandardMaterial("wallTexture", scene); 
/*    brightermaterialBuilding.emissiveTexture = new BABYLON.Texture(imgTexture_path, scene);*/
    /*brightermaterialBuilding.diffuseColor = new BABYLON.Color3(240/255,225/255,221/255);*/
/*    brightermaterialBuilding.diffuseColor = new BABYLON.Color3(237/255,231/255,140/255);*/
        brightmaterialBuilding.diffuseColor = new BABYLON.Color3(230/255,225/255,220/255);
/*    brightermaterialBuilding.diffuseColor.level = 2.2;*/
    this.brightermaterialBuilding = brightermaterialBuilding;

    var heatMaterials = []; 
    for(var i=0; i< 51;i++){
    	var heatMaterial = new BABYLON.StandardMaterial("wallTexture", scene);
    	/*heatMaterial.emissiveTexture = new BABYLON.Texture(imgTexture_path, scene); */
    	var g_value = (i+1)*5;
    	/*heatMaterial.emissiveColor = new BABYLON.Color3(255/255,g_value/255,0/255);*/
    	heatMaterial.diffuseColor = new BABYLON.Color3(255/255,g_value/255,0/255);
    	heatMaterials.push(heatMaterial);
    }
    this.scope.heatMaterials = heatMaterials;

    var heatMaterials_footprint = []; 
    for(var i=0; i< 51;i++){
    	var heatMaterial = new BABYLON.StandardMaterial("wallTexture", scene);
    	/*heatMaterial.emissiveTexture = new BABYLON.Texture(imgTexture_path, scene); */
    	var r_value = (i+1)*2;
    	var b_value = (i+1)*2;
    	var g_value = (i+1)*2;
    	/*heatMaterial.emissiveColor = new BABYLON.Color3(255/255,g_value/255,0/255);*/
    	/*heatMaterial.diffuseColor = new BABYLON.Color3(0/255,g_value/255,0/255);*/
    	heatMaterial.diffuseColor = new BABYLON.Color3((102-r_value)/255,g_value/255,(102-b_value)/255);
    	heatMaterials_footprint.push(heatMaterial);
    }
    this.scope.heatMaterials_footprint = heatMaterials_footprint;

    this.currentTarget = "";

    this.pointerMeshActionOPOverT = new BABYLON.ExecuteCodeAction( // HOVER ON A MESH
	    BABYLON.ActionManager.OnPointerOverTrigger,
	    function(evt) {
	        if (evt.meshUnderPointer) { 
	            var meshClicked = evt.meshUnderPointer; 
	            if(meshClicked != ground){
	            	scene.hoverCursor = "pointer";
		            var bldgClicked = meshClicked.building;
		            if(!_this.scope.heatmapBool && !_this.scope.energyheatmapBool && !_this.scope.areaenergyheatmapBool && !_this.scope.footprintheatmapBool){
		            	meshClicked.material = brightmaterialBuilding; 
		            }
	            }
	            else{
	            	scene.hoverCursor = "default";
	        	}
            }
	    }
    );

    this.pointerMeshActionOPOutT = new BABYLON.ExecuteCodeAction( // HOVER OFF A MESH
	    BABYLON.ActionManager.OnPointerOutTrigger,
	    function(evt) {
	        if (evt.meshUnderPointer) { 
	            var meshClicked = evt.meshUnderPointer; 
	            var bldgClicked = meshClicked.building; 
	            if(!_this.scope.heatmapBool && !_this.scope.energyheatmapBool && !_this.scope.areaenergyheatmapBool && !_this.scope.footprintheatmapBool){
		        	meshClicked.material = materialBuilding;
		  		}
	        }
	    }
    );

    this.pointerMeshActionOPickT = new BABYLON.ExecuteCodeAction( //CLICK ON A MESH
	    BABYLON.ActionManager.OnPickTrigger,
	    function(evt, pickResult) {
	        if (evt.source ) { 
	        	if(_this.scope.viewmode){
		            var meshClicked = evt.source; 
		        	if (meshClicked != ground) { 
			            var bldgClicked = meshClicked.building; 
			            if(bldgClicked != _this.currentTarget){
			            	if(_this.currentTarget != ""){ 
			            		_this.currentTarget.animateState = 2; 
			            		_this.currentTarget.desanimate(); 
			            		/*_this.scene.registerBeforeRender(tiltDesanimate);*/
			            	}	
			            	bldgClicked.animateState = 1;
				            bldgClicked.animate(); 
				            _this.nextCurrentTarget = bldgClicked; 
				            _this.scene.registerAfterRender(tilt);
				            /*_this.scene.registerBeforeRender(tiltAnimate);*/
				            getMonthly(bldgClicked,false); 
					        _this.scope.$apply(function(){ 
					        	_this.scope.currentEvt = evt; 
					        	_this.scope.isBldgClicked = true;
					        	_this.scope.bldgClicked = bldgClicked; 
					        	_this.scope.mouseOverBuildingName = bldgClicked.name;  
					        	if(bldgClicked.params != undefined){ 
						            _this.scope.currentparams[0].value = bldgClicked.params.bAddress == "" ? "No information available" : bldgClicked.params.bAddress;  
						            _this.scope.currentparams[1].value = bldgClicked.params.bArchitect == "" ? "No information available" : bldgClicked.params.bArchitect;  
						            _this.scope.currentparams[2].value = bldgClicked.params.bBuilt == "" ? "No information available" : bldgClicked.params.bBuilt;  
						            _this.scope.currentparams[3].value = bldgClicked.params.bContractor == "" ? "No information available" : bldgClicked.params.bContractor;  
						            _this.scope.currentparams[4].value = bldgClicked.params.bCost == "" ? "No information available" : bldgClicked.params.bCost;  
						            _this.scope.currentparams[5].value = bldgClicked.params.bRenov == "" ? "No information available" : bldgClicked.params.bRenov;  
						            _this.scope.currentparams[6].value = bldgClicked.params.bType == "" ? "No information available" : bldgClicked.params.bType;  
						            _this.scope.currentparams[7].value = bldgClicked.params.namedAfter == "" ? "No information available" : bldgClicked.params.namedAfter; 	
					        	}
					        	else{
					        		for(var i=0; i<_this.scope.currentparams.length; i++){
					        			_this.scope.currentparams[i].value = "No information available";
					        		}
					        	}
			 
					        });
			            }

		        	}
		        	else{ 
		        		 _this.scope.$apply(function(){ 
		        		 	_this.scope.bldgClicked = ground; 
		        		 	_this.scope.isBldgClicked = false; 
	        		 	});
		        		if(_this.currentTarget != ""){ 
		        			_this.scene.registerAfterRender(detilt);
		        			_this.currentTarget.animateState = 2;
		        			_this.currentTarget.desanimate();
		        		}
		        	}
	        	}
	        	else{
		            var meshClicked = evt.source; 
		        	if (meshClicked != ground) { 
			            var bldgClicked = meshClicked.building; 
			            if(bldgClicked != _this.currentTarget){ 
			            	if(_this.currentTarget != ""){ 
			            		_this.currentTarget.animateState = 2; 
			            		_this.currentTarget.desanimate(); 
			            	}	
			            	bldgClicked.animateState = 1;
				            bldgClicked.animate(); 
				            _this.nextCurrentTarget = bldgClicked; 
					        _this.scope.$apply(function(){ 
					        	_this.scope.currentEvt = evt; 
					        	_this.scope.isBldgClicked = true;
					        	_this.scope.bldgClicked = bldgClicked; 
					        	_this.scope.mouseOverBuildingName = bldgClicked.name;  
					        	if(bldgClicked.params != undefined){ 
						            _this.scope.currentBuiltDate = bldgClicked.params.bBuilt == "" ? "No information available" : bldgClicked.params.bBuilt;  
						            _this.scope.currentRenovDate = bldgClicked.params.bRenov == "" ? "No information available" : bldgClicked.params.bRenov;  
						            _this.scope.currentMaterialBuilding = bldgClicked.params.bType == "" ? "No information available" : bldgClicked.params.bType == "Steel or Concrete" ? "Steel/Concrete" : bldgClicked.params.bType == "Wood Frame/Brick (perm)" ? "Wood Frame/Brick" : bldgClicked.params.bType == "Heavy Timber or Laminate" ? "Heavy Timber/Laminate" : bldgClicked.params.bType == "Metal Building (perm)" ? "Metal" : bldgClicked.params.bType == "Steel/Concrete" ? "Steel/Concrete" : bldgClicked.params.bType == "Wood Frame/Brick" ? "Wood Frame/Brick" : bldgClicked.params.bType == "Heavy Timber/Laminate" ? "Heavy Timber/Laminate" : bldgClicked.params.bType ==  "Metal" ? "Metal" : "Other"; 
						            _this.scope.currentMaterialIndex = bldgClicked.params.bType == "" ? undefined : bldgClicked.params.bType == "Steel or Concrete" ? 0 : bldgClicked.params.bType == "Wood Frame/Brick (perm)" ? 2 : bldgClicked.params.bType == "Heavy Timber or Laminate" ? 1 : bldgClicked.params.bType == "Metal Building (perm)" ? 3 : -1; 
						            _this.scope.editPanelTitle = "Edit the chosen building...";
        		
					        	}
					        	else{
					        			_this.scope.currentBuiltDate =  "No information available";  
							            _this.scope.currentRenovDate = "No information available";  
							            _this.scope.currentMaterialBuilding = "No information available";
					        	}
			 
					        });
			            }

		        	}
		        	else{ 
		        		 _this.scope.$apply(function(){ 
		        		 	_this.scope.editPanelTitle = "Please select a building to edit";
		        		 	_this.scope.bldgClicked = ground; 
		        		 	_this.scope.isBldgClicked = false; 
	        		 	});
		        		if(_this.currentTarget != ""){ 
		        			_this.currentTarget.animateState = 2;
		        			_this.currentTarget.desanimate();
		        		}
		        	}
	        	}




	        }
	    }
    );

    ground.actionManager = new BABYLON.ActionManager(this.scene);
	ground.actionManager.registerAction(this.pointerMeshActionOPOverT);
	ground.actionManager.registerAction(this.pointerMeshActionOPickT);

function detilt(){ 
	_this.scene.unregisterAfterRender(tilt);
    if(Math.abs(_this.camera.beta - _this.user.initBeta) > 0.01){
        if(_this.camera.beta - _this.user.initBeta < 0){
            _this.camera.beta += 0.01;
        }
        else{
            _this.camera.beta -= 0.01;
        }
        /*_this.isDetilting = true;*/
    }                    
    if(Math.abs(_this.camera.alpha - _this.user.initAlpha) > 0.01){
        if(_this.camera.alpha - _this.user.initAlpha < 0){
            _this.camera.alpha += 0.01;
        }
        else{
            _this.camera.alpha -= 0.01;
        }
       /* _this.isDetilting = true;*/
    }
    if(Math.abs(_this.camera.alpha - _this.user.initAlpha) < 0.01 && Math.abs(_this.camera.beta - _this.user.initBeta) < 0.01){
        /*__this.isDetilting = false; */
        _this.scene.unregisterAfterRender(detilt);
    } 

}

function tilt(){ 
     _this.scene.unregisterAfterRender(detilt);
    if(Math.abs(_this.camera.beta - _this.nextCurrentTarget.params.tiltingBeta) > 0.01){
        if(_this.camera.beta - _this.nextCurrentTarget.params.tiltingBeta < 0){
            _this.camera.beta += 0.005;
        }
        else{
            _this.camera.beta -= 0.005;
        }
        
        /*_this.environment.isTilting = true;*/
    }                    
    if(Math.abs(_this.camera.alpha - _this.nextCurrentTarget.params.tiltingAlpha) > 0.01){
        if(_this.camera.alpha - _this.nextCurrentTarget.params.tiltingAlpha < 0){
            _this.camera.alpha += 0.005;
        }
        else{
            _this.camera.alpha -= 0.005;
        }
       /* _this.environment.isTilting = true;*/
    }
    if(Math.abs(_this.camera.alpha - _this.nextCurrentTarget.params.tiltingAlpha) < 0.01 && Math.abs(_this.camera.beta - _this.nextCurrentTarget.params.tiltingBeta) < 0.01){
        /*_this.environment.isTilting = false; */
        _this.scene.unregisterAfterRender(tilt);
    }   
        
}

/*function coord2geo(x,y){
	var lat_ = y+centerLat;  
	var long_ = x/Math.cos(centerLat)+centerLong;  
	return {
		long : long_, 
		lat : lat_
	}
}*/



};

Environment.prototype = {

	initBuildingsList : function() { 
		
		for(var k=0; k<buildingsnamesJSON.length; k++){
		   		var bldg = buildingsnamesJSON[k]; 
		   		var bldgObj = new Building(bldg.bId,bldg.bName,bldg.bClass,this); 
		   		for(var j=0; j<buildingsparamsJSON.length; j++){
		   			if(buildingsparamsJSON[j].bId == bldgObj.id){
		   				bldgObj.params = buildingsparamsJSON[j]; 
		   			}
		   		}
		   		if(bldgObj.params == undefined) { 
		   			bldgObj.params = {bCost:1000000,noCost:true}; 
		   		}
		   		else{
		   			bldgObj.params.noCost = false; 
		   		}
		   		for(var j=0; j<buildingsparamsbisJSON.length; j++){
		   			if(buildingsparamsbisJSON[j].bldg == bldgObj.id){ 
		   				bldgObj.departmentList.push({ 
		   					name: buildingsparamsbisJSON[j].department, 
		   					assignedArea: buildingsparamsbisJSON[j].assignedArea, 
		   					roomSpaceCount: buildingsparamsbisJSON[j].roomSpaceCount, 
		   				});  
		   				if(buildingsparamsbisJSON[j].department == "TOTALS"){
		   					bldgObj.totalAssignedArea = buildingsparamsbisJSON[j].assignedArea; 
		   				}
		   			}
		   		}
		   		this.currentBlist.push(bldgObj);
	    }

		   
	   for(var j=0; j<buildingsposJSON.length; j++){
   			var mesh = buildingsposJSON[j]; 
   			var meshObj = new MeshBuilding(mesh.bId,mesh.zoneId,mesh.type,mesh.x0,mesh.y0,mesh.p1,mesh.p2,mesh.p3,mesh.p4,mesh.p5);
   			for(var k=0; k<this.currentBlist.length; k++){
   				if(this.currentBlist[k].id == meshObj.buildingID){
   					this.currentBlist[k].meshList.push(meshObj);
   					break;
   				}
   			}

   		}
   		
   		for(var k=0; k<zonesList.length; k++){
		   		var zone = zonesList[k]; 
		   		var zoneObj = new Zone(zone.zoneId,zone.x1Zone,zone.y1Zone,zone.x2Zone,zone.y2Zone,zone.sZone); 
		   		for(var i=0; i<this.currentBlist.length; i++){ 
		   			if( this.currentBlist[i].id == 160){var crc = this.currentBlist[i];}
		   			if(this.currentBlist[i].meshList.length == 0){
		   				// NO ZONE FOR THIS BUILDING
		   			}
		   			else{ 
		   				if(this.currentBlist[i].meshList[0].zoneID == zoneObj.id){
			   				this.currentBlist[i].zone = zoneObj; 
		   				}
		   			}
		   			
		   		}
	    }
   		this.drawInitMeshes(); 

	},

	initBusesRoadsList: function(){
		
		for(var k=0; k<busesshapeJSON.length; k++){
			var shapeObj = busesshapeJSON[k]; 
			var shapeLat = Number(shapeObj.shape_pt_lat);
			var shapeLong = Number(shapeObj.shape_pt_lon);
			var shapePosx = geo2coord(shapeLat,shapeLong).x; 
			var shapePosz = geo2coord(shapeLat,shapeLong).y; 
			var str_road = shapeObj.route_id + 'Road'; 
			this.shapeAllRoads.push({
				x : shapePosx, 
				z : shapePosz, 
			})
			this.shapeRoads[str_road].push({
				x : shapePosx, 
				z : shapePosz, 
			}); 



/*			var shapeDisc = BABYLON.MeshBuilder.CreateDisc("discModel", {radius:0.75}, this.scene);
			discInstance = shapeDisc.clone("shapeDisc"+k); 
			discInstance.position =  new BABYLON.Vector3(shapePosx,0,shapePosz);
			discInstance.rotation.x = Math.PI/2;
			if(shapeObj.route_id == "red"){ 
				discInstance.material = this.materialRed;
			}
			else if(shapeObj.route_id == "green"){
				discInstance.material = this.materialGreen;
			}
			else if(shapeObj.route_id == "blue"){
				discInstance.material = this.materialBlue;
			}
			else{
				discInstance.material = this.materialYellow;
			}*/
			
		} 

	},	

	busesPositionList: function(){
		var busMeshesList = []; 
		var busRectModel = BABYLON.Mesh.CreateBox("busRectModel",1,this.scene);
		busRectModel.isVisible = false; 
		busRectModel.scaling.x = 6; 
		busRectModel.scaling.y = 2; 
		busRectModel.scaling.z = 2; 
		var wheelDiameter = busRectModel.scaling.z/3; 
		busRectModel.position.y = (busRectModel.scaling.y/2 + wheelDiameter*0.6);
		busMeshesList.push(busRectModel);
		var wheelModel = BABYLON.Mesh.CreateCylinder("busWheel", busRectModel.scaling.z/8, wheelDiameter, wheelDiameter , 12, 4, this.scene);
		wheelModel.isVisible = false; 
		for(var j=1; j<5; j++){
			var wheel = wheelModel.clone("wheel"+j); 
			wheel.position.x = (j==1 || j==2) ? 1/3*busRectModel.scaling.x : -1/3*busRectModel.scaling.x;  
			wheel.position.y = (1/2)*wheelDiameter;
			wheel.position.z = (j==1 || j==3) ? 1/3*busRectModel.scaling.z : -1/3*busRectModel.scaling.z; 
			wheel.rotation.x = Math.PI/2; 
			busMeshesList.push(wheel); 
		}
		var busModel = BABYLON.Mesh.MergeMeshes(busMeshesList,true);
		this.busModel = busModel;
		busModel.isVisible = false; 
		for(var k=0; k<busespositionJSON.length; k++){
			var busObj = busespositionJSON[k]; 
			var busLat = Number(busObj.lat);
			var busLong = Number(busObj.lng);
			var busLatDir = Number(busObj.plat);
			var busLongDir = Number(busObj.plng);
			var busPosx = geo2coord(busLat,busLong).x; 
			var busPosz = geo2coord(busLat,busLong).y; 
			var busPosxDir = geo2coord(busLatDir,busLongDir).x; 
			var busPoszDir = geo2coord(busLatDir,busLongDir).y; 
			var dir_angle = Math.atan2(busPoszDir - busPosz, busPosxDir - busPosx); 
			var busMesh = busModel.clone("bus"+busObj.id); 
			var bus = new Bus(busObj.id,busObj.route,this); 
			bus.position = {
				x: busPosx, 
				z: busPosz, 
			}
			bus.angle_from_previous = dir_angle; 
			bus.allroads = this.shapeAllRoads; 
			if(busObj.route != null){
				bus.road = this.shapeRoads[busObj.route + 'Road']; 
				bus.getDirection(); 
			}
			else{
				busMesh.rotation.y = dir_angle;
			}
			busMesh.position =  new BABYLON.Vector3(busPosx,0,busPosz);
			if(busObj.route == "red"){ 
				busMesh.material = this.materialRed;
			}
			else if(busObj.route == "green"){
				busMesh.material = this.materialGreen;
			}
			else if(busObj.route == "blue"){
				busMesh.material = this.materialBlue;
			}
			else{
				busMesh.material = this.materialYellow;
			}
			if(!this.scope.transportationstate){
				busMesh.isVisible = false; 
			}
			else{
				busMesh.isVisible = true; 
			}
			if(busObj.route != null){
				busMesh.rotation.y = bus.angle; //calculated in the bus method getDirection() 
			}
			bus.mesh = busMesh; 
			this.busMeshList.push(busMesh); 
			this.busList.push(bus); 
		}
		this.scope.busesList = this.busMeshList;
		this.updatePosition(); 
	},

	updatePosition: function(){
		var _this = this; 
		if(_this.scope.transportationstate){
			pClient = new HttpClient(); 
			pClient.get('http://m.gatech.edu/api/buses/position', function(response) { 
	    		busespositionJSON = JSON && JSON.parse(response) || $.parseJSON(response); console.log(busespositionJSON.length);
				for(var k=0; k<busespositionJSON.length; k++){
					var busObj = busespositionJSON[k]; 
					var busLat = Number(busObj.lat);
					var busLong = Number(busObj.lng);
					var busLatDir = Number(busObj.plat);
					var busLongDir = Number(busObj.plng);
					var busPosx = geo2coord(busLat,busLong).x; 
					var busPosz = geo2coord(busLat,busLong).y; 
					var busPosxDir = geo2coord(busLatDir,busLongDir).x; 
					var busPoszDir = geo2coord(busLatDir,busLongDir).y; 
					var dir_angle = Math.atan2(busPoszDir - busPosz, busPosxDir - busPosx); 
					var busRoute = busObj.route; 
					var bus = _this.getBus(busObj.id,busObj.route); // create new bus object if bus not in initial list, else return bus with given id
					bus.previous_angle = bus.angle; 
					bus.previous_position = bus.position; 
					bus.position = {
						x: busPosx, 
						z: busPosz, 
					}
					bus.angle_from_previous = dir_angle; 
					if(busObj.route != null){
						bus.road = _this.shapeRoads[busObj.route + 'Road']; 
						bus.getDirection(); 
					}
					else{
						bus.mesh.rotation.y = dir_angle;
					}
					bus.mesh.position =  new BABYLON.Vector3(busPosx,0,busPosz);
					if(busObj.route != null){
						bus.mesh.rotation.y = bus.angle; //calculated in the bus method getDirection() 
					}
					_this.scene.registerAfterRender(bus.animatePosition); 
			}
		   		 
		   })
		}

		setTimeout(function(){_this.updatePosition()}, 10000); 
	},

	getBus: function(input_id,route){ 
		for(var k=0; k<this.busList.length ; k++){
			if(this.busList[k].id == input_id){
				var busReturned = this.busList[k]; 
				var busIsInList = true; 
			}
		}
		if(busIsInList){
			return busReturned; 
		}
		else{ //create new bus
			var bus = new Bus(input_id,route,this); 
			var busMesh = busModel.clone("bus"+input_id); 
			if(busObj.route == "red"){ 
				busMesh.material = this.materialRed;
			}
			else if(busObj.route == "green"){
				busMesh.material = this.materialGreen;
			}
			else if(busObj.route == "blue"){
				busMesh.material = this.materialBlue;
			}
			else{
				busMesh.material = this.materialYellow;
			}
			if(!this.scope.transportationstate){
				busMesh.isVisible = false; 
			}
			else{
				busMesh.isVisible = true; 
			}
			bus.mesh = busMesh; 
			this.busMeshList.push(busMesh);
			this.busList.push(bus); 
			return bus;
		}
	},

	drawInitMeshes: function(){



		for(var i=0; i<this.currentBlist.length; i++){ 
			if(this.currentBlist[i].zone != undefined){ 
				var zone = this.currentBlist[i].zone; 
				var szone = zone.s; 
				var x1zone = zone.x1; 
				var y1zone = zone.y1; 
				var x2zone = zone.x2; 
				var y2zone = zone.y2; 
				var name = this.currentBlist[i].name; 
				for(var k=0; k<this.currentBlist[i].meshList.length; k++){
					var meshObj = this.currentBlist[i].meshList[k];
					var p1=meshObj.p1;
					var p2=meshObj.p2;
					var p3=meshObj.p3;
					var p4=meshObj.p4;
					var p5=meshObj.p5;
					var type=meshObj.type; 
					var x=meshObj.x;
					var y=meshObj.y; 
					if(type == 1 || type ==3){ 
						var lCube = p1/szone;
						var wCube = p2/szone;
						var hCube = this.hscale*p3/szone;
						var h0Cube = p5/szone;
						var xCube = x/szone+x1zone/this.sZ0+0.5*lCube*Math.cos(degToRad(p4))-0.5*wCube*Math.sin(degToRad(p4));
						var zCube = y/szone+y1zone/this.sZ0+0.5*lCube*Math.sin(degToRad(p4))+0.5*wCube*Math.cos(degToRad(p4));
						var yCube = 0.5*hCube+this.hPlate+h0Cube;

						var mainBox = BABYLON.Mesh.CreateBox("bldg_"+i+"mesh_"+k,1,this.scene);
						mainBox.scaling.y = hCube; 
						mainBox.scaling.x = lCube; 
						mainBox.scaling.z = wCube; 

						if(this.currentBlist[i].mesh3DList.length == 0 ){
							this.currentBlist[i].savex = xCube+this.dx0;
							this.currentBlist[i].savey = ((1/2)*mainBox.scaling.y);
							this.currentBlist[i].savez = zCube+this.dz0;
							if(this.zone==4){
								this.currentBlist[i].savez -= 4.5;
							}
						}

						mainBox.position =  new BABYLON.Vector3(xCube+this.dx0,((1/2)*mainBox.scaling.y),zCube+this.dz0);
						if(this.zone==4){
							mainBox.position.z -= 4.5;
						}
						mainBox.position.x -= this.currentBlist[i].savex;
						mainBox.position.z -= this.currentBlist[i].savez;
						mainBox.rotation.y = -degToRad(p4);
						mainBox.material = this.materialBuilding;
						this.currentBlist[i].mesh3DList.push(mainBox);
					}
					else if (type == 2){
						var rTop = p1/szone;
						var rBtm = p2/szone;
						var hCyl = this.hscale*p3/this.sV;
						var h0Cube = p5/this.sV;
						var xCyl = x/szone+x1zone/this.sZ0;
						var zCyl = y/szone+y1zone/this.sZ0;
						var yCyl = 0.5*hCyl+this.hPlate+h0Cube;

						var mainCylinder = BABYLON.Mesh.CreateCylinder("bldg_"+i+"mesh_"+k, hCyl, 2*rTop, 2*rBtm, 12, 4, this.scene);
						if(this.currentBlist[i].mesh3DList.length == 0 ){
							this.currentBlist[i].savex = xCyl+this.dx0;
							this.currentBlist[i].savey = (1/2)*hCyl;
							this.currentBlist[i].savez = zCyl+this.dz0;
						}
						mainCylinder.position =  new BABYLON.Vector3(xCyl+this.dx0,(1/2)*hCyl,zCyl+this.dz0);
						mainCylinder.position.x -= this.currentBlist[i].savex;
						mainCylinder.position.z -= this.currentBlist[i].savez;
						mainCylinder.material = this.materialBuilding;
						this.currentBlist[i].mesh3DList.push(mainCylinder);
					}

				}
				var newMesh = BABYLON.Mesh.MergeMeshes(this.currentBlist[i].mesh3DList,true);
				newMesh.position.x = this.currentBlist[i].savex;
				newMesh.position.z = this.currentBlist[i].savez;
				newMesh.building = this.currentBlist[i];
				newMesh.building.inity = newMesh.position.y; 
				newMesh.building.initroty = newMesh.rotation.y;
				newMesh.actionManager = new BABYLON.ActionManager(this.scene);
				newMesh.actionManager.registerAction(this.pointerMeshActionOPOverT);
				newMesh.actionManager.registerAction(this.pointerMeshActionOPOutT);
				newMesh.actionManager.registerAction(this.pointerMeshActionOPickT);
				this.currentBlist[i].mesh = newMesh;
			}
			getMonthly(this.currentBlist[i],true); 
			this.currentBlist[i].populationModel(); 
			this.currentBlist[i].energyusageModel(); 
			this.currentBlist[i].tiltingParams(); 
		}
		var _this = this;
		var copylist = []; 
		for(var k=0; k<_this.currentBlist.length;k++){
				//copylist.push(_this.currentBlist[k].copy());
				copylist.push(jQuery.extend(true, {}, _this.currentBlist[k])) ;
		}
		_this.scope.$apply(function(){ 
			_this.scope.buildingsList = _this.currentBlist; 
			_this.scope.editableBuildingsList = copylist;
			_this.scope.scenarioList[0].buildingsList = _this.currentBlist; //initial campus
		});
		/*console.log(this.currentBlist)*/

	},





};

function degToRad(deg)
{
   return (Math.PI*deg)/180
}

function geo2coord(lat,long){
    var centerLat = degToRad(33.7762891710934); 
    var centerLong = degToRad(-84.39764186739922); 
    var geoscale = 7.95*Math.pow(10,-7); 
	lat = degToRad(lat); 
	long = degToRad(long); 
	var x_ = Math.cos(centerLat)*(long-centerLong)/geoscale; 
	var y_ = (lat-centerLat)/geoscale;
	return {
	 	x: x_,
	 	y: y_
	} 
}