import React from "react";
import { Route } from "react-router-dom";

import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/Alert";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";

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
      <Route exact path="/signin" component={Login} />
      <Route exact path="/profile/:id" component={Profile} />
      <Route exact path="/" component={Home} />
      <Footer />
    </AlertProvider>
  );
};

export default App;
