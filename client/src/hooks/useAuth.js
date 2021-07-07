import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.post("/api/v2/auth").then((res) => {
      if (res.data) {
        setUser(res.data);
      }
    });
  }, []);

  const loginHandler = async (values) => {
    try {
      const { data } = await axios.post("/api/v2/auth/local", {
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
