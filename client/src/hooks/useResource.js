import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import {
  RESOURCE_API,
  RESOURCE_GET_API,
  RESOURCE_POST_API,
} from "../constants";
import { useAlert } from "react-alert";

export default function useResource() {
  const queryClient = useQueryClient();
  const alert = useAlert();

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
          alert.success(`✅ Link uploaded.`);
        },
        onError: (err) => {
          alert.error(`🚨 ${err.response.status}: ${err.response.data}`);
          console.error(err);
          console.log(err.response);
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
          alert.success(`✅ Link uploaded.`);
        },
        onError: (err) => {
          alert.error(`🚨 ${err.response.status}: ${err.response.data}`);
          console.error(err);
          console.log(err.response);
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
          alert.success(`✅ Resource deleted.`);
        },
        onError: (err) => {
          alert.error(`🚨 ${err.response.status}: ${err.response.data}`);
          console.error(err);
          console.log(err.response);
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
