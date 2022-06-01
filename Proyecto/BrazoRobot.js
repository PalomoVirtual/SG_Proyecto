
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
    this.gradosRotacionCodo = 0.8*Math.PI/2;
    this.signo = 1;

    var materialParte = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xB0B3B7});

    var geometryParte = new THREE.BoxGeometry(this.anchuraParte, this.anchuraParte, this.anchuraParte);
    geometryParte.scale(this.longitudParte/this.anchuraParte, 1, 1);
    geometryParte.translate(this.longitudParte/2, 0, 0);
    geometryParte.rotateX(this.gradosRotacionHombro);
    this.parte = new THREE.Mesh(geometryParte, materialParte);
    this.parte.rotation.z = this.gradosAbduccionAduccionHombro;
    
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
    this.parteExterna = new THREE.Mesh(geometryParteExterna, materialParte);
    this.parteExterna.rotation.z = this.gradosAbduccionAduccionHombro;
    
    var geometryCodo = new THREE.SphereGeometry(this.radioCodo, 50, 50);
    geometryCodo.translate(this.longitudParte+this.radioCodo, 0, 0);
    geometryParte.rotateX(this.gradosRotacionHombro);
    var materialCodo = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xC61616});
    this.codo = new THREE.Mesh(geometryCodo, materialCodo);
    this.codo.rotation.z = this.gradosAbduccionAduccionHombro;

    this.mano = this.createMano();

    this.add(this.parte);
    this.add(this.parteExterna);
    this.add(this.codo);
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

  modificaAnguloAbduccionAduccion(incremento){
    this.gradosAbduccionAduccionHombro += incremento*this.signo;
    this.parte.rotation.z = this.gradosAbduccionAduccionHombro;
    this.parteExterna.rotation.z = this.gradosAbduccionAduccionHombro;
    this.codo.rotation.z = this.gradosAbduccionAduccionHombro;
    this.mano.rotation.z = this.gradosAbduccionAduccionHombro;
    if(this.gradosAbduccionAduccionHombro > Math.PI/4){
      this.gradosAbduccionAduccionHombro = Math.PI/4;
      this.parte.rotation.z = this.gradosAbduccionAduccionHombro;
      this.parteExterna.rotation.z = this.gradosAbduccionAduccionHombro;
      this.codo.rotation.z = this.gradosAbduccionAduccionHombro;
      this.mano.rotation.z = this.gradosAbduccionAduccionHombro;
      this.signo = this.signo * (-1);
    }
    else if(this.gradosAbduccionAduccionHombro < -Math.PI/4){
      this.gradosAbduccionAduccionHombro = -Math.PI/4;
      this.parte.rotation.z = this.gradosAbduccionAduccionHombro;
      this.parteExterna.rotation.z = this.gradosAbduccionAduccionHombro;
      this.codo.rotation.z = this.gradosAbduccionAduccionHombro;
      this.mano.rotation.z = this.gradosAbduccionAduccionHombro;
      this.signo = this.signo * (-1);
    }
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
}

export { BrazoRobot }
