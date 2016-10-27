Environment = function(application) {
    this.application = application;
    var scene = application.scene;

    //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);

    var materialGround = new BABYLON.StandardMaterial("groundTexture", scene);
    materialGround.emissiveTexture = new BABYLON.Texture("/images/campus_ground_resized.png", scene);
    materialGround.emissiveTexture.uScale = 1;
    materialGround.emissiveTexture.vScale = 1;

    var ground = BABYLON.Mesh.CreateGround("campus_ground", 15, 10, 10, scene);
    ground.material = materialGround;

};