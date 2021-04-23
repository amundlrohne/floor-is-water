import * as th from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "../entities/entity";
//import { FBXLoader } from "three-fbx-loader";
import React, { useEffect, useState } from "react";
import { Entity } from "../entities/entity";
import Map from "../components/map";
import MapEntity from "../entities/map";
import robot from "../assets/Robot.fbx";
import { PhysicsHandler } from "../systems/physics";

import { Joystick } from "react-joystick-component";
import "./gamescene.css";

//import './entities/player';

let camera, scene, renderer, physicsHandler;

const GameScene = () => {
  function init() {
    // Init scene
    scene = new th.Scene();
    physicsHandler = new PhysicsHandler();

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
    var loader = new FBXLoader();

    loader.load(robot, function (result) {
      console.log(result);
      scene.add(result);
      result.scale.setScalar(0.01);
      result.traverse((c) => {
        c.castShadow = true;
      });
      /*       const m = new th.AnimationMixer(result);
      m.clipActions(result.animations[10]).play();

      console.log(result.animations); */
    });

    //_LoadAnimatedModel();

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

  window.addEventListener("resize", onWindowResize, false);

  useEffect(() => {
    init();
    animate();

    // Entities
    new MapEntity({ scene: scene, physicsHandler: physicsHandler });
  }, []);
  return (
    <div>
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
    </div>
  );
};

export default GameScene;
