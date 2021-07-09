import React from "react";
import { Route, Redirect } from "react-router-dom";

// Providers
import { AuthContext } from "./providers/AuthProvider";
import ModalProvider from "./providers/ModalProvider";
import ToastProvider from "./providers/ToastProvider";

// Layout
import Layout from "./components/_layout/Layout";

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
        <Layout>
          <Route path="/signin">
            {auth.user ? (
              <Redirect to={`/profile/${auth.user._id}`} />
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
        </Layout>
      </ModalProvider>
    </ToastProvider>
  );
};

export default App;
