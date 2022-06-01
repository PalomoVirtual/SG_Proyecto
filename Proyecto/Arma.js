
import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

class Arma extends THREE.Object3D {
  constructor() {
    super();
    
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('../models/Proyecto/fusil/fusil.mtl',
        (materials) => {
            objectLoader.setMaterials(materials);
            objectLoader.load('../models/Proyecto/fusil/fusil.obj',
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
