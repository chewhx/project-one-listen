import React from "react";
import { Route } from "react-router-dom";

import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/Alert";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";

const App = () => {
  const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: "10px",
  };

  const history = useHistory();

  const [user, setUser] = React.useState();

  React.useEffect(() => {
    axios
      .get(`/auth/user`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [history]);

  const loginHandler = async (values) => {
    try {
      const { data, status } = await axios.post(`/auth/local`, {
        email: values.email,
        password: values.password,
      });

      if (status === 200 || status === 302) {
        axios
          .get(`/auth/user`)
          .then((res) => {
            setUser(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
        history.replace(`/profile/${data._id}`);
      }
    } catch (err) {
      alert.error(`Error ${err.response.status}: ${err.response.data}`);
      console.error(err.stack);
    }
  };

  const logoutHandler = async () => {
    const { status } = await axios.get(`/logout`);
    setUser();
    if (status === 200 || status === 302) {
      history.push(`/`);
    }
  };

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Nav user={user} logoutHandler={logoutHandler} />
      <Route exact path="/signin" component={Login}>
        {user ? (
          <Redirect to={`/profile/${user._id}`} />
        ) : (
          <Login loginHandler={loginHandler} />
        )}
      </Route>
      <Route exact path="/profile/:id" component={Profile} />
      <Route exact path="/" component={Home} />
      <Footer />
    </AlertProvider>
  );
};

export default App;
