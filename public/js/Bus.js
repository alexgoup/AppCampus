
function Bus(id,route,environment) {
    this.id=id;
    this.route = route; 
    this.environment = environment; 
    this.position; 
    this.previous_position; 
    this.mesh;
    this.road; 
    this.angle_from_previous; 
    this.angle; 
    this.previous_angle; 
    this.allroads;



}

Bus.prototype = {
    updatePosition: function(){

    },
    getDirection: function(){
        var minDist = 100000; 
        var secondMinDist = 110000; 
        var closerPoints = [this.allroads[0], this.allroads[1]]; 
        for(var k=0; k<this.allroads.length;k++){
            var roadPoint = this.allroads[k]; 
            var dist = Math.sqrt((roadPoint.x - this.position.x)*(roadPoint.x - this.position.x) + (roadPoint.z - this.position.z)*(roadPoint.z - this.position.z));  
            if(dist < minDist){
                minDist = dist; 
                closerPoints.splice(0,1,roadPoint); 
            } 
            if (dist < secondMinDist && dist > minDist){
                secondMinDist = dist; 
                closerPoints.splice(1,1,roadPoint); 
            }
        } 
        var angle = Math.atan2(closerPoints[0].z - closerPoints[1].z, closerPoints[0].x - closerPoints[1].x);
/*        if(Math.abs(angle + Math.PI - this.angle_from_previous) < Math.abs(angle - this.angle_from_previous)){ 
            angle = angle + Math.PI; 
        }*/
        /*if(minDist > 5){ this.angle = this.angle_from_previous;}
        else{ this.angle = angle;}*/
        this.angle = angle; 
    },

    animatePos: function(){
        var prev_x = this.previous_position.x; 
        var prev_z = this.previous_position.z; 
        var new_x = this.position.x;
        var new_z = this.position.z;
        var new_angle = this.angle; 
        var prev_angle = this.previous_angle; 
        var xrate = Math.abs(prev_x-new_x)/500; 
        var zrate = Math.abs(prev_z-new_z)/500; 
        var anglerate = Math.abs(prev_angle-new_angle)/500; 
        var xdir = (this.mesh.position.x - new_x) < 0 ? 1 : -1; 
        var zdir = (this.mesh.position.z - new_z) < 0 ? 1 : -1; 
        var angledir = (this.mesh.rotation.y - new_angle) < 0 ? 1 : -1; 
        if(Math.abs(this.mesh.position.x - new_x) > 0.001){
            this.mesh.position.x += xrate*xdir; 
        }       
        if(Math.abs(this.mesh.position.z - new_z) > 0.001){
            this.mesh.position.z += zrate*zdir; 
        }        
        if(Math.abs(this.mesh.rotation.y - new_angle) > 0.001){
            this.mesh.rotation.y += anglerate*angledir; 
        }
    if(Math.abs(this.mesh.position.x - new_x) < 0.001 && Math.abs(this.mesh.position.z - new_z) < 0.001 && Math.abs(this.mesh.rotation.y - new_angle) < 0.001){
        _this.scene.unregisterAfterRender(animatePos);
    }
  
    }
}