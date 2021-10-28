import React, { useState, useEffect, createContext, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../utils/api";
import usePodcast from "../hooks/usePodcast";

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState();
  const { subscribe, unsubscribe } = usePodcast();
  const {
    user: userFromAuth0,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const refetchUser = async () => {
    const token = await getAccessTokenSilently();
    api.defaults.headers.authorization = "Bearer " + token;
    const {
      data: { data },
    } = await api({ method: "get", url: `/user` });
    const mergedUserData = { ...userFromAuth0, ...data };
    setUser(mergedUserData);
  };

  const checkUserSubscriptions = (url) => {
    return user?.podcasts.some((e) => e.feed === url) || false;
  };

  useEffect(() => {
    if (isAuthenticated) {
      refetchUser();
    }
  }, [userFromAuth0, isAuthenticated]);

  return (
    <GlobalContext.Provider
      value={{ user, refetchUser, checkUserSubscriptions }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
