import React from "react";
import { Link } from "react-router-dom";

export const LobbyScene = () => {

  return (
    <div className="BgWrapper">
      <div className="BgGradient">
        <div className="LobbyWrapper">
          <h2>Lobby</h2>
          <Link to={`/game`}>game</Link>
          <Link to={`/`}>Back</Link>      
        </div>
      </div>
    </div>
  );
};

export default LobbyScene;
