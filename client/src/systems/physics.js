import * as cannon from "cannon-es";
import {
    Mesh,
    RGBA_ASTC_10x10_Format,
    Vector2,
    SkinnedMesh,
    Vector3,
} from "three";
import { Quaternion, Vec3 } from "cannon-es";
import * as three from "three";
export class PhysicsHandler {
    constructor(entitySystem) {
        this.clock = new three.Clock();
        this.trackers = {};
        this.objects = {};
        this.meshControlled = {};
        this.fixedRotations = new Set();
        this.world = new cannon.World({
            gravity: new cannon.Vec3(0, -98.2, 0), // m/s²
        });
        this.timeStep = 1 / 60; // seconds
        this.xAcceleration = 0;
        this.zAcceleration = 0;
        this.playerVelocity = [0, 0];
        this.lastJump = this.clock.getElapsedTime();
        this.entitySystem = entitySystem;
    }

    addHitbox(params) {
        switch (params.type) {
            case "sphere": {
                const radius = params.radius; // m
                const body = new cannon.Body({
                    mass: params.mass, // kg
                    shape: new cannon.Sphere(radius),
                    fixedRotation: params.fixedRotation,
                });
                body.position.copy(params.position); // m
                body.quaternion.copy(new cannon.Quaternion(0, 0, 0, 0)); // make it face up
                body.addEventListener("collide", (e) => {
                    body.jumpReady = { ready: true, contacts: e };
                });
                this.world.addBody(body);
                this.objects[params._id] = { body: body, mesh: params.mesh };
                return body;
            }
            case "cube": {
                const body = new cannon.Body({
                    mass: params.mass, // kg
                    shape: new cannon.Box(
                        new cannon.Vec3(
                            params.width / 2,
                            params.height / 2,
                            params.depth / 2
                        )
                    ),
                    material: new cannon.Material({ friction: 0.01 }),
                    fixedRotation: params.fixedRotation,
                });
                body.position.copy(params.position); // m
                body.quaternion.copy(params.mesh.quaternion); // make it face up
                body.addEventListener("collide", (e) => {
                    if (e.body.type == 1) {
                        setTimeout(() => {
                            this.objects[params._id].body.mass = 2000000;
                        }, 3000);
                        setTimeout(() => {
                            this.objects[params._id].body.mass = 500000;
                        }, 5000);
                    }
                });
                this.world.addBody(body);
                this.objects[params._id] = { body: body, mesh: params.mesh };
                return body;
            }
            case "punch": {
                const body = new cannon.Body({
                    mass: params.mass, // kg
                    shape: new cannon.Box(
                        new cannon.Vec3(
                            params.width / 2,
                            params.height / 2,
                            params.depth / 2
                        )
                    ),
                    material: new cannon.Material({ friction: 1 }),
                    fixedRotation: params.fixedRotation,
                });
                body.position.copy(params.position); // m
                body.quaternion.copy(params.mesh.quaternion); // make it face up
                this.world.addBody(body);
                this.objects[params._id] = { body: body, mesh: params.mesh };
                return body;
            }
            case "cylinder": {
                const body = new cannon.Body({
                    mass: params.mass, // kg
                    shape: new cannon.Cylinder(
                        params.radius,
                        params.radius,
                        params.height,
                        params.segments
                    ),
                    material: new cannon.Material({ friction: 0.01 }),
                    fixedRotation: params.fixedRotation,
                });
                body.position.copy(params.position); // m
                body.quaternion.copy(params.mesh.quaternion); // make it face up
                if (params.fixedRotation) {
                    this.fixedRotations.add(params._id);
                }
                this.world.addBody(body);
                this.objects[params._id] = { body: body, mesh: params.mesh };

                return body;
            }
            case "player": {
                const body = new cannon.Body({
                    mass: 50, // kg
                    shape: new cannon.Cylinder(1, 1, 3, 32),
                    fixedRotation: params.fixedRotation,
                    material: new cannon.Material({ friction: 0 }),
                });
                body.position.copy(params.position); // m
                body.hasCollided = { ready: true };
                body.hasJump = true;
                body.angle = 0;
                body.addEventListener("collide", this.readyJump.bind(this));

                body.quaternion.copy(params.mesh.quaternion); // make it face up
                if (params.fixedRotation) {
                    this.fixedRotations.add(params._id);
                }

                this.world.addBody(body);
                this.objects[params._id] = { body: body, mesh: params.mesh };
                return body;
            }
            case "enemy": {
                const body = new cannon.Body({
                    mass: 0.0001, // kg
                    shape: new cannon.Cylinder(1, 1, 3, 32),
                    fixedRotation: params.fixedRotation,
                    material: new cannon.Material({ friction: 0 }),
                });
                body.position.copy(params.position);
                this.world.addBody(body);
                this.objects[params._id] = { body: body, mesh: params.mesh };
                return body;
            }
            case "plane": {
                const body = new cannon.Body({
                    mass: params.mass,
                    shape: new cannon.Plane(),
                    material: new cannon.Material({ friction: 0.01 }),
                    fixedRotation: params.fixedRotation,
                });
                body.position.copy(params.position);
                body.quaternion.copy(params.mesh.quaternion); // make it face up
                body.addEventListener("collide", (e) => {
                    this.drown(e, params);
                });
                this.world.addBody(body);
                if (params.meshControlled) {
                    this.meshControlled[params._id] = {
                        body: body,
                        mesh: params.mesh,
                    };
                } else {
                    this.objects[params._id] = {
                        body: body,
                        mesh: params.mesh,
                    };
                }
                return body;
            }
        }
    }

    drown(e) {
        if (
            e.body.shapes[0] instanceof cannon.Cylinder &&
            e.body.mass != 0.0001
        ) {
            e.body.velocity.setZero();
            this.entitySystem
                .Get("player")
                .GetComponent("BasicCharacterController")
                .ChangeState("Death");
            const camera = this.trackers["player"];
            this.trackers["player"] = undefined;
            this.addTracking(camera, "plane1");
        }
    }
    readyJump(e) {
        this.findObject("player").hasCollided = { ready: true };
    }

    addTracking(mesh, id) {
        if (this.trackers[id]) {
            this.trackers[id] = undefined;
        } else {
            mesh.minDistance = 50;
            mesh.maxDistance = 50;
            mesh.minPolarAngle = 0.7;
            mesh.maxPolarAngle = 0.7;
            mesh.minAzimuthAngle = 0;
            mesh.maxAzimuthAngle = 0;
            mesh.enableRotate = false;
            mesh.enableZoom = false;

            this.trackers[id] = mesh;
        }
    }

    findObject(id) {
        for (let key in this.objects) {
            if (key === id) {
                return this.objects[key].body;
            }
        }
    }

    applyVelocity(id, velocity) {
        let body = this.findObject(id);
        if (body.mass !== 0) {
            body.velocity.x += velocity.x;
            body.velocity.y += velocity.y;
            body.velocity.z += velocity.z;
        }
    }

    playerJump() {
        if (this.findObject("player").hasJump === true) {
            this.lastJump = this.clock.getElapsedTime();
            this.applyVelocity("player", new Vector3(0, 50, 0));
        }
        this.findObject("player").hasCollided.ready = false;
        this.findObject("player").hasJump = false;
    }

    accelerate(x, z) {
        this.xAcceleration = x;
        this.zAcceleration = -z;
    }

    setPosition(id, position) {
        console.log(position);
        this.findObject(id).position.copy(position);
        this.stopVelocity(id);
    }
    setQuaternion(id, quaternion) {
        this.findObject(id).quaternion.copy(quaternion);
    }

    stopVelocity(id) {
        this.findObject(id).velocity.x = this.playerVelocity[0];
        this.findObject(id).velocity.z = this.playerVelocity[1];
        this.findObject(id).velocity.y = 0;
    }

    update() {
        // Physics
        const time = performance.now() / 1000; // seconds
        if (!this.lastCallTime) {
            this.world.step(this.timeStep);
        } else {
            const dt = time - this.lastCallTime;
            this.world.step(this.timeStep, dt);
        }
        this.lastCallTime = time;

        for (let key in this.objects) {
            let body = this.objects[key].body;
            let mesh = this.objects[key].mesh;
            if (mesh) {
                mesh.position.copy(body.position);
                mesh.quaternion.copy(body.quaternion);
                if (this.trackers[key]) {
                    this.trackers[key].target.copy(body.position);
                    this.trackers[key].update();
                }
            }
        }
        for (let key in this.meshControlled) {
            let body = this.meshControlled[key].body;
            let mesh = this.meshControlled[key].mesh;
            body.position.copy(mesh.position);
            body.quaternion.copy(mesh.quaternion);
        }
        if (Object.keys(this.objects).includes("player")) {
            let player = this.findObject("player");
            const playerEntity = this.entitySystem.Get("player");
            playerEntity.SetPosition(player.position);
            playerEntity.SetQuaternion(player.quaternion);
            if (this.zAcceleration !== 0 || this.xAcceleration !== 0) {
                player.angle = Math.atan2(
                    this.xAcceleration,
                    this.zAcceleration
                );
            }
            player.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), player.angle);

            if (player.hasCollided.ready) {
                if (this.clock.getElapsedTime() - this.lastJump > 0.5) {
                    player.hasJump = true;
                }
            }

            let distanceX = Math.abs(player.velocity.x - this.xAcceleration);
            let distanceZ = Math.abs(player.velocity.z - this.zAcceleration);
            if (this.xAcceleration === 0) {
                if (player.velocity.x > 0) {
                    if (
                        player.velocity.x - 0.1 * distanceX >=
                        this.xAcceleration
                    ) {
                        player.velocity.x -= 0.1 * distanceX;
                    }
                } else {
                    if (
                        player.velocity.x + 0.1 * distanceX <=
                        this.xAcceleration
                    ) {
                        player.velocity.x += 0.1 * distanceX;
                    }
                }
            } else if (this.xAcceleration > 0) {
                if (player.velocity.x + 0.1 * distanceX <= this.xAcceleration) {
                    player.velocity.x += 0.1 * distanceX;
                }
            } else {
                if (player.velocity.x - 0.1 * distanceX >= this.xAcceleration) {
                    player.velocity.x -= 0.1 * distanceX;
                }
            }
            if (this.zAcceleration === 0) {
                if (player.velocity.z > 0) {
                    if (
                        player.velocity.z - 0.1 * distanceZ >=
                        this.zAcceleration
                    ) {
                        player.velocity.z -= 0.1 * distanceZ;
                    }
                } else {
                    if (
                        player.velocity.z + 0.1 * distanceZ <=
                        this.zAcceleration
                    ) {
                        player.velocity.z += 0.1 * distanceZ;
                    }
                }
            } else if (this.zAcceleration > 0) {
                if (player.velocity.z + 0.1 * distanceZ <= this.zAcceleration) {
                    player.velocity.z += 0.1 * distanceZ;
                }
            } else {
                if (player.velocity.z - 0.1 * distanceZ >= this.zAcceleration) {
                    player.velocity.z -= 0.1 * distanceZ;
                }
            }
        }
    }
}
