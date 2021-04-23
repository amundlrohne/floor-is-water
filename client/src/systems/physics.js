import * as cannon from 'cannon-es';
import {RGBA_ASTC_10x10_Format, Vector3} from "three";
import {Vec3} from "cannon-es";
export class PhysicsHandler {
    constructor() {
        this.trackers = {}
        this.objects = {}
        this.meshControlled = {}
        this.fixedRotations = new Set();
        this.world = new cannon.World({
            gravity: new cannon.Vec3(0, -98.2, 0), // m/s²
        });
        this.timeStep = 1 / 60 // seconds
        this.xAcceleration = 0;
        this.zAcceleration = 0;
        this.playerVelocity = [0,0];
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
                body.quaternion.copy(new cannon.Quaternion(0,0,0,0)) // make it face up
                console.log()
                body.addEventListener('collide', (e)=>{body.jumpReady = {ready:true,contacts:e};console.log("Entered")});

               this.world.addEventListener('beginContact', (e)=>{body.jumpReady = {ready:true,contacts:e};console.log(e)});
                this.world.addEventListener('endContact', (e)=>{body.jumpReady = {ready:true,contacts:e};console.log("Left")});
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
                    fixedRotation:params.fixedRotation,
                    material: new cannon.Material({friction:0.0}),
                })
                body.position.copy(params.position) // m
                body.quaternion.copy(params.mesh.quaternion) // make it face up
                if (params.fixedRotation) {
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
                if (params.meshControlled) {
                    this.meshControlled[params._id] = {body: body, mesh: params.mesh}
                }
                else {
                    this.objects[params._id] = {body: body, mesh: params.mesh};
                }
                break;
            }
        }
    }

    addTracking(mesh, id) {
        if (this.trackers[id]) {
            this.trackers[id] = undefined
        } else {
            mesh.minDistance = 50;
            mesh.maxDistance = 50;
            mesh.minPolarAngle = 0.7;
            mesh.maxPolarAngle = 0.7;
            mesh.minAzimuthAngle = 1;
            mesh.maxAzimuthAngle = 1;
            mesh.enableRotate = false;
            mesh.enableZoom = false;

            this.trackers[id] = mesh
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

    playerJump(){
        console.log(this.findObject("player"))
        if(this.findObject("player").jumpReady.ready===true){
            this.applyVelocity("player",
                new Vector3(0, 70, 0))
        };
        this.findObject("player").jumpReady.ready=false;
    }

    accelerate(x,z){
        this.xAcceleration=x;
        this.zAcceleration=z;
    }

    setPosition(id, position) {
        this.findObject(id).position.copy(position);
        this.stopVelocity(id);
    }


    stopVelocity(id,x,z) {
        if(x===0){this.playerVelocity[0]=0; this.xAcceleration=0}
        if(z===0){this.playerVelocity[1]=0; this.zAcceleration=0}
        this.findObject(id).velocity.x=this.playerVelocity[0];
        this.findObject(id).velocity.z=this.playerVelocity[1];
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
            if (this.trackers[key]) {
                this.trackers[key].target.copy(body.position)
                this.trackers[key].update()
            }
        }
        for (let key in this.meshControlled) {
            let body = this.meshControlled[key].body;
            let mesh = this.meshControlled[key].mesh;
            body.position.copy(mesh.position);
            body.quaternion.copy(mesh.quaternion);
        }
        if(Object.keys(this.objects).includes("player")){
            if((this.playerVelocity[0]<35&&this.playerVelocity[0]>-35)&&this.xAcceleration!==0){
                this.playerVelocity[0] += this.xAcceleration;
                this.findObject("player").velocity.x = this.playerVelocity[0];
            }
            if((this.playerVelocity[1]<35&&this.playerVelocity[1]>-35)&&this.zAcceleration!==0){
                this.playerVelocity[1] += this.zAcceleration;
                this.findObject("player").velocity.z = this.playerVelocity[1];
            }

            if(Math.floor(this.playerVelocity[0])===0||Math.ceil(this.playerVelocity[0]===0)&&Math.floor(this.playerVelocity[1])===0||Math.ceil(this.playerVelocity[1]===0)){this.stopVelocity("player")}
            //if(Math.floor(this.playerVelocity[1])==0||Math.ceil(this.playerVelocity[1]==0)){this.stopVelocity("player")}
        }

    }
}
