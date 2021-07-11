import React from "react";
import { Route, Redirect } from "react-router-dom";

// Providers
import { AuthContext } from "./providers/AuthProvider";
import ModalProvider from "./providers/ModalProvider";
import ToastProvider from "./providers/ToastProvider";
import AudioProvider from "./providers/AudioProvider";

// Layout
import Layout from "./components/_layout/Layout";

// Containers
import Player from "./containers/Player";

// Screens
import Home from "./screens/Home";
import Login from "./screens/Login";
import UserProfile from "./screens/UserProfile";
import UserUploads from "./screens/UserUploads";

const App = () => {
  const auth = React.useContext(AuthContext);

  return (
    <ToastProvider>
      <ModalProvider>
        <AudioProvider>
          <Layout>
            <Route path="/signin">
              {auth.user ? (
                <Redirect to={`/uploads/${auth.user._id}`} />
              ) : (
                <Login />
              )}
            </Route>
            <Route path="/profile/:id">
              {auth.user ? <UserProfile /> : <Login />}
            </Route>
            <Route path="/uploads/:id">
              {auth.user ? <UserUploads /> : <Login />}
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            {auth.user && (
              <div className="fixed-bottom bg-light py-4">
                <div className="container">
                  <Player />
                </div>
              </div>
            )}
          </Layout>
        </AudioProvider>
      </ModalProvider>
    </ToastProvider>
  );
};

export default App;
