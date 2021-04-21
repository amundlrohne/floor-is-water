import * as th from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./entities/entity";
//import { FBXLoader } from "three-fbx-loader";
import React, { useEffect, useState } from "react";
import { Entity } from "./entities/entity";
import Map from "./components/map";
import MapEntity from "./entities/map";
import robot from "./assets/Robot.glb";
import {
    PlayerEntity,
    BasicCharacterController,
    CharacterFSM,
} from "./entities/player";
import { load_controller } from "./components/load-controller";
import EntitySystem from "./systems/entity-system";
import { PlaneBufferGeometry, Scene, Vector3 } from "three";
import {PlayerInput} from "./components/player-input";
//import './entities/player';

let camera, scene, renderer;

const Main = () => {
    var entitySystem;
    function init() {
        // Init scene
        scene = new th.Scene();
        entitySystem = new EntitySystem();

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
        const l = new Entity();
        l.AddComponent(new load_controller.LoadController());
        entitySystem.Add(l, "loader");

        // Position camera
        camera.position.set(0, 10, 20);
    }

    // Draw the scene every time the screen is refreshed
    function animate() {
        requestAnimationFrame(animate);
        // Add animation here

        renderer.render(scene, camera);
        if (entitySystem.Get("player") != undefined) {
            if (
                entitySystem.Get("player")._components.BasicCharacterController
                    .mixer != undefined
            ) {
                var delta = clock.getDelta();
                entitySystem
                    .Get("player")
                    ._components.BasicCharacterController.mixer.update(delta); // update animation mixer
                renderer.render(scene, camera);
            }
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
    function setMixer(mix) {
        console.log(mix);
        //mixer=mix;
    }
    window.addEventListener("resize", onWindowResize, false);
    const clock = new th.Clock();

    useEffect(() => {
        console.log("NOESOMHELST");
        init();
        animate();
        // Entities
        //const gameWorld = new MapEntity({ scene: scene });
        const player = new PlayerEntity({
            scene: scene,
            entitySystem: entitySystem,
            clock: clock,
            setMixer: setMixer.bind(this),
        });
        player.AddComponent(new PlayerInput());
        player.SetPosition(new Vector3(0, 5, 0));

    }, []);
    return (
        <button onClick={()=>{console.log(document.readyState)}} id="runner">
            TRYKK FOR Å LØPE
        </button>
    );
};

export default Main;
