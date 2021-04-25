export class Player {
    constructor(username, socketID) {
        this.username = username;
        this.id = socketID;
        this.transform = new Transform("IDLE", [0, 0, 0], [0, 0, 0]);
    }

    setStartingTransform = (index) => {
        this.transform = STARTING_TRANSFORMS[index];
    };
}

class Transform {
    constructor(state, position, quaternion) {
        this.state = state;
        this.position = position;
        this.quaternion = quaternion;
    }
}

export const STARTING_TRANSFORMS = [
    new Transform("IDLE", [0, 0, 0], [0, 0, 0]),
    new Transform("IDLE", [20, 0, 0], [0, 0, 0]),
    new Transform("IDLE", [0, 0, 20], [0, 0, 0]),
    new Transform("IDLE", [20, 0, 20], [0, 0, 0]),
];
