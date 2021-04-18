import * as three from "three";
import { Vector3 } from "three";
import PowerupEntity from "../entities/power-up";
import WaterEntity from "../entities/water";
import { EntitySystem } from "./entity-system";

export default class EntityManager extends EntitySystem {
  constructor(params) {
    super();
    this.params = params;
    this.entities = [];
  }

  getAllEntities() {
    return this.entities;
  }

  getPowerups() {
    return this.entities.filter((entity) => {
      return entity.type == "powerup";
    });
  }

  getWater() {
    return this.entities.filter((entity) => {
      return entity.type == "water";
    });
  }

  populatePowerups() {
    let basex = 0;
    let powerups = [];
    for (let i = 0; i < 5; i++) {
      this.entities.push({
        type: "powerup",
        entity: new PowerupEntity({
          type: "shield",
          scene: this.params.scene,
          position: new Vector3(basex, 30, 0),
        }),
      });
      basex += 20;
    }
  }

  populateWater() {
    this.entities.push({
      type: "water",
      entity: new WaterEntity({ scene: this.params.scene, height: 5 }),
    });
  }

  spawnPowerup(type, position) {
    this.entities.push({
      type: "powerup",
      entity: new PowerupEntity({
        type: type,
        scene: this.params.scene,
        position: position,
      }),
    });
  }

  removePowerup(toRemove) {
    this.entities = this.entities.filter((entity) => {
      if (entity == toRemove) {
        let removed = toRemove.entity._components.Powerup;

        removed.mesh.geometry.dispose();
        removed.mesh.material.dispose();
        this.params.scene.remove(
          this.params.scene.getObjectByProperty("uuid", removed.uuid)
        );
      }
      return entity != toRemove;
    });
  }

  updateEntities(clock, baseY) {
    for (let i = 0; i < this.entities.length; i++) {
      switch (this.entities[i].type) {
        case "water":
          this.entities[i].entity.update(clock, baseY);
          break;
        case "powerup":
          this.entities[i].entity.update(clock);
          break;
      }
    }
  }
}
