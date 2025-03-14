import React from "react";
import ReactDOM from "react-dom/client";
import TetrisApp from "./TetrisApp";
import "./styles/base.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <TetrisApp />
  </React.StrictMode>
);
