
import * as THREE from '../libs/three.module.js'

class PiernaRobot extends THREE.Object3D {
  constructor() {
    super();
    this.longitudBase = 90;
    this.anchuraBase = 13;
    this.radioPie = 16/2;
    this.gradosPierna = 0;
    this.signo = 1;

    var geometryBase = new THREE.BoxGeometry(this.anchuraBase, this.anchuraBase, this.anchuraBase);
    geometryBase.scale(1, this.longitudBase/this.anchuraBase, 1);
    geometryBase.translate(0, -this.longitudBase/2, 0);
    var materialBase = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xB0B3B7});
    this.base = new THREE.Mesh(geometryBase, materialBase);
    this.base.rotation.x = this.gradosPierna;

    var geometryPie = new THREE.SphereGeometry(this.radioPie, 50, 50);
    geometryPie.translate(0, -this.radioPie - this.longitudBase, 0);
    var materialPie = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xC61616});
    this.pie = new THREE.Mesh(geometryPie, materialPie);
    this.pie.rotation.x = this.gradosPierna;

    this.add(this.base);
    this.add(this.pie);
  }

  modificaAnguloPierna(incremento){
    this.gradosPierna += incremento*this.signo;
    this.base.rotation.x = this.gradosPierna;
    this.pie.rotation.x = this.gradosPierna;
    if(this.gradosPierna > Math.PI/4){
      this.gradosPierna = Math.PI/4;
      this.base.rotation.x = this.gradosPierna;
      this.pie.rotation.x = this.gradosPierna;
      this.signo = this.signo * (-1);
    }
    else if(this.gradosPierna < -Math.PI/4){
      this.gradosPierna = -Math.PI/4;
      this.base.rotation.x = this.gradosPierna;
      this.pie.rotation.x = this.gradosPierna;
      this.signo = this.signo * (-1);
    }
  }
  
  deleteGeometry(){
    this.children[0].geometry.dispose();
    this.children[1].geometry.dispose();
  }
  
  deleteMaterial(){
    this.children[0].material.dispose();
    this.children[1].material.dispose();
  }
}

export { PiernaRobot }
