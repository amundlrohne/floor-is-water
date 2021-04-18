import * as three from "three";
import { Entity } from "./entity";
import Powerup from "../components/active-power-up";

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
