import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "../../css/scene.css";

export const UsernameModal = () => {
    const [username, setUsername] = useState("");
    const history = useHistory();

    return (
        <div className="usernameModal">
            <h4>Please enter your username</h4>
            <input
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
                SUBMIT
            </button>
        </div>
    );
};

export default UsernameModal;
