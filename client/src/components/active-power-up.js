import Component from "./component";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import pallete from "../assets/PalleteTex.png";
import * as three from "three";

import gem4 from "../assets/gem4.fbx";
import gem1 from "../assets/gem1.fbx";
import gem7 from "../assets/gem7.fbx";

export default class Powerup extends Component {
  constructor(params) {
    super();
    this.InitComponent(params);
    this.params = params;
    if (params) {
      const loader = new FBXLoader();

      switch (params.type) {
        case "speed":
          loader.load(gem1, function (result) {
            loadModel(result, params);
          });
          break;
        case "shield":
          loader.load(gem7, function (result) {
            loadModel(result, params);
          });
          break;
        case "punch":
          loader.load(gem4, function (result) {
            loadModel(result, params);
          });
          break;
      }
    }
  }
}

function loadModel(result, params) {
  result.position.copy(params.position);

  let map = new three.TextureLoader().load(pallete);
  map.encoding = three.sRGBEncoding;

  let mesh = result.children[0];
  mesh.material = new three.MeshPhongMaterial({
    map: map,
    // color: 0xff00ff,
  });

  mesh.scale.setScalar(5);
  mesh.traverse((c) => {
    c.castShadow = true;
  });

  mesh.position.copy(params.position);

  params.scene.add(mesh);
}
