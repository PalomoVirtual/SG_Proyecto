
import * as THREE from '../libs/three.module.js'

class PiernaRobot extends THREE.Object3D {
  constructor() {
    super();
    this.longitudBase = 90;
    this.anchuraBase = 13;
    this.radioPie = 16/2;
    this.gradosPierna = 0;

    var geometryBase = new THREE.BoxGeometry(this.anchuraBase, this.anchuraBase, this.anchuraBase);
    geometryBase.scale(1, this.longitudBase/this.anchuraBase, 1);
    geometryBase.translate(0, -this.longitudBase/2, 0);
    var materialBase = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xB0B3B7});
    var base = new THREE.Mesh(geometryBase, materialBase);
    base.rotation.x = this.gradosPierna;

    var geometryPie = new THREE.SphereGeometry(this.radioPie, 50, 50);
    geometryPie.translate(0, -this.radioPie - this.longitudBase, 0);
    var materialPie = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xC61616});
    var pie = new THREE.Mesh(geometryPie, materialPie);
    pie.rotation.x = this.gradosPierna;

    this.add(base);
    this.add(pie);
  }
  
  
  update () {
  }
}

export { PiernaRobot }
