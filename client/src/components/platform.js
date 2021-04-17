import * as three from 'three';
import Component from './component';
import woodImg from '../assets/WoodenPlatform.jpg';
import stoneImg from '../assets/StonePlatform.jpg';
export class PlatformColumn extends Component {

    constructor(params) {
        super();
        this.params = params;
        if (params) {
            const platformGeo = new three.CylinderGeometry(params.radius, params.radius, params.height, params.segments);
            const texture = new three.TextureLoader().load(stoneImg);
            const platformMat = new three.MeshPhongMaterial({map: texture});
            this.mesh = new three.Mesh(platformGeo, platformMat);
            params.scene.add(this.mesh);
        }
    }

    UpdatePosition(p) {
        console.log(p);
        this.mesh.position.copy(p);
    }
}
export class PlatformFloating extends Component {

    constructor(params) {
        super();
        this.params = params;
        if (params) {
            const platformGeo = new three.BoxGeometry(params.width, params.height, params.depth, params.segments, params.segments, params.segments);
            const texture = new three.TextureLoader().load(woodImg);
            const platformMat = new three.MeshPhongMaterial({map: texture});
            this.mesh = new three.Mesh(platformGeo, platformMat);
            params.scene.add(this.mesh);
        }
    }

    UpdatePosition(p) {
        console.log(p);
        this.mesh.position.copy(p);
    }
}
