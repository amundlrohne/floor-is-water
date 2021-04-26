import React from 'react'
import { Link } from 'react-router-dom'
import "../css/scene.css";
import "../css/global.css";

export const DisconnectedScene = () => {


    return(
        <div className="BgWrapper">
        <div className="BgGradient">
            <div className="resultWrapper">
                <div id="gameResultDiv">
                    <h2>You have been disconnected from the game</h2>
                    <Link to="/"> Return to menu</Link>
                </div>
            </div>
        </div>
        </div>


    );
}