
import * as THREE from '../libs/three.module.js'
import { ManoRobot } from './ManoRobot.js';

class BrazoRobot extends THREE.Object3D {
  constructor(lado) {
    super();
    this.ladoBrazo = lado;
    this.longitudParte = 40;
    this.anchuraParte = 10;
    this.radioCodo = 11/2;
    this.gradosAbduccionAduccionHombro = 0; 
    this.gradosRotacionHombro = 0;
    this.gradosRotacionCodo = 0;

    var materialParte = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xB0B3B7});

    var geometryParte = new THREE.BoxGeometry(this.anchuraParte, this.anchuraParte, this.anchuraParte);
    geometryParte.scale(this.longitudParte/this.anchuraParte, 1, 1);
    geometryParte.translate(this.longitudParte/2, 0, 0);
    geometryParte.rotateX(this.gradosRotacionHombro);
    var parte = new THREE.Mesh(geometryParte, materialParte);
    parte.rotation.z = this.gradosAbduccionAduccionHombro;
    
    
    var geometryParteExterna = new THREE.BoxGeometry(this.anchuraParte, this.anchuraParte, this.anchuraParte);
    geometryParteExterna.scale(this.longitudParte/this.anchuraParte, 1, 1);
    geometryParteExterna.translate(this.longitudParte/2, 0, 0);
    var grados = this.gradosRotacionCodo;
    if(this.ladoBrazo == 'D'){
        grados = grados * (-1);
    }
    geometryParteExterna.rotateY(grados);
    geometryParteExterna.translate(this.longitudParte*1.5 + this.radioCodo*2 - this.longitudParte/2, 0, 0);
    geometryParteExterna.rotateX(this.gradosRotacionHombro);
    var parteExterna = new THREE.Mesh(geometryParteExterna, materialParte);
    parteExterna.rotation.z = this.gradosAbduccionAduccionHombro;
    
    var geometryCodo = new THREE.SphereGeometry(this.radioCodo, 50, 50);
    geometryCodo.translate(this.longitudParte+this.radioCodo, 0, 0);
    geometryParte.rotateX(this.gradosRotacionHombro);
    var materialCodo = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xC61616});
    var codo = new THREE.Mesh(geometryCodo, materialCodo);
    codo.rotation.z = this.gradosAbduccionAduccionHombro;

    this.mano = this.createMano();

    geometryParte.computeBoundingBox();
    geometryParteExterna.computeBoundingBox();
    geometryCodo.computeBoundingBox();
    this.hitboxParte = new THREE.Box3();
    this.hitboxParte.copy(geometryParte.boundingBox);
    this.hitboxParteExterna = new THREE.Box3();
    this.hitboxParteExterna.copy(geometryParteExterna.boundingBox);
    this.hitboxCodo = new THREE.Box3();
    this.hitboxCodo.copy(geometryCodo.boundingBox);
    this.hitboxMano = this.mano.children[0].children[0].children[0].getHitbox();
    this.hitboxParte = this.hitboxParte.union(this.hitboxParteExterna).union(this.hitboxCodo).union(this.hitboxMano);

    this.add(parte);
    this.add(parteExterna);
    this.add(codo);
    // this.add(new THREE.Box3Helper(this.hitboxParte, 0x0000ff));
  }
  
  createMano(){
    var mano = new THREE.Object3D();
    var mano2 = new THREE.Object3D();
    var mano3 = new THREE.Object3D();
    var manoReal = new ManoRobot();
    mano3.add(manoReal);
    mano2.add(mano3);
    mano.add(mano2);

    manoReal.position.x = this.longitudParte;
    var grados = this.gradosRotacionCodo;
    if(this.ladoBrazo == 'D'){
        grados = grados * (-1);
    }
    mano3.rotation.y = grados;
    mano3.position.x = this.longitudParte*2 + this.radioCodo*2 - this.longitudParte;
    mano2.rotation.x = this.gradosRotacionHombro;
    mano.rotation.z = this.gradosAbduccionAduccionHombro;
    
    this.add(mano);
    return mano;
  }

  getHitbox(){
    return this.hitboxParte;
  }
  
  deleteGeometry(){
    for(var i=1; i<this.children.length; i++){
      this.children[i].geometry.dispose();
    }
    this.mano.children[0].children[0].children[0].deleteGeometry();
  }
  
  deleteMaterial(){
    for(var i=1; i<this.children.length; i++){
      this.children[i].material.dispose();
    }
    this.mano.children[0].children[0].children[0].deleteMaterial();
  }
  
  update () {
  }
}

export { BrazoRobot }
