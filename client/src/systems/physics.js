import * as cannon from 'cannon-es';
import {Vector3} from "three";
import {Vec3} from "cannon-es";
export class PhysicsHandler {
    constructor() {
        this.objects = {}
        this.fixedRotations = new Set();
        this.world = new cannon.World({
            gravity: new cannon.Vec3(0, -98.2, 0), // m/s²
        });
        this.timeStep = 1 / 60 // seconds
        this.animate();
    }

    addHitbox(params) {
        console.log(params);
        switch(params.type) {
            case 'sphere': {
                const radius = params.radius // m
                const body = new cannon.Body({
                    mass: params.mass, // kg
                    shape: new cannon.Sphere(radius),
                })
                body.position.copy(params.position) // m
                body.quaternion.copy(params.mesh.quaternion) // make it face up
                this.world.addBody(body);
                this.objects[params._id] = {body: body, mesh: params.mesh};
                break;
            }
            case 'cube': {
                const body = new cannon.Body({
                    mass: params.mass, // kg
                    shape: new cannon.Box(new cannon.Vec3(params.width/2, params.height/2, params.depth/2)),
                })
                body.position.copy(params.position) // m
                body.quaternion.copy(params.mesh.quaternion) // make it face up
                this.world.addBody(body);
                this.objects[params._id] = {body: body, mesh: params.mesh};
                break;
            }
            case 'cylinder':
                const body = new cannon.Body({
                    mass: params.mass, // kg
                    shape: new cannon.Cylinder(params.radius, params.radius, params.height, params.segments),
                    material: new cannon.Material({friction:0.02,restitution:0}),
                })
                body.position.copy(params.position) // m
                body.quaternion.copy(params.mesh.quaternion) // make it face up
                if (params.fixedRotation) {
                    body.fixedRotation = params.fixedRotation
                    this.fixedRotations.add(params._id)
                }
                
                this.world.addBody(body);
                this.objects[params._id] = {body: body, mesh: params.mesh};

                break;
            case 'plane': {
                const body = new cannon.Body({
                    mass: params.mass,
                    shape: new cannon.Plane(),
                })
                body.position.copy(params.position);
                body.quaternion.copy(params.mesh.quaternion) // make it face up
                this.world.addBody(body)
                this.objects[params._id] = {body: body, mesh: params.mesh};
                break;
            }
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

    setPosition(id, position) {
        this.findObject(id).position.copy(position);
        this.stopVelocity(id);
    }

    stopVelocity(id) {
        this.findObject(id).velocity.copy(new Vector3(0, 0, 0));
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        // Physics
        const time = performance.now() / 1000 // seconds
        if (!this.lastCallTime) {
            this.world.step(this.timeStep)
        } else {
            const dt = time - this.lastCallTime
            this.world.step(this.timeStep, dt)
        }
        this.lastCallTime = time;

        for (let key in this.objects) {
            let body = this.objects[key].body;
            let mesh = this.objects[key].mesh;
            mesh.position.copy(body.position);
            if (!this.fixedRotations.has(key)){
                mesh.quaternion.copy(body.quaternion);
            }
        }
    }
}
