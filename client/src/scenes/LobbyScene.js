import React from "react";
import { Link } from "react-router-dom";

export const LobbyScene = () => {

  return (
    <div class="LobbyWrapper">
      <h2>Lobby</h2>
      <Link to={`/`}>Back</Link>      
    </div>
  );
};

export default LobbyScene;