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


//import './entities/player';

let camera, scene, renderer, physicsHandler, entitySystem, clock, controls;

const GameScene = () => {
  function init() {
    // Init scene
    clock = new th.Clock();
    scene = new th.Scene();
    physicsHandler = new PhysicsHandler();
    entitySystem = new EntitySystem();
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
      scene.add(light);
    }


    //_LoadAnimatedModel();

    // Position camera
    camera.position.set(0, 10, 20);
  }


  // Draw the scene every time the screen is refreshed
  function animate() {
    requestAnimationFrame(animate);


    if (entitySystem.Get("player") != undefined) {
        if (
            entitySystem.Get("player")._components.BasicCharacterController
                .mixer !== undefined
        ) {
            var delta = clock.getDelta();
            entitySystem
                .Get("player")
                ._components.BasicCharacterController.mixer.update(delta); // update animation mixer
            renderer.render(scene, camera);
        }
    }
    // Add animation here

    renderer.render(scene, camera);
  }

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
    animate();

    // Entities
    new MapEntity({ scene: scene, physicsHandler: physicsHandler });
    console.log(entitySystem);
    const player = new PlayerEntity({
      camera: controls,
        scene: scene,
        entitySystem: entitySystem,
        clock: clock, physicsHandler: physicsHandler, radius: 2, height: 1, segments: 32, type: 'sphere', position: (new th.Vector3(0, 10, 0))
    });
    player.AddComponent(new PlayerInput());
  }, []);
  return <div />;
};

export default GameScene;
