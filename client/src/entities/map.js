import {Entity} from "./entity";
import Map from "../components/map";
import PlatformEntity from "./platform";
import {Vector3} from "three";

export default class MapEntity extends Entity {
    constructor(params) {
        super()
        if (params) {
            if (params.position) {
                this.SetPosition(params.position)
            }
            this.AddComponent(new Map({scene: params.scene}));

            // Add columns
            const columnRadius = 10;
            const columnPoly = 6;
            {
                const platform = new PlatformEntity({scene: params.scene, radius: columnRadius, height: 20, segments: columnPoly, type: 'Column'})
                platform.SetPosition(new Vector3(20, 10, 0));
            }
            {
                const platform = new PlatformEntity({scene: params.scene, radius: columnRadius, height: 50, segments: columnPoly, type: 'Column'})
                platform.SetPosition(new Vector3(0, 25, -30));
            }
            {
                const platform = new PlatformEntity({scene: params.scene, radius: columnRadius, height: 40, segments: columnPoly, type: 'Column'})
                platform.SetPosition(new Vector3(-20, 20, 30));
            }
            {
                const platform = new PlatformEntity({scene: params.scene, radius: columnRadius, height: 30, segments: columnPoly, type: 'Column'})
                platform.SetPosition(new Vector3(-20, 15, -10));
            }

            // Add floaters
            {
                const platform = new PlatformEntity({scene: params.scene, height: 1, width: 15, depth: 15, segments: columnPoly, type: 'Floating'})
                platform.SetPosition(new Vector3(0, 15, 20));
            }
        }
    }
}
