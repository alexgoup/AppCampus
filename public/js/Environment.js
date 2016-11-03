Environment = function(application) {
    this.application = application;
    var scene = application.scene;
    this.scene = scene;
    this.currentBlist = []; 
    this.Zlist = []; 

    this.hPlate = 0; 
    this.sZ0 = 0.25; 
    this.sV = 0.35;
    this.dx0 = -248; 
    this.dz0=-190;
    this.pixelToPos = 0.415;
    this.hscale = 2;

    var controllerElement = this.application.controllerElement; 
    this.controllerElement = controllerElement; 

    initBuildings(this);
    //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);

    var materialGround = new BABYLON.StandardMaterial("groundTexture", scene);
    materialGround.emissiveTexture = new BABYLON.Texture("/img/campus_ground_resized.png", scene);
    materialGround.emissiveTexture.uScale = 1;
    materialGround.emissiveTexture.vScale = 1;

    var ground = BABYLON.Mesh.CreateGround("campus_ground", 1024*this.pixelToPos, 843*this.pixelToPos, 2, scene);
    ground.material = materialGround;

	var materialBuilding = new BABYLON.StandardMaterial("wallTexture", this.scene);
	materialBuilding.emissiveTexture = new BABYLON.Texture("/img/wood.jpg", this.scene); 
	this.materialBuilding = materialBuilding;

    var brightmaterialBuilding = new BABYLON.StandardMaterial("wallTexture", scene); 
    brightmaterialBuilding.emissiveTexture = new BABYLON.Texture("/img/wood.jpg", scene);
    brightmaterialBuilding.emissiveTexture.level = 2;
    this.brightmaterialBuilding = brightmaterialBuilding;

    this.pointerMeshActionOPOverT = new BABYLON.ExecuteCodeAction(
	    BABYLON.ActionManager.OnPointerOverTrigger,
	    function(evt) {
	        if (evt.meshUnderPointer) { 
	            var meshClicked = evt.meshUnderPointer; 
	            var bldgClicked = meshClicked.building;
	            var scope = angular.element(controllerElement).scope(); 
		        scope.$apply(function(){
		            scope.mouseOverBuildingName = bldgClicked.name;
		        });
	            var meshesClicked = bldgClicked.mesh3DList; 
	            for(var i=0; i<meshesClicked.length; i++){
	            	meshesClicked[i].material = brightmaterialBuilding; 
	            }
	             

	        }
	    }
    );

    this.pointerMeshActionOPOutT = new BABYLON.ExecuteCodeAction(
	    BABYLON.ActionManager.OnPointerOutTrigger,
	    function(evt) {
	        if (evt.meshUnderPointer) { 
	            var meshClicked = evt.meshUnderPointer; 
	            var bldgClicked = meshClicked.building; 
	            var scope = angular.element(controllerElement).scope(); 
		        scope.$apply(function(){
		            scope.mouseOverBuildingName = "No building selected";
		        });
	            var meshesClicked = bldgClicked.mesh3DList; 
	            for(var i=0; i<meshesClicked.length; i++){
	            	meshesClicked[i].material = materialBuilding; 
	            } 

	        }
	    }
    );

    this.pointerMeshActionOPickT = new BABYLON.ExecuteCodeAction(
	    BABYLON.ActionManager.OnPickTrigger,
	    function(evt) {
	        if (evt.meshUnderPointer) { 
	            var meshClicked = evt.meshUnderPointer; 
	            var bldgClicked = meshClicked.building; 
	            var scope = angular.element(controllerElement).scope(); 
		        scope.$apply(function(){
		            scope.currentparams[0].value = bldgClicked.params.bAddress;  
		            scope.currentparams[1].value = bldgClicked.params.bArchitect;  
		            scope.currentparams[2].value = bldgClicked.params.bBuilt;  
		            scope.currentparams[3].value = bldgClicked.params.bContractor;  
		            scope.currentparams[4].value = bldgClicked.params.bCost;  
		            scope.currentparams[5].value = bldgClicked.params.bRenov;  
		            scope.currentparams[6].value = bldgClicked.params.bType;  
		            scope.currentparams[7].value = bldgClicked.params.namedAfter;  
		        });


	        }
	    }
    );



};

Environment.prototype = {

	initBuildingsList : function() { 
		
		for(var k=0; k<buildingsnamesJSON.length; k++){
		   		var bldg = buildingsnamesJSON[k]; 
		   		var bldgObj = new Building(bldg.bId,bldg.bName,bldg.bClass); 
		   		for(var j=0; j<buildingsparamsJSON.length; j++){
		   			if(buildingsparamsJSON[j].bId == bldgObj.id){
		   				bldgObj.params = buildingsparamsJSON[j]; 
		   			}
		   		}
		   		for(var j=0; j<buildingsparamsbisJSON.length; j++){
		   			if(buildingsparamsbisJSON[j].bldg == bldgObj.id){ 
		   				bldgObj.departmentList.push({ 
		   					name: buildingsparamsbisJSON[j].department, 
		   					assignedArea: buildingsparamsbisJSON[j].assignedArea, 
		   					roomSpaceCount: buildingsparamsbisJSON[j].roomSpaceCount, 
		   				});  
		   			}
		   		}
		   		this.currentBlist.push(bldgObj);
	    }

	    console.log(this.currentBlist);
		   
	   for(var j=0; j<buildingsposJSON.length; j++){
   			var mesh = buildingsposJSON[j]; 
   			var meshObj = new MeshBuilding(mesh.bId,mesh.zoneId,mesh.type,mesh.x0,mesh.y0,mesh.p1,mesh.p2,mesh.p3,mesh.p4,mesh.p5);
   			for(var k=0; k<this.currentBlist.length; k++){
   				if(this.currentBlist[k].id == meshObj.buildingID){
   					/*meshObj.building = this.currentBlist[k];*/
   					this.currentBlist[k].meshList.push(meshObj);
   					break;
   				}
   			}

   		}
   		
   		for(var k=0; k<zonesList.length; k++){
		   		var zone = zonesList[k]; 
		   		var zoneObj = new Zone(zone.zoneId,zone.x1Zone,zone.y1Zone,zone.x2Zone,zone.y2Zone,zone.sZone); 
		   		for(var i=0; i<this.currentBlist.length; i++){ 
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
						mainBox.position =  new BABYLON.Vector3(xCube+this.dx0,((1/2)*mainBox.scaling.y),zCube+this.dz0);
						if(this.zone==4){
							mainBox.position.z -= 4.5;
						}
						mainBox.rotation.y = -degToRad(p4);
						mainBox.material = this.materialBuilding;
						mainBox.actionManager = new BABYLON.ActionManager(this.scene);
						mainBox.actionManager.registerAction(this.pointerMeshActionOPOverT);
						mainBox.actionManager.registerAction(this.pointerMeshActionOPOutT);
						mainBox.actionManager.registerAction(this.pointerMeshActionOPickT);
						mainBox.building = this.currentBlist[i];
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
						mainCylinder.position =  new BABYLON.Vector3(xCyl+this.dx0,(1/2)*hCyl,zCyl+this.dz0);
						mainCylinder.material = this.materialBuilding;
						mainCylinder.actionManager = new BABYLON.ActionManager(this.scene);
						mainCylinder.actionManager.registerAction(this.pointerMeshActionOPOverT);
						mainCylinder.actionManager.registerAction(this.pointerMeshActionOPOutT);
						mainCylinder.actionManager.registerAction(this.pointerMeshActionOPickT);
						mainCylinder.building = this.currentBlist[i];
						this.currentBlist[i].mesh3DList.push(mainCylinder);
					}

				}
			}

		}
	}



};

function degToRad(deg)
{
   return (Math.PI*deg)/180
}