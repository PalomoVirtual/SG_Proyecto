
import * as THREE from '../libs/three.module.js'

class TorsoRobot extends THREE.Object3D {
  constructor() {
    super();
    this.longitud = 100;
    this.radio = this.longitud * 2.5/6;

    var geometry = new THREE.CylinderGeometry(this.radio, this.radio, this.longitud, 50);
    var material = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xff0000});
    var torso = new THREE.Mesh(geometry, material);

    this.add(torso);
  }
  
  getRadio(){
    return this.radio;
  }

  getLongitud(){
    return this.longitud;
  }
  
  update () {
  }
}

export { TorsoRobot }
