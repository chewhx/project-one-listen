import { useAuth0 } from "@auth0/auth0-react";
import api from "../utils/api";

const usePodcast = () => {
  /* ------------------------ */
  /*          HOOKS           */
  /* ------------------------ */

  const { getAccessTokenSilently } = useAuth0();

  /* ------------------------ */
  /*         SUBSCRIBE        */
  /* ------------------------ */

  const subscribe = async (data) => {
    try {
      const token = await getAccessTokenSilently();
      api.defaults.headers.authorization = `Bearer ${token}`;
      const {
        data: { success },
      } = await api({
        method: "put",
        url: `/podcast`,
        data: {
          ...data,
        },
      });
      return success;
    } catch (e) {
      console.error(e);
    }
  };

  /* ------------------------ */
  /*        UNSUBSCRIBE       */
  /* ------------------------ */

  const unsubscribe = async (feed) => {
    try {
      const token = await getAccessTokenSilently();
      api.defaults.headers.authorization = `Bearer ${token}`;
      const {
        data: { success },
      } = await api({
        method: "delete",
        url: `/podcast`,
        data: {
          feed,
        },
      });
      return success;
    } catch (e) {
      console.error(e);
    }
  };

  /* ------------------------ */
  /*        RETURN       */
  /* ------------------------ */

  return { unsubscribe, subscribe };
};

export default usePodcast;
