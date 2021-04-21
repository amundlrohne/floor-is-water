import React, {useState} from 'react';
import * as th from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let camera, scene, renderer, cube;

const GameWorld = () => {
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
        renderer = new th.WebGLRenderer({antialias: true});
        const canvas = renderer.domElement;
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 5, 0);
        controls.update();

        // Set size (whole window)
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Render to canvas element
        document.body.appendChild(canvas);

        {// Add plane
            const planeGeo = new th.PlaneGeometry(40, 40);
            const planeMat = new th.MeshBasicMaterial({color: 0x0000ff});
            const mesh = new th.Mesh(planeGeo, planeMat);
            mesh.rotation.x = Math.PI * -.5;
            scene.add(mesh);
        }
        {// Add walls
            const cubeGeo = new th.BoxGeometry(40, 100, 1);
            const cubeMat = new th.MeshPhongMaterial({color: '#8AC'});

            {// Wall 1
                const mesh = new th.Mesh(cubeGeo, cubeMat);
                mesh.position.set(20, 50, 0);
                mesh.rotation.set(0, Math.PI * -0.5, 0);
                scene.add(mesh);
            }

            {// Wall 2
                const mesh = new th.Mesh(cubeGeo, cubeMat);
                mesh.position.set(0, 50, 20);
                mesh.rotation.set(0, 0, 0);
                scene.add(mesh);
            }

            {// Wall 3
                const mesh = new th.Mesh(cubeGeo, cubeMat);
                mesh.position.set(-20, 50, 0);
                mesh.rotation.set(0, Math.PI * 0.5, 0);
                scene.add(mesh);
            }

            {// Wall 4
                const mesh = new th.Mesh(cubeGeo, cubeMat);
                mesh.position.set(0, 50, -20);
                mesh.rotation.set(0, 0, 0);
                scene.add(mesh);
            }
        }
        {// Add cube
            const cubeSize = 4;
            const cubeGeo = new th.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMat = new th.MeshPhongMaterial({color: '#8AC'});
            const mesh = new th.Mesh(cubeGeo, cubeMat);
            mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
            scene.add(mesh);
        }
        {// Add sphere
            const sphereRadius = 3;
            const sphereWidthDivisions = 32;
            const sphereHeightDivisions = 16;
            const sphereGeo = new th.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
            const sphereMat = new th.MeshPhongMaterial({color: '#CA8'});
            const mesh = new th.Mesh(sphereGeo, sphereMat);
            mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
            scene.add(mesh);
        }

        {// Add sun
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new th.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }
        {// Add ambient
            const color = 0xFFFFFF;
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

    window.addEventListener('resize', onWindowResize, false);

    const [first, setfirst] = useState(true);
    if (first) {
        init();
        animate();
        setfirst(false);
    }
    return <div/>;
}

export default GameWorld;
