import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import {
  RESOURCE_API,
  RESOURCE_GET_API,
  RESOURCE_POST_API,
} from "../constants";
import { useContext } from "react";
import { ToastContext } from "../providers/ToastProvider";

export default function useResource() {
  const queryClient = useQueryClient();

  const { addToast } = useContext(ToastContext);

  const PostUrl = () => {
    return useMutation(
      ({ url }) =>
        axios
          .post(`${RESOURCE_POST_API}?type=url`, { url })
          .then((res) => res.data),
      {
        onSuccess: (resource, variables) => {
          queryClient.setQueryData("resources", (prev) => {
            return [resource, ...prev];
          });
          addToast("Link Posted ✅ ");
        },
        onError: (err) => {
          console.error(err);
          addToast(`Error 🚨 - ${err.response.data}`);
        },
      }
    );
  };

  const PostText = () => {
    return useMutation(
      ({ title, text, slug }) =>
        axios
          .post(`${RESOURCE_POST_API}?type=text`, { title, text, slug })
          .then((res) => res.data),
      {
        onSuccess: (resource, variables) => {
          queryClient.setQueryData("resources", (prev) => {
            return [resource, ...prev];
          });
          addToast("Text Posted ✅ ");
        },
        onError: (err) => {
          console.error(err);
          addToast(`Error 🚨 - ${err.response.data}`);
        },
      }
    );
  };

  const GetAllResources = () => {
    return useQuery(
      "resources",
      () => axios.get(RESOURCE_GET_API).then((res) => res.data),
      {
        keepPreviousData: true,
      }
    );
  };

  const DeleteResource = () => {
    return useMutation(
      ({ resourceId }) =>
        axios.delete(`${RESOURCE_API}/${resourceId}`).then((res) => res.data),
      {
        onSuccess: (data, variables) => {
          queryClient.setQueryData("resources", (prev) => {
            return prev.filter((e) => e._id !== variables.resourceId);
          });
          addToast("Deleted ✅ ");
        },
        onError: (err) => {
          console.error(err);
          addToast(`Error 🚨 - ${err.response.data}`);
        },
      }
    );
  };

  return {
    PostUrl,
    PostText,
    GetAllResources,
    DeleteResource,
  };
}
