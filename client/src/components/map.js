import * as three from 'three';
import Component from './component';
export default class Map extends Component {

    constructor(params) {
        super();
        this.InitComponent(params);
        if (params) {
            {//Add a plane
                const planeGeo = new three.PlaneGeometry(100, 100);
                const planeMat = new three.MeshPhongMaterial({color: '#8AC'});
                this.mesh = new three.Mesh(planeGeo, planeMat);
                this.mesh.rotation.x = Math.PI * -.5;
                params.scene.add(this.mesh);
            }
        }
    }

    SetParent(p) {
        super.SetParent(p);
        this.UpdatePosition();
    }

    UpdatePosition() {
        const position = this.Parent.Position;
        this.mesh.position.copy(position);
    }

}
