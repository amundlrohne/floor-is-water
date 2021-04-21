import React from "react";
import { Link } from "react-router-dom";
import UsernameModal from "./components/UsernameModal.jsx";

import "../css/scene.css";

export const MenuScene = () => {
    if (window.localStorage.getItem("username") == null) {
        return <UsernameModal />;
    }

    return (
        <div className="menuWrapper">
            <h1>THE FLOOR IS WATER</h1>
            <ul>
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
    );
};

export default MenuScene;
