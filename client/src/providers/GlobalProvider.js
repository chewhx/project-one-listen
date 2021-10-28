import React, { useState, useEffect, createContext, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../utils/api";

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState();
  const {
    user: userFromAuth0,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const refetchUser = useCallback(async () => {
    const token = await getAccessTokenSilently();
    api.defaults.headers.authorization = "Bearer " + token;
    const {
      data: { data },
    } = await api({ method: "get", url: `/user` });
    const mergedUserData = { ...userFromAuth0, ...data };
    setUser(mergedUserData);
  }, [getAccessTokenSilently, userFromAuth0]);

  useEffect(() => {
    if (isAuthenticated) {
      refetchUser();
    }
  }, [userFromAuth0, isAuthenticated, refetchUser]);
  return (
    <GlobalContext.Provider value={{ user, refetchUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
