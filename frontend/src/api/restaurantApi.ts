import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

import { Restaurant, RestaurantSearchResponse } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useGetRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantRequest = async (): Promise<Restaurant | null> => {
    const accessToken = await getAccessTokenSilently();
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/restaurants`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return data;
    } catch {
      return null;
    }
  };

  const { data: restaurant, isLoading } = useQuery(
    "fetchRestaurant",
    getRestaurantRequest
  );

  return { restaurant, isLoading };
};

const useSearchRestaurant = (city?: string) => {
  const createRestaurantRequest =
    async (): Promise<RestaurantSearchResponse> => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/restaurants/search/${city}`
      );

      return data;
    };

  const { data: results, isLoading } = useQuery(
    ["searchRestaurant"],
    createRestaurantRequest,
    { enabled: !!city }
  );

  return { results, isLoading };
};

const useCreateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();
    const { data } = await axios.post(
      `${API_BASE_URL}/api/restaurants`,
      restaurantFormData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  };

  const {
    mutateAsync: createRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(createRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant created!");
  }

  if (error) {
    toast.error("Unable to update restaurant.");
  }

  return { createRestaurant, isLoading };
};

const useUpdateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();
    const { data } = await axios.put(
      `${API_BASE_URL}/api/restaurants`,
      restaurantFormData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  };

  const {
    mutateAsync: updateRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(updateRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant Updated!");
  }

  if (error) {
    toast.error("Unable to update restaurant.");
  }

  return { updateRestaurant, isLoading };
};

export {
  useGetRestaurant,
  useSearchRestaurant,
  useCreateRestaurant,
  useUpdateRestaurant,
};
