import React, { useState } from "react";
import * as th from "three";
import { Loader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./entities/entity";
import { Entity } from "./entities/entity";
import { StaticModelComponent } from "./components/gltf-component";
import { GLTFLoader } from "three-gltf-loader";
import { FBXLoader } from "three-fbx-loader";
//import './entities/player';

let camera, scene, renderer, cube;

const Main = () => {
  function init() {
    // Init scene
    scene = new th.Scene();

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
    const loader = new FBXLoader();
    loader.setPath("../assets/");
    loader.load("Robot.fbx", (fbx) => {
      this._OnLoaded(fbx);
    });

    // Position camera
    camera.position.set(0, 10, 20);
  }

  // Draw the scene every time the screen is refreshed
  function animate() {
    requestAnimationFrame(animate);

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

  const [first, setfirst] = useState(true);
  if (first) {
    init();
    animate();
    setfirst(false);
  }

  // Entities

  return <div />;
};

export default Main;