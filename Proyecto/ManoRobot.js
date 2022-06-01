
import * as THREE from '../libs/three.module.js'

class ManoRobot extends THREE.Object3D {
  constructor() {
    super();
    
    this.radioBase = 20/2;
    this.radioPiston = 4/2;
    this.radioDedo = 4/2;
    this.longitudDedo = this.radioBase*0.8;
    this.longitudExtraMano = 0;

    var geometryBase = new THREE.SphereGeometry(this.radioBase, 50, 50);
    var materialBase = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xC61616})
    var base = new THREE.Mesh(geometryBase, materialBase);
    base.position.x = this.radioBase+this.longitudExtraMano;
    
    var materialDedo = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xB0B3B7});
    
    var geometryDedo1 = new THREE.CylinderGeometry(this.radioDedo, this.radioDedo, this.longitudDedo, 30, 30);
    geometryDedo1.rotateZ(Math.PI/2);
    geometryDedo1.translate(this.radioBase + this.longitudDedo/2, 0, 0);
    geometryDedo1.rotateZ(Math.PI/4);
    var dedo1 = new THREE.Mesh(geometryDedo1, materialDedo);
    dedo1.position.x = this.radioBase+this.longitudExtraMano;
    
    var geometryDedo2 = new THREE.CylinderGeometry(this.radioDedo, this.radioDedo, this.longitudDedo, 30, 30);
    geometryDedo2.rotateZ(Math.PI/2);
    geometryDedo2.translate(this.radioBase + this.longitudDedo/2, 0, 0);
    var dedo2 = new THREE.Mesh(geometryDedo2, materialDedo);
    dedo2.position.x = this.radioBase+this.longitudExtraMano;
    
    var geometryDedo3 = new THREE.CylinderGeometry(this.radioDedo, this.radioDedo, this.longitudDedo, 30, 30);
    geometryDedo3.rotateZ(Math.PI/2);
    geometryDedo3.translate(this.radioBase + this.longitudDedo/2, 0, 0);
    geometryDedo3.rotateZ(-Math.PI/4);
    var dedo3 = new THREE.Mesh(geometryDedo3, materialDedo);
    dedo3.position.x = this.radioBase+this.longitudExtraMano;
    
    var geometryDedo4 = new THREE.CylinderGeometry(this.radioDedo, this.radioDedo, this.longitudDedo, 30, 30);
    geometryDedo4.rotateZ(Math.PI/2);
    geometryDedo4.translate(this.radioBase + this.longitudDedo/2, 0, 0);
    geometryDedo4.rotateZ(-Math.PI/2);
    var dedo4 = new THREE.Mesh(geometryDedo4, materialDedo);
    dedo4.position.x = this.radioBase+this.longitudExtraMano;

    var geometryPiston = new THREE.CylinderGeometry(this.radioPiston, this.radioPiston, this.radioBase, 30, 30);
    geometryPiston.rotateZ(Math.PI/2);
    var materialPiston = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xB0B3B7});
    var basePiston = new THREE.Mesh(geometryPiston, materialPiston);
    basePiston.scale.set((this.longitudExtraMano+this.radioBase)/this.radioBase, 1, 1);
    basePiston.position.x = (this.longitudExtraMano+this.radioBase)/2, 0, 0;

    geometryBase.computeBoundingBox();
    this.hitbox = new THREE.Box3();
    this.hitbox.copy(geometryBase.boundingBox);

    this.add(base);
    this.add(dedo1);
    this.add(dedo2);
    this.add(dedo3);
    this.add(dedo4);
    this.add(basePiston);
    
  }

  getHitbox(){
    return this.hitbox;
  }
  
  deleteGeometry(){
    for(var i=0; i<this.children.length; i++){
      this.children[i].geometry.dispose();
    }
  }
  
  deleteMaterial(){
    for(var i=0; i<this.children.length; i++){
      this.children[i].material.dispose();
    }
  }
  
  update () {
  }
}

export { ManoRobot }
