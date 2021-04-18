import * as three from "three";
import { Entity } from "./entity";

export default class PowerupEntity extends Entity {
  constructor(params) {
    super();
    if (params) {
      if (params.position) {
        this.SetPosition(params.position);
      }
      this.AddComponent(new Powerup(params));
    }
  }
}
