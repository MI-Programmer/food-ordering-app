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

interface UpdateUserRequest {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
}

const useGetUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getUserRequest = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();
    const { data } = await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  };

  const {
    data: user,
    isLoading,
    error,
  } = useQuery("fetchUser", getUserRequest);

  if (error) {
    toast.error(error.toString());
  }

  return { user, isLoading };
};

const useCreateUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createUserRequest = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const { data } = await axios.post(`${API_BASE_URL}/api/users`, user, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  };

  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createUserRequest);

  return { createUser, isLoading, isError, isSuccess };
};

const useUpdateUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateUserRequest = async (formData: UpdateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const { data } = await axios.put(`${API_BASE_URL}/api/users`, formData, {
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
  } = useMutation(updateUserRequest);

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return { updateUser, isLoading };
};

export { useGetUser, useCreateUser, useUpdateUser };
