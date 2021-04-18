import Lobby from "./lobby/lobby-world.js";
import { v4 as uuid } from "uuid";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

app.use(cors());

const httpServer = createServer(app);
const options = {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    },
};
const io = new Server(httpServer, options);

// Create new namespace for each lobby, set current socket to owner.
// Frontend fetches every namespace, and emits join to appropriate one.
// Frontend is updated for owner, and when 4 clients is reached, broadcast that the game is started.
// Namespace should contain, ID, NAME, OWNER, CLIENTS.

io.on("connection", (socket) => {
    console.log(`[SERVER] Client connected ${socket.id}`);

    socket.on("create-lobby", (lobbyName) => {
        const lobby = new Lobby(lobbyName, uuid(), io); // Init new lobby
        lobbies.push(lobby); // Add lobby to list of all lobbies
        serveLobbies(socket); // Update lobby list to frontend
    });

    socket.on("requested-lobbies", () => {
        serveLobbies(socket); // Respond with lobbies
    });
});

const serveLobbies = (socket) => {
    const activeLobbies = lobbies.filter((l) => l.active == true);
    socket.emit("serve-lobbies", activeLobbies);
};

const lobbies = [];

httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
