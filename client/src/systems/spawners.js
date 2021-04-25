import { Component } from "../components/component";
import { NetworkPlayerComponent } from "../components/network-player-component";
import { PlayerInput } from "../components/player-input";
export class PlayerSpawner extends Component {
    constructor(camera, scene) {
        super();
        this.camera = camera;
        this.scene = scene;
        // MISSING PARAMETERS
    }

    Spawn() {
        const player = new Entity();
        player.AddComponent(new NetworkPlayerComponent());
        player.AddComponent(new PlayerInput());

        return player;
    }
}
