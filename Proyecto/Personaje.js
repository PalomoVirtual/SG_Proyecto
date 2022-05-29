
import * as THREE from '../libs/three.module.js'
// import { MTLLoader } from '../libs/MTLLoader.js'
// import { OBJLoader } from '../libs/OBJLoader.js'
import { GLTFLoader } from '../libs/GLTFLoader.js'

class Personaje extends THREE.Object3D {
  constructor(gui, str) {
    super();

    this.clock = new THREE.Clock();
    var loader = new GLTFLoader();
    var textureLoader = new THREE.TextureLoader()

    loader.load('../models/Proyecto/ninja/source/ninja.glb', ( gltf) => {
        var map = textureLoader.load('../models/Proyecto/ninja/textures/scabbard_Bake1_pbr_diffuse_4.png');
        map.enconding = THREE.sRGBEncoding;
        map.flipY = false;
        var model = gltf.scene;
        var mesh = model.children[0];

        mesh.children[0].material = new THREE.MeshStandardMaterial({map: map});
        map = textureLoader.load('../models/Proyecto/ninja/textures/eyelashes_eyelashes_PBR_Diffuse_7.png');
        mesh.children[1].material = new THREE.MeshStandardMaterial({map: map});
        map = textureLoader.load('../models/Proyecto/ninja/textures/eyes_eyes_PBR_Diffuse_10.png');
        mesh.children[2].material = new THREE.MeshStandardMaterial({map: map});
        map = textureLoader.load('../models/Proyecto/ninja/textures/Mask_Bake1_PBR_Diffuse_13.png');
        mesh.children[3].material = new THREE.MeshStandardMaterial({map: map});
        map = textureLoader.load('../models/Proyecto/ninja/textures/Skin_Bake1_PBR_Diffuse-Skin_Bake1_PBR_Alpha_19.png');
        mesh.children[4].material = new THREE.MeshStandardMaterial({map: map});
        map = textureLoader.load('../models/Proyecto/ninja/textures/Shoes_Bake1_PBR_Diffuse_16.png');
        mesh.children[5].material = new THREE.MeshStandardMaterial({map: map});
        map = textureLoader.load('../models/Proyecto/ninja/textures/bottoms_Bake1_PBR_Diffuse-bottoms_Bake1_PBR_Alpha_1.png');
        mesh.children[6].material = new THREE.MeshStandardMaterial({map: map});
        map = textureLoader.load('../models/Proyecto/ninja/textures/top_Bake1_PBR_Diffuse-top_Bake1_PBR_Alpha_22.png');
        mesh.children[7].material = new THREE.MeshStandardMaterial({map: map});
        
        var animations = gltf.animations;

        this.add(model);

        this.createActions(model, animations);

        this.createGUI(gui, str);

    }, undefined, (e) => {console.error(e);});
  }
  
    createActions(model, animations){
        this.mixer = new THREE.AnimationMixer(model);

        this.actions = {};
        this.clipNames = [];

        for(var i=0; i<animations.length; i++){
            var clip = animations[i];

            var action = this.mixer.clipAction(clip);

            this.actions[clip.name] = action;

            this.activeAction = action;

            this.clipNames.push(clip.name);
        }
    }

    createGUI(gui, str){
    this.guiControls = {
        current : 'Animaciones',
        repeat : false
    }

    var folder = gui.addFolder(str);
    var repeatCtrl = folder.add(this.guiControls, 'repeat').name('Repetitivo: ');
    var clipCtrl = folder.add(this.guiControls, 'current').options(this.clipNames).name('Animaciones: ');

    clipCtrl.onChange(() => {
        this.fadeToAction(this.guiControls.current, this.guiControls.repeat);
    });
    repeatCtrl.onChange(() => {
        this.fadeToAction(this.guiControls.current, this.guiControls.repeat);
    });
    }

    fadeToAction(name, repeat){
        var previousAction = this.activeAction;
        this.activeAction = this.actions[name];

        this.activeAction.reset();
        this.activeAction.crossFadeFrom(previousAction, this.activeAction.time/10);
        this.activeAction.clampWhenFinished = true;
        this.activeAction.setEffectiveWeight(1);

        if(repeat){
            this.activeAction.setLoop(THREE.LoopRepeat);
        }
        else{
            this.activeAction.setLoop(THREE.LoopOnce);
        }
        this.activeAction.play();
    }
  update () {
    var dt = this.clock.getDelta();
    if (this.mixer) this.mixer.update (dt);
  }
}

export { Personaje }
