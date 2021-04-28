import PowerupEntity from "../entities/power-up";
import WaterEntity from "../entities/water";

export default class EntitySystem {
  constructor(params) {
    this._ids = 0;
    this._entitiesMap = {};
    this._entities = [];
    this.params = params;
    this.powerup_types = ["shield", "speed", "punch", "jump"]
    this.entities = [];
  }

  _GenerateName() {
    this._ids += 1;

    return "__name__" + this._ids;
  }

  Get(n) {
    return this._entitiesMap[n];
  }

  Filter(cb) {
    return this._entities.filter(cb);
  }

  Add(e, n) {
    if (!n) {
      n = this._GenerateName();
    }

    this._entitiesMap[n] = e;
    this._entities.push(e);

    e.SetParent(this);
    e.SetName(n);
    e.InitEntity();
  }

  SetActive(e, b) {
    const i = this._entities.indexOf(e);

    if (!b) {
      if (i < 0) {
        return;
      }

      this._entities.splice(i, 1);
    } else {
      if (i >= 0) {
        return;
      }

      this._entities.push(e);
    }
  }

  Update(timeElapsed) {
    const dead = [];
    const alive = [];
    for (let i = 0; i < this._entities.length; ++i) {
      const e = this._entities[i];

      e.Update(timeElapsed);

      if (e.dead_) {
        dead.push(e);
      } else {
        alive.push(e);
      }
    }

    for (let i = 0; i < dead.length; ++i) {
      const e = dead[i];

      delete this._entitiesMap[e.Name];

      e.Destroy();
    }

    this._entities = alive;
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


    if (this.getPowerups().length < 5) {
      for (let i = 0; i < platforms.length; i++) {
        let tempPos = platforms[i].position;
        tempPos.y = platforms[i].geometry.parameters.height + 5;
        const type = this.powerup_types[Math.floor(Math.random()*this.powerup_types.length)]
        this.entities.push({
          type: "powerup",
          entity: new PowerupEntity({
            type: type,
            scene: this.params.scene,
            position: tempPos,
          }),
        });
      }
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
