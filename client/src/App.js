import React from 'react'
import GameWorld from "./GameWorld.jsx";
import Home from "./Home.js";
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const App = () => {
  return (
      <Router>
          <div>
              <nav>
                  <ul>
                      <li>
                          <Link to="/">Home</Link>
                      </li>
                      <li>
                          <Link to="/gameWorld">Game</Link>
                      </li>
                  </ul>
              </nav>
              <Switch>
                  <Route path="/gameWorld">
                      <GameWorld />
                  </Route>
                  <Route path="/">
                      <Home />
                  </Route>
              </Switch>
          </div>
      </Router>
  )
}

export default App
