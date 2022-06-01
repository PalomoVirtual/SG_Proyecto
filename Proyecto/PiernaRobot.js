
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

    geometryBase.computeBoundingBox();
    geometryPie.computeBoundingBox();
    this.hitboxBase = new THREE.Box3();
    this.hitboxBase.copy(geometryBase.boundingBox);
    this.hitboxPie = new THREE.Box3();
    this.hitboxPie.copy(geometryPie.boundingBox);
    this.hitboxBase = this.hitboxBase.union(this.hitboxPie);

    this.add(base);
    this.add(pie);
    // this.add(new THREE.Box3Helper(this.hitboxBase, 0x0000ff));
  }
  
  getHitbox(){
    return this.hitboxBase;
  }

  recalcularHitbox(){
    this.base.geometry.computeBoundingBox();
    this.pie.geometry.computeBoundingBox();
    this.hitboxBase.copy(this.base.geometry.boundingBox);
    this.hitboxPie.copy(this.pie.geometry.boundingBox);
    this.hitboxBase = this.hitboxBase.union(this.hitboxPie);
  }

  deleteGeometry(){
    this.children[0].geometry.dispose();
    this.children[1].geometry.dispose();
  }
  
  deleteMaterial(){
    this.children[0].material.dispose();
    this.children[1].material.dispose();
  }

  update () {
  }
}

export { PiernaRobot }
