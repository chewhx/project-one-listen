import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loader from "../components/Loader";

const ProtectedRoute = ({ component, ...rest }) => {
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting: () => <Loader />,
      })}
      {...rest}
    />
  );
};

export default ProtectedRoute;
