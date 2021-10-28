import { useContext } from "react";
import { GlobalContext } from "../providers/GlobalProvider";

const useUser = () => {
  const { user, refetchUser } = useContext(GlobalContext);
  return { user, refetchUser };

  /* ------------------------ */
  /*          HOOKS           */
  /* ------------------------ */

  // const { user: userFromAuth0, getAccessTokenSilently } = useAuth0();

  // useEffect(() => {
  //   (async () => {
  //     const token = await getAccessTokenSilently();
  //     api.defaults.headers.authorization = "Bearer " + token;
  //     const {
  //       data: { data },
  //     } = await api({ method: "get", url: `/user` });
  //     const mergedUserData = { ...userFromAuth0, ...data };
  //     setUser(mergedUserData);
  //   })();
  // }, [userFromAuth0]);

  /* ------------------------ */
  /*         GET USER         */
  /* ------------------------ */

  // const getUser = async () => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await api({
  //       method: "get",
  //       url: `user`,
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
};

export default useUser;
