import * as cannon from 'cannon-es';
import {Vector3} from "three";
import {Vec3} from "cannon-es";
export class PhysicsHandler {
    constructor() {
        this.objects = {}
        this.world = new cannon.World({
            gravity: new cannon.Vec3(0, -98.2, 0), // m/s²
        });
        this.timeStep = 1 / 60 // seconds
        this.animate();
    }

    addHitbox(params) {
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
                })
                body.position.copy(params.position) // m
                body.quaternion.copy(params.mesh.quaternion) // make it face up
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

    applyVelocity(id, velocity) {
        for (let key in this.objects) {
            console.log("applying force");
            let body = this.objects[key].body;
            if (body.mass !== 0 && key === id) {
                body.velocity.x += velocity.x;
                body.velocity.y += velocity.y;
                body.velocity.z += velocity.z;
            }
        }
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
            mesh.quaternion.copy(body.quaternion);
        }
    }
}
