import { Entity } from "./entity";
import Map from "../components/map";
import PlatformEntity from "./platform";
import WaterEntity from "./water";
import PowerupEntity from "./power-up";
import { Vector3 } from "three";
import gem4 from "../assets/gem4.fbx";

export default class MapEntity extends Entity {
  constructor(params) {
    super();
    if (params) {
      if (params.position) {
        this.SetPosition(params.position);
      }
      this.AddComponent(new Map({ scene: params.scene }));
      const platform = new PlatformEntity({
        scene: params.scene,
        radius: 5,
        height: 20,
        segments: 6,
      });
    }
  }
}
