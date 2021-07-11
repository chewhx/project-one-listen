import axios from "axios";
import { USER_API } from "../constants";
import { useQuery, useMutation } from "react-query";

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

  const EditUser = () => {
    return useMutation(
      ({ userId, email, name, password, confirmPassword }) =>
        axios
          .put(`${USER_API}/${userId}`, {
            email,
            name,
            password,
            confirmPassword,
          })
          .then((res) => res.data),
      {
        onSuccess: (user) => {
          console.log(user);
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  const DeleteUser = () => {
    return useMutation(
      ({ userId }) =>
        axios.delete(`${USER_API}/${userId}`).then((res) => res.data),
      {
        onSuccess: (user) => {
          console.log(user);
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  return {
    GetUser,
    EditUser,
    DeleteUser,
  };
};

export default useUser;
