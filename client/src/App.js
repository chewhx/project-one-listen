import React from "react";
import { Route } from "react-router-dom";
import "./swatch.css";
import "./styles.scss";

// Providers
import ModalProvider from "./providers/ModalProvider";
import ToastProvider from "./providers/ToastProvider";
import AudioProvider from "./providers/AudioProvider";

// Layout
import Layout from "./components/layout/Layout";

// Containers
import Player2 from "./containers/Player2";

// Screens
import Home from "./screens/Home";
import Podcast from "./screens/Podcast";
import Topic from "./screens/Topic";
import Speech from "./screens/Speech";
import UserProfile from "./screens/UserProfile";
import ProtectedRoute from "./auth/ProtectedRoute";

const App = () => {
  return (
    <ToastProvider>
      <ModalProvider>
        <AudioProvider>
          <Layout>
            {/* <Route exact path="/auth/logout">
              <Redirect push to="http://localhost:5000/auth/logout" />
            </Route> */}
            <ProtectedRoute exact path="/profile" component={UserProfile} />
            <Route exact path="/podcast/topic/:topic" component={Topic} />
            <Route exact path="/podcast/rss" component={Podcast} />
            <Route exact path="/speech" component={Speech} />
            <Route exact path="/" component={Home} />

            <div className="fixed-bottom bg-light py-4">
              <div className="container">
                <Player2 />
              </div>
            </div>
          </Layout>
        </AudioProvider>
      </ModalProvider>
    </ToastProvider>
  );
};

export default App;
