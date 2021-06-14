import React from "react";
import { Route } from "react-router-dom";

import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/Alert";
import Nav from "./components/Nav";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

const App = () => {
  const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: "10px",
  };

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Nav />
      <Route path="/profile/:id" component={Profile} />
      <Route exact path="/" component={Home} />
    </AlertProvider>
  );
};

export default App;
