import * as three from "three";
import Component from "./component";
import woodImg from "../assets/WoodenPlatform.jpg";
import stoneImg from "../assets/StonePlatform.jpg";
import column from "../assets/pillar.fbx";
import { Vector3 } from "three";
export class PlatformColumn extends Component {
    constructor(params) {
        super();
        this.params = params;
        // console.log(params)
        if (params) {
            const platformGeo = new three.CylinderGeometry(
                params.radius,
                params.radius,
                params.height,
                params.segments
            );
            const texture = new three.TextureLoader().load(stoneImg);
            const platformMat = new three.MeshPhongMaterial({ map: texture });
            this.mesh = new three.Mesh(platformGeo, platformMat);
            this.mesh.name = params.name;
            params.scene.add(this.mesh);
            params.type = "cylinder";
            params.physicsHandler.addHitbox({
                _id: this._id,
                mesh: this.mesh,
                mass: 0,
                ...params,
            });
        }
    }
}
export class PlatformFloating extends Component {
    constructor(params) {
        super();
        this.params = params;
        if (params) {
            const platformGeo = new three.BoxGeometry(
                params.width,
                params.height,
                params.depth,
                params.segments,
                params.segments,
                params.segments
            );
            const texture = new three.TextureLoader().load(woodImg);
            const platformMat = new three.MeshPhongMaterial({ map: texture });
            this.mesh = new three.Mesh(platformGeo, platformMat);
            this.mesh.name = params.name;
            params.scene.add(this.mesh);
            params.type = "cube";
            params.physicsHandler.addHitbox({
                _id: this._id,
                mesh: this.mesh,
                mass: 500000,
                ...params,
            });
        }
    }
}
