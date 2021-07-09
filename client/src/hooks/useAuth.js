import { useState, useEffect } from "react";
import axios from "axios";
import { LOCAL_AUTH_URL, AUTH_URL } from "../constants";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.post(AUTH_URL).then((res) => {
      if (res.data) {
        setUser(res.data);
      }
    });
  }, []);

  const loginHandler = async (values) => {
    try {
      const { data } = await axios.post(LOCAL_AUTH_URL, {
        email: values.email,
        password: values.password,
      });
      setUser(data);
    } catch (err) {
      // alert.error(`Error ${err.status}: ${err.response}`);
      console.error(err);
    }
  };

  const logoutHandler = async () => {
    await axios.get(`/logout`);
    setUser(false);
  };

  return {
    user,
    loginHandler,
    logoutHandler,
  };
};

export default useAuth;
