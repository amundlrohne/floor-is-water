import React from "react";
import Router from "react-router";
import { Link } from "react-router-dom";

export const MenuScene = () => {
  return (
    <div>
      <p>Menu Scene</p>
      <Nav.Link as={Link} to="/lobby">Jargons that works!</Nav.Link>
    </div>
  );
};

export default MenuScene;