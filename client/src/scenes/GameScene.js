import * as th from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "../entities/entity";
//import { FBXLoader } from "three-fbx-loader";
import React, { useEffect, useState } from "react";
import { Entity } from "../entities/entity";
import Map from "../components/map";
import MapEntity from "../entities/map";
import { BasicCharacterController, PlayerEntity } from "../entities/player";
import { PhysicsHandler } from "../systems/physics";
import EntitySystem from "../systems/entity-system";
import { LoadController } from "../components/load-controller";
import WaterPowerupManager from "../systems/entity-manager";

import { Joystick } from "react-joystick-component";
import "./gamescene.css";
import { NetworkPlayerComponent } from "../components/network-player-component";
import { NetworkComponent } from "../components/network-component";
import { NetworkEntityComponent } from "../components/network-entity-component";

//import './entities/player';

let camera,
    scene,
    renderer,
    physicsHandler,
    entitySystem,
    clock,
    controls,
    waterManager,
    baseWaterY,
    player;

const GameScene = (props) => {
    function init() {
        // Init scene
        clock = new th.Clock();
        scene = new th.Scene();
        entitySystem = new EntitySystem();
        physicsHandler = new PhysicsHandler(entitySystem);
        waterManager = new WaterPowerupManager({
            scene: scene,
            physicsHandler: physicsHandler,
        });
        baseWaterY = 0;
        // Init modelloader
        const l = new Entity();
        l.AddComponent(new LoadController());
        entitySystem.Add(l, "loader");

        const network = new Entity();
        network.AddComponent(new NetworkComponent(props.socket));
        entitySystem.Add(network, "network");

        const map = new MapEntity({
            scene: scene,
            physicsHandler: physicsHandler,
            entitySystem: entitySystem,
        });
        //entitySystem.Add(map);

        player = new PlayerEntity({
            camera: controls,
            scene: scene,
            physicsHandler: physicsHandler,
            radius: 2,
            height: 1,
            segments: 32,
            type: "sphere",
            position: new th.Vector3(20, 20, 0),
        });
        player.AddComponent(new NetworkPlayerComponent());
        entitySystem.Add(player, "player");

        const enemy1 = new Entity();
        enemy1.AddComponent(new NetworkEntityComponent());
        entitySystem.Add(enemy1, "enemy1");

        /*
        const enemy2 = new Entity();
        enemy1.AddComponent(new NetworkEntityComponent());
        entitySystem.Add(enemy2, "enemy2");

        const enemy3 = new Entity();
        enemy1.AddComponent(new NetworkEntityComponent());
        entitySystem.Add(enemy3, "enemy3");*/

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

        //_LoadAnimatedModel();

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
        if (baseWaterY < 38) {
            baseWaterY += 0.005;
            if (physicsHandler.findObject("plane1")) {
                physicsHandler.findObject("plane1").position.y =
                    baseWaterY + 4.35;
            }
        }
        waterManager.updateEntities(clock, baseWaterY);
    }

    function handleMove(e) {
        player.playerInput.handleMove(e);
    }

    let punchCountdown, stopCountdown, timer;

    function punch() {
        timer = 0;

        punchCountdown = setInterval(() => {
            updateCountdown();
        }, 100);
        stopCountdown = setTimeout(endCountdown, 3000);
        document.getElementById("countdown").style.visibility = "visible";

        player.punch();
    }

    const updateCountdown = () => {
        timer += 0.1;
        document.getElementById("countdown").innerHTML = (
            3 - timer.toFixed(1)
        ).toFixed(1);
    };

    const endCountdown = () => {
        clearInterval(punchCountdown);
        document.getElementById("countdown").style.visibility = "hidden";
    };

    const handleJump = (e) => {
        player.playerInput.jump();
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

    function test() {
        console.log(entitySystem);
    }

    useEffect(() => {
        init();
        step();
        console.log("useeffect");
        waterManager.populatePowerups();
        waterManager.populateWater();
        // Entities
        console.log(entitySystem);
    }, []);

    return (
        <div>
            <div id="controls">
                <div className="leftJoystick">
                    <Joystick
                        move={(e) => {
                            handleMove(e);
                        }}
                        stop={(e) => {
                            handleMove(e);
                        }}
                        stickColor={"#fcba03"}
                        baseColor={"#ad7f00"}
                    ></Joystick>
                </div>

                <div className="jumpButton">
                    <button onClick={handleJump}>Jump</button>
                </div>
                <div className="punchButton">
                    <div className="countDownOverlay" id="countdown">
                        {timer}
                    </div>
                    <button onClick={punch}>Punch</button>
                </div>
            </div>
        </div>
    );
};

export default GameScene;
