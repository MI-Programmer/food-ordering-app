import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

import { User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CreateUserRequest {
  auth0Id: string;
  email: string;
}

interface UpdateMyUserRequest {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
}

const useGetMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyUserRequest = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();
    const { data } = await axios.get(`${API_BASE_URL}/api/my/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  };

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery("fetchCurrentUser", getMyUserRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { currentUser, isLoading };
};

const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyUserRequest = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const { data } = await axios.post(`${API_BASE_URL}/api/my/user`, user, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  };

  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createMyUserRequest);

  return { createUser, isLoading, isError, isSuccess };
};

const useUpdateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const { data } = await axios.put(`${API_BASE_URL}/api/my/user`, formData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  };

  const {
    mutateAsync: updateUser,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateMyUserRequest);

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return { updateUser, isLoading };
};

export { useGetMyUser, useCreateMyUser, useUpdateMyUser };
