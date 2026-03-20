// import react library
import React from "react";
//import reactDOM for rendering
import ReactDOM from "react-dom/client";
// import main app component
import App from "./App";
// find the HTML element with id root and create a react root
ReactDOM.createRoot(document.getElementById("root")).render(
  // helps find potential problems in development
  <React.StrictMode>
    <App />
  </React.StrictMode>
);