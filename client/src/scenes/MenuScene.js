import React from "react";
import { Link } from "react-router-dom";
import "../css/scene.css";
import "../css/global.css";
import UsernameModal from "./components/UsernameModal.jsx";

import "../css/scene.css";

export const MenuScene = () => {
    if (window.localStorage.getItem("username") == null) {
        return <UsernameModal />;
    }

    return (
      <div className="BgWrapper">
      <div className="BgGradient">
        <div className="menuWrapper">
            <h1>THE FLOOR IS WATER</h1>
            <ul>
                <li>
                  <Link to={"/game"}>Game Debug</Link>
                </li>
                <li>
                  <Link to={`/lobby-list`}>Lobby</Link>
                </li>
                <li>
                  <Link to={`/settings`}>Settings</Link>
              </li>
              <li>
                <Link to={`/credits`}>Credits</Link>
              </li>
            </ul>
        </div>
      </div>
      </div>
    );
};

export default MenuScene;
