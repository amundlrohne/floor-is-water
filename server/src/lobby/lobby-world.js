class SocketWrapper {
    constructor(socket) {
        this.socket = socket;
        this.onMessage = null;
        this.dead = false;
        this.SetupSocket();
    }

    get ID() {
        return this.socket.id;
    }

    get IsAlive() {
        return !this.dead;
    }

    SetupSocket() {
        this.socket.on("user-connected", () => {
            console.log("socket.id: " + this.socket.id);
        });
        this.socket.on("disconnect", () => {
            console.log(socket.id + " disconnected");
            this.dead = true;
        });
        this.socket.onAny((e, d) => {
            try {
                if (!this.onMessage(e, d)) {
                    console.log("Unkown command: " + e + ", disconnected.");
                    this.Disconnect();
                }
            } catch (err) {
                console.error(err);
                this.Disconnect();
            }
        });
    }

    Disconnect() {
        this.socket.disconnect(true);
    }

    Send(msg, data) {
        this.socket.emit(msg, data);
    }
}

export default class Lobby {
    constructor(name, id, ownerID, io) {
        this.name = name;
        this.id = id;
        this.ownerID = ownerID;
        this.addNamespace(io);
        this.clients = [];

        console.log(`[LOBBY ${this.id}] Created lobby.`);
    }

    addClient = (socket) => {
        if (this.clients.length < 4) {
            for (let c of this.clients) {
                if (c == socket.id) {
                    console.log(`[LOBBY ${this.id}] Client already in lobby.`);
                    return;
                }
            }

            this.clients.push(socket.id);
            console.log(`[LOBBY ${this.id}] Client joined lobby.`);
        } else {
            console.log(
                `[LOBBY ${this.id}] Client attempted to join full lobby.`
            );
        }
    };

    addNamespace = (io) => {
        const namespace = io.of("/" + this.id);

        namespace.on("connection", (socket) => {
            namespace.emit("update-lobby", this);
        });
    };
}
