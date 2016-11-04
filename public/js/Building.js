function Building(id,name,bClass,environment) {
    this.id=id;
    this.meshList = []; 
    this.name = name; 
    this.bClass = bClass; 
    this.zone;
    this.mesh3DList = [];
    this.params;
    this.departmentList = []; 
    this.mesh; 
    this.savex;
    this.savey;
    this.savez;
    this.environment = environment;


}

Building.prototype = {
    
    animate: function(){
          var _this = this;
          var axis = new BABYLON.Vector3(0, 1, 0);
          _this.environment.scene.registerAfterRender(function () { 
                _this.mesh.rotate(axis, 0.02, BABYLON.Space.WORLD); 
                if(_this.mesh.position.y < 50 ){
                    _this.mesh.position.y +=1;
                }
          });

    }
}