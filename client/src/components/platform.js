import * as three from 'three';
import Component from './component';
export default class Platform extends Component {

    constructor(params) {
        super();
        this.InitComponent(params);
        this.params = params;
        if (params) {
            const platformGeo = new three.CylinderGeometry(params.radius, params.radius, params.height, params.segments);
            const platformMat = new three.MeshPhongMaterial({color: 0x00ff00});
            this.mesh = new three.Mesh(platformGeo, platformMat);
            params.scene.add(this.mesh);
        }
    }

    SetParent(p) {
        super.SetParent(p);
        const position = this.Parent.Position;
        console.log(position.y);
        console.log(this.params.height);
        console.log(this.params.height/2);
        console.log(position.y+(this.params.height/2));
        this.mesh.position.set(position.x, position.y+(this.params.height/2), position.z);
    }
}
