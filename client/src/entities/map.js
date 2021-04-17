import {Entity} from "./entity";
import Map from "../components/map";
import PlatformEntity from "./platform";
import {Vector3} from "three";
import rock1 from '../Assets/Pillar1.fbx'
import rock2 from '../Assets/Pillar2.fbx'
import rock3 from '../Assets/Pillar3.fbx'
import rock4 from '../Assets/Pillar4.fbx'
import log1 from '../Assets/WoodLog.fbx'

export default class MapEntity extends Entity {
    constructor(params) {
        super()
        if (params) {
            if (params.position) {
                this.SetPosition(params.position)
            }
            this.AddComponent(new Map({scene: params.scene}));

            // Add columns
            {const platform = new PlatformEntity({scene: params.scene, rock: rock1, rotation: 0, scale: 0.25, position: new Vector3(50, 0, 50), type: 'Column'})}
            {const platform = new PlatformEntity({scene: params.scene, rock: rock2, rotation: 0, scale: 0.25, position: new Vector3(30, 0, 30), type: 'Column'})}
            {const platform = new PlatformEntity({scene: params.scene, rock: rock3, rotation: 0, scale: 0.25, position: new Vector3(15, 0, 15), type: 'Column'})}
            {const platform = new PlatformEntity({scene: params.scene, rock: rock4, rotation: 0, scale: 0.25, position: new Vector3(0, 0, 0), type: 'Column'})}

            // Add floaters
            {const platform = new PlatformEntity({scene: params.scene, rock: log1, rotation: 0, scale: 0.1, position: new Vector3(20, 0, -20), type: 'Column'})
                platform.SetPosition(new Vector3(20, 10, 0));}
        }
    }
}
