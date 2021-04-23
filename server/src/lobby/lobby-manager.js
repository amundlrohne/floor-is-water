class WorldManager {
    constructor() {
        this.ids = 0;
        this.entities = [];
        this.grid = this.parent.grid;
        this.terrain = this.parrent.terrain;
        this.pos = params.pos;
        this.pos[1] = this.terrain.Get(...params.pos)[0];
        this.params = params;
    }
}