import io from "socket.io-client";

export const socket = io.connect("localhost:3000");

export const lobbySocket = (lobbyID) => {
    return io.connect(`localhost:3000/${lobbyID}`);
};
