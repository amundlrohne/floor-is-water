import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  HashRouter,
} from "react-router-dom";
import MenuScene from "./scenes/MenuScene";
import LobbyScene from "./scenes/LobbyScene";
import SettingsScene from "./scenes/SettingsScene";
import CreditsScene from "./scenes/CreditsScene";
import GameScene from "./scenes/GameScene";




const App = () => {
  screen.orientation.lock('landscape');

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
        <Route path="/credits" component={withRouter(CreditsScene)}></Route>
      </Switch>
    </div>
  );
};

export default App;
