import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter,
} from "react-router-dom";
import MenuScene from "./scenes/MenuScene";
import SettingsScene from "./scenes/SettingsScene";
import CreditsScene from "./scenes/CreditsScene";
import LobbyList from "./scenes/LobbyList.jsx";
import LobbyDetail from "./scenes/LobbyDetail.jsx";
import GameScene from "./scenes/GameScene";
import { DisconnectedScene, GameResultScene } from "./scenes/DisconnectedScene";

const App = () => {
    screen.orientation.lock("landscape");

    return (
        <div>
            <Switch>
                <Route exact path="/" component={withRouter(MenuScene)}></Route>
                <Route
                    path="/settings"
                    component={withRouter(SettingsScene)}
                ></Route>
                <Route path="/game" component={withRouter(GameScene)}></Route>
                <Route
                    path="/credits"
                    component={withRouter(CreditsScene)}
                ></Route>
                <Route path="/lobby-list">
                    <LobbyList />
                </Route>
                <Route path="/lobby-detail/:lobbyID">
                    <LobbyDetail />
                </Route>
                <Route path="/disconnected">
                    <DisconnectedScene />
                </Route>
            </Switch>
        </div>
    );
};

export default App;
