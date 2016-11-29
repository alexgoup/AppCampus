User = function(application, canvas) {

    var _this = this;

    this.application = application;

    //this.angularSensibility = 100;
    //this.speed = 1;

    // Axe de mouvement X et Z
    //this.axisMovement = [false,false,false,false];

    // On récupère le canvas de la scène 
    var canvas = this.application.scene.getEngine().getRenderingCanvas();
   
    // Initialisation de la caméra
    this._initCamera(this.application.scene, canvas); 

};


User.prototype = {
    _initCamera : function(scene, canvas) {
        // On crée la caméra
     //this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(-100, 220, -275), scene);
        this.camera = new BABYLON.ArcRotateCamera("camera", 1, 0.8, 10, new BABYLON.Vector3(0,0,0), scene);
        this.camera.setPosition(new BABYLON.Vector3(-104, 267, -319));
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.upperBetaLimit = Math.PI / 2;
        this.camera.attachControl(canvas, true);

        

    },
};