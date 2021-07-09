import axios from "axios";
import { USER_API } from "../constants";
import { useQuery } from "react-query";

const useUser = () => {

  const GetUser = (userId) => {
    return useQuery(
      ["user", userId],
      () => axios.get(`${USER_API}/${userId}`).then((res) => res.data),
      {
        keepPreviousData: true,
      }
    );
  };

  return {
    GetUser,
  };
};

export default useUser;
