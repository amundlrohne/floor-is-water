import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./css/global.css";
import LobbyList from "./LobbyList.jsx";
import LobbyDetail from "./LobbyDetail.jsx";

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/lobby-list">Home</Link>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route path="/lobby-list">
                    <LobbyList />
                </Route>
                <Route path="/lobby-detail/:lobbyID">
                    <LobbyDetail />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
