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

const App = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Switch>
        <Route exact path="/" component={MenuScene}></Route>
        <Route path="/game" component={GameScene}></Route>
      </Switch>
    </div>
  );
};

export default App;
