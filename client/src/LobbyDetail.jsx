import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouteMatch } from "react-router-dom";

import { lobbySocket } from "./service/socket";

const LobbyDetail = () => {
    const [lobby, setLobby] = useState(null);
    let { lobbyID } = useParams();

    let socket;

    const handleLobbyUpdate = useCallback((lobby) => {
        console.log(lobby);
        setLobby(lobby);
    }, []);

    useEffect(() => {
        socket = lobbySocket(lobbyID);
    }, []);

    useEffect(() => {
        socket.on("connect", () => {
            console.log(lobbySocket.id);
        });

        socket.on("update-lobby", handleLobbyUpdate);

        return () => {};
    }, [socket]);

    if (lobby != null) {
        console.log(lobby);

        return (
            <>
                <h3>{lobby.name}</h3>
                <ul>
                    {lobby.clients.map((value, index) => {
                        return <li key={index}>{value}</li>;
                    })}
                </ul>
            </>
        );
    }

    return <h3>{lobbyID}</h3>;
};

export default LobbyDetail;
