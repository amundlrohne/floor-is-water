import * as th from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "../entities/entity";
//import { FBXLoader } from "three-fbx-loader";
import React, { useEffect, useState } from "react";
import { Entity } from "../entities/entity";
import Map from "../components/map";
import MapEntity from "../entities/map";
import {PlayerEntity} from "../entities/player"
import {PhysicsHandler} from "../systems/physics";
import EntitySystem from "../systems/entity-system";
import { LoadController } from "../components/load-controller";
import { PlayerInput } from "../components/player-input";
import WaterPowerupManager from "../systems/entity-manager";

import { Joystick } from "react-joystick-component";
import "./gamescene.css";

//import './entities/player';

let camera, scene, renderer, physicsHandler, entitySystem, clock, controls, waterManager, baseWaterY;

const GameScene = () => {
  function init() {
    // Init scene
    clock = new th.Clock();
    scene = new th.Scene();
    physicsHandler = new PhysicsHandler();
    entitySystem = new EntitySystem();
    waterManager = new WaterPowerupManager({scene: scene, physicsHandler: physicsHandler});
    baseWaterY = 0.1;
    // Init modelloader
    const l = new Entity();
        l.AddComponent(new LoadController());
        entitySystem.Add(l, "loader");
    // Init camera (PerspectiveCamera)
    camera = new th.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Init renderer
    renderer = new th.WebGLRenderer({ antialias: true });
    const canvas = renderer.domElement;
    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // Set size (whole window)
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Render to canvas element
    document.body.appendChild(canvas);

    {
      // Add sun
      const color = 0xffffff;
      const intensity = 1;
      const light = new th.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }
    {
      // Add ambient
      const color = 0xffffff;
      const intensity = 0.5;
      const light = new th.AmbientLight(color, intensity);
      light.castShadow = true;
      scene.add(light);
    }



    // Position camera
    camera.position.set(0, 10, 20);
  }



  // Draw the scene every time the screen is refreshed
  function step() {
    requestAnimationFrame(step);
    water();
    let delta = clock.getDelta();

    entitySystem.Update(delta);

    physicsHandler.update();

        renderer.render(scene, camera);
    }

  function water() {
      baseWaterY += 0.01;
      waterManager.updateEntities(clock, baseWaterY);
      renderer.render(scene, camera);
  }

  const handleMove = (e) => {
    console.log(e);
  };

  const handleMoveStop = (e) => {
    console.log(e);
  };

  const handleDirection = (e) => {
    console.log(e);
  };

  const handleRelease = (e) => {
    console.log("released");
  };

  const handleJump = (e) => {
    console.log("jumped");
  };

  function onWindowResize() {
    // Camera frustum aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    // After making changes to aspect
    camera.updateProjectionMatrix();
    // Reset size
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

    window.addEventListener("resize", onWindowResize, false);

  useEffect(() => {
    init();
    step();
    console.log("useeffect")
    waterManager.populatePowerups();
    waterManager.populateWater();
    // Entities
    console.log(entitySystem);
    new MapEntity({ scene: scene, physicsHandler: physicsHandler, entitySystem:entitySystem });
    const player = new PlayerEntity({
      camera: controls,
        scene: scene,
        entitySystem: entitySystem,
        clock: clock, physicsHandler: physicsHandler, radius: 2, height: 1, segments: 32, type: 'sphere', position: (new th.Vector3(0, 10, 0))
    });

    player.AddComponent(new PlayerInput());
  }, []);
  return <div>
  <div id="controls">
    <div className="leftJoystick">
      <Joystick
        move={handleMove}
        stop={handleMoveStop}
        stickColor={"#fcba03"}
        baseColor={"#ad7f00"}
      ></Joystick>
    </div>
    <div className="rightJoystick">
      <Joystick
        move={handleDirection}
        stop={handleRelease}
        stickColor={"#fcba03"}
        baseColor={"#ad7f00"}
      ></Joystick>
    </div>

    <div className="jumpButton">
      <button onClick={handleJump}>Jump</button>
    </div>
  </div>
</div>;
};

export default GameScene;
