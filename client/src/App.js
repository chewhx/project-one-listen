import React from "react";
import { Route } from "react-router-dom";

import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/Alert";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Redirect } from "react-router-dom";

import { AuthContext } from "./providers/AuthContext";

const App = () => {
  const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: "10px",
  };

  const auth = React.useContext(AuthContext);

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Nav />
      <Route path="/signin">
        {auth.user ? <Redirect to={`/profile/${auth.user._id}`} /> : <Login />}
      </Route>
      <Route path="/profile/:id">{auth.user ? <Profile /> : <Login />}</Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Footer />
    </AlertProvider>
  );
};

export default App;
