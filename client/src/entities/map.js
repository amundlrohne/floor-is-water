import { Entity } from "./entity";
import Map from "../components/map";
import PlatformEntity from "./platform";
import { Vector3 } from "three";

export default class MapEntity extends Entity {
  constructor(params) {
    super();
    if (params) {
      if (params.position) {
        this.SetPosition(params.position);
      }
      this.AddComponent(new Map({ ...params }));

      // Add columns
      const columnRadius = 10;
      const columnPoly = 6;

      //Quadrant 1
      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 10,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(100, 5, 100),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 40,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(0, 20, 0),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 15,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(75, 8, 75),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(40, 11, 75),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(75, 11, 40),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(0, 11, 60),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 30,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(0, 15, 30),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(60, 11, 0),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 30,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(30, 15, 0),
        entitySystem: params.entitySystem,
      });

      //Quadrant 2
      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 10,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-100, 5, 100),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 15,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-75, 8, 75),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-40, 11, 75),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-75, 11, 40),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-60, 11, 0),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 30,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-30, 15, 0),
        entitySystem: params.entitySystem,
      });

      //Quadrant 3
      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 10,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-100, 5, -100),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 15,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-75, 8, -75),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-40, 11, -75),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(-75, 11, -40),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(0, 11, -60),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 30,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(0, 15, -30),
        entitySystem: params.entitySystem,
      });

      //Quadrant 4

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 10,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(100, 5, -100),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 15,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(75, 8, -75),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(40, 11, -75),
        entitySystem: params.entitySystem,
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        radius: columnRadius,
        height: 22,
        segments: columnPoly,
        type: "Column",
        position: new Vector3(75, 11, -40),
        entitySystem: params.entitySystem,
      });

      // Add floaters

      //Quadrant 1
      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(0, 10, 97),
      });
      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(97, 10, 0),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(32, 10, 32),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(97, 10, 57),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(57, 10, 97),
      });

      //Quadrant 2

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(-32, 10, 32),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(-97, 10, 57),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(-57, 10, 97),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(-97, 10, 0),
      });

      //Quadrant 3
      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(-32, 10, -32),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(-97, 10, -57),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(-57, 10, -97),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(0, 10, -97),
      });

      //Quadrant 4
      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(32, 10, -32),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(97, 10, -57),
      });

      new PlatformEntity({
        physicsHandler: params.physicsHandler,
        scene: params.scene,
        height: 3,
        width: 15,
        depth: 15,
        type: "Floating",
        position: new Vector3(57, 10, -97),
      });
    }
  }
}
