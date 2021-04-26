import * as three from "three";
import { Vector3 } from "three";
import PowerupEntity from "../entities/power-up";
import WaterEntity from "../entities/water";
import EntitySystem from "./entity-system";

export default class EntityManager extends EntitySystem {
  constructor(params) {
    super();
    this.params = params;
    this.powerup_types = ["shield", "speed", "punch", "jump"];
    // this.powerup_types = ["speed"];
    this.entities = [];
  }

  getAllEntities() {
    return this.entities;
  }

  getPowerups() {
    return this.entities.filter((entity) => {
      return entity.type === "powerup";
    });
  }

  getWater() {
    return this.entities.filter((entity) => {
      return entity.type === "water";
    });
  }

  populatePowerups() {
    // let basex = 0;
    let platforms = this.params.scene.children;
    platforms = platforms.filter((child) => {
      return child.name === "powercolumn";
    });
    for (let i = 0; i < platforms.length; i++) {
      let tempPos = new Vector3(0, 0, 0);
      tempPos.copy(platforms[i].position);
      tempPos.setY(platforms[i].geometry.parameters.height + 10);

      const type = this.powerup_types[
        Math.floor(Math.random() * this.powerup_types.length)
      ];
      this.entities.push({
        type: "powerup",
        entity: new PowerupEntity({
          power_type: type,
          scene: this.params.scene,
          position: tempPos,
          physicsHandler: this.params.physicsHandler,
        }),
      });
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
      if (entity === toRemove) {
        let removed = toRemove.entity._components.Powerup;

        removed.mesh.geometry.dispose();
        removed.mesh.material.dispose();
        this.params.scene.remove(
          this.params.scene.getObjectByProperty("uuid", removed.uuid)
        );
      }
      return entity !== toRemove;
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
