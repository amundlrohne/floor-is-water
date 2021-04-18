import React, { useEffect, useState } from "react";
import * as th from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./entities/entity";
import { Entity } from "./entities/entity";
import Map from "./components/map";
import MapEntity from "./entities/map";
import EntityManager from "./systems/entity-manager";

//import './entities/player';

let camera, scene, renderer, cube, clock;
let baseWaterY = 0;

let gameWorld;
let entityManager;

const Main = () => {
  function init() {
    // Init scene
    scene = new th.Scene();
    clock = new th.Clock();

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
    const controls = new OrbitControls(camera, canvas);
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

    // Position camera
    camera.position.set(0, 10, 20);
  }

  // Draw the scene every time the screen is refreshed
  function animate() {
    requestAnimationFrame(animate);

    // Add animation here
    render();
  }

  function render() {
    if (gameWorld) {
      baseWaterY += 0.01;
      entityManager.updateEntities(clock, baseWaterY);
      renderer.render(scene, camera);
    }
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
    gameWorld = new MapEntity({ scene: scene });
    entityManager = new EntityManager({ scene: scene });
    entityManager.populatePowerups();
    entityManager.populateWater();
  }, []);
  return <div />;
};

export default Main;
