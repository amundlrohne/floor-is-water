import { Entity } from "./entity";
import Map from "../components/map";
import PlatformEntity from "./platform";
import { Vector3 } from "three";

export default class MapEntity extends Entity {
    constructor(params) {
        super()
        if (params) {
            if (params.position) {
                this.SetPosition(params.position)
            }
            this.AddComponent(new Map({...params}));

            // Add columns
            const columnRadius = 10;
            const columnPoly = 6;
            new PlatformEntity({physicsHandler: params.physicsHandler, scene: params.scene, radius: columnRadius, height: 20, segments: columnPoly, type: 'Column', position: (new Vector3(20, 10, 0)),entitySystem:params.entitySystem})
            new PlatformEntity({physicsHandler: params.physicsHandler,scene: params.scene, radius: columnRadius, height: 50, segments: columnPoly, type: 'Column', position: (new Vector3(0, 25, -30)),entitySystem:params.entitySystem})
            new PlatformEntity({physicsHandler: params.physicsHandler,scene: params.scene, radius: columnRadius, height: 40, segments: columnPoly, type: 'Column', position: (new Vector3(-20, 20, 30)),entitySystem:params.entitySystem})
            new PlatformEntity({physicsHandler: params.physicsHandler,scene: params.scene, radius: columnRadius, height: 30, segments: columnPoly, type: 'Column', position: (new Vector3(-20, 15, -10)),entitySystem:params.entitySystem})
            new PlatformEntity({physicsHandler: params.physicsHandler,scene: params.scene, radius: columnRadius, height: 30, segments: columnPoly, type: 'Column', position: (new Vector3(-20,15, -10)),entitySystem:params.entitySystem})
            // Add floaters
            new PlatformEntity({physicsHandler: params.physicsHandler,scene: params.scene, height: 3, width: 15, depth: 15, type: 'Floating', position: (new Vector3(0, 150, 20))})
        }
    }
}
