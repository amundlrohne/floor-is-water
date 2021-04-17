import * as three from 'three';
import Component from './component';
import woodImg from '../assets/WoodenPlatform.jpg';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
export class PlatformColumn extends Component {

    constructor(params) {
        super();
        this.params = params;
        if (params) {
            const loader = new FBXLoader();
            console.log(params);
            loader.load(params.rock, function (result) {
                params.scene.add(result);
                result.scale.setScalar(params.scale);
                result.rotateX(params.rotation);
                result.position.copy(params.position);
                result.traverse((c) => {
                    c.castShadow = true;
                });
            });
            // const platformGeo = new three.CylinderGeometry(params.radius, params.radius, params.height, params.segments);
            // const texture = new three.TextureLoader().load(stoneImg);
            // const platformMat = new three.MeshPhongMaterial({map: texture});
            // this.mesh = new three.Mesh(platformGeo, platformMat);
            // params.scene.add(this.mesh);
        }
    }

    UpdatePosition(p) {
        console.log(p);
        //this.mesh.position.copy(p);
    }
}
export class PlatformFloating extends Component {

    constructor(params) {
        super();
        this.params = params;
        if (params) {

            const loader = new FBXLoader();

            loader.load(params.log, function (result) {
                params.scene.add(result);
                result.scale.setScalar(params.scale);
                result.rotateX(params.rotation);
                result.position.copy(params.position);
                result.traverse((c) => {
                    c.castShadow = true;
                });
            });
            /*const platformGeo = new three.BoxGeometry(params.width, params.height, params.depth, params.segments, params.segments, params.segments);
            const texture = new three.TextureLoader().load(woodImg);
            const platformMat = new three.MeshPhongMaterial({map: texture});
            this.mesh = new three.Mesh(platformGeo, platformMat);
            params.scene.add(this.mesh);*/
        }
    }

    UpdatePosition(p) {
        console.log(p);
        //this.mesh.position.copy(p);
    }
}
