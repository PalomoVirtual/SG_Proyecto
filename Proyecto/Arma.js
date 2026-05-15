
import * as THREE from '/SG_Proyecto/libs/three.module.js'
import { MTLLoader } from '/SG_Proyecto/libs/MTLLoader.js'
import { OBJLoader } from '/SG_Proyecto/libs/OBJLoader.js'

class Arma extends THREE.Object3D {
  constructor() {
    super();
    
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('/SG_Proyecto/models/Proyecto/fusil/fusil.mtl',
        (materials) => {
            objectLoader.setMaterials(materials);
            objectLoader.load('/SG_Proyecto/models/Proyecto/fusil/fusil.obj',
            (object) => {
                this.add(object);
            }, null, null);
        });
  }
  
  recargar(balas){
    return balas;
  }
}

export { Arma }
