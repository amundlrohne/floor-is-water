import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import robot from "../assets/audio/RobotParts.mp3";

const bgmusic = new Audio(robot);

var isPlaying = false;
export const SettingsScene = () => {
    const [username, setUsername] = useState();

    useEffect(() => {
        if (isPlaying == true) {
            document.getElementById("bgvalue").innerHTML = "On";
        } else {
            document.getElementById("bgvalue").innerHTML = "Off";
        }
    });

    bgmusic.loop = true;

    function togglePlay() {
        if (isPlaying == false) {
            bgmusic.play();
            isPlaying = true;
            document.getElementById("bgvalue").innerHTML = "On";
        } else {
            bgmusic.pause();
            isPlaying = false;
            document.getElementById("bgvalue").innerHTML = "Off";
        }
    }

    return (
        <div className="BgWrapper">
            <div className="BgGradient">
                <div className="SettingsWrapper">
                    <h2>Settings</h2>
                    <div className="SettingsBar">
                        <label>Toggle music</label>
                        <button type="button" onClick={togglePlay}>
                            Background music
                        </button>
                        <p id="bgvalue"></p>
                    </div>
                    <div className="SettingsBar">
                        <label>Username</label>
                        <input
                            placeholder={window.localStorage.getItem("username")}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        ></input>
                        <button
                            onClick={() => {
                                window.localStorage.setItem("username", username);
                                history.push("/");
                            }}
                        >
                            SET
                        </button>
                    </div>
                    <Link to={`/`}>Back</Link>
                </div>
            </div>
        </div>
    );
};

export default SettingsScene;
