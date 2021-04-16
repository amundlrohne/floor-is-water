import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  HashRouter,
} from "react-router-dom";
import GameScene from "./scenes/GameScene";
import MenuScene from "./scenes/MenuScene";
import LobbyScene from "./scenes/LobbyScene";
import SettingsScene from "./scenes/SettingsScene";



const App = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* <p>
        <Link to="/game">To game scene</Link>
      </p> */}

      <Switch>
        <Route exact path="/" component={withRouter(MenuScene)}></Route>
        <Route path="/lobby" component={withRouter(LobbyScene)}></Route>
        <Route path="/settings" component={withRouter(SettingsScene)}></Route>
        <Route path="/game" component={withRouter(GameScene)}></Route>
      </Switch>
    </div>
  );
};

export default App;
