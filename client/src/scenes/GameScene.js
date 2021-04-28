import * as th from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "../entities/entity";
import React, { useEffect, useState } from "react";
import { Entity } from "../entities/entity";
import Map from "../components/water-controller";
import MapEntity from "../entities/map";
import { BasicCharacterController } from "../components/basic-character-controller";
import { PlayerInput } from "../components/player-input";
import { PhysicsHandler } from "../systems/physics";
import EntitySystem from "../systems/entity-system";
import { LoadController } from "../components/load-controller";
import robotGLB from "../assets/RobotExpressive.glb";

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
        entitySystem = new EntitySystem({scene: scene, physicsHandler: physicsHandler,});
        physicsHandler = new PhysicsHandler(entitySystem);
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
        baseWaterY = 0;
        // Init modelloader
        const l = new Entity();
        l.AddComponent(new LoadController());
        entitySystem.Add(l, "loader");
        // Init camera (PerspectiveCamera)

        const network = new Entity();
        network.AddComponent(new NetworkComponent(props.socket));
        entitySystem.Add(network, "network");

        const map = new MapEntity({
            scene: scene,
            physicsHandler: physicsHandler,
            entitySystem: entitySystem,
        });
        //entitySystem.Add(map);

        player = new Entity();
        player.AddComponent(
            new BasicCharacterController(
                new th.Vector3(100, 30, 100),
                physicsHandler,
                controls,
                scene
            )
        );
        player.AddComponent(new PlayerInput(physicsHandler, controls));

        player.AddComponent(new NetworkPlayerComponent());
        entitySystem.Add(player, "player");

        const enemy1 = new Entity();
        enemy1.AddComponent(new NetworkEntityComponent(physicsHandler));
        enemy1.AddComponent(
            new BasicCharacterController(
                new th.Vector3(100, 30, 100),
                physicsHandler,
                controls,
                scene
            )
        );
        entitySystem.Add(enemy1, "enemy1");

        /*
        const enemy2 = new Entity();
        enemy1.AddComponent(new NetworkEntityComponent());
        entitySystem.Add(enemy2, "enemy2");

        const enemy3 = new Entity();
        enemy1.AddComponent(new NetworkEntityComponent());
        entitySystem.Add(enemy3, "enemy3");*/

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
    }

    //_LoadAnimatedModel();

    // Draw the scene every time the screen is refreshed
    function step() {
        let delta = clock.getDelta();

        if (entitySystem.Get("player")) {
            if (
                entitySystem.Get("player")._components.BasicCharacterController
                    .mixer
            ) {
                entitySystem
                    .Get("player")
                    ._components.BasicCharacterController.Update(delta);
            }
        }
        requestAnimationFrame(step);
        water();

        renderer.render(scene, camera);

        entitySystem.Update(delta);

        physicsHandler.update();
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
        player.GetComponent("PlayerInput").handleMove(e);
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
        player.GetComponent("PlayerInput").jump();
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
        document.addEventListener("touchstart", () => {
            console.log("TOUCH");
        });
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
