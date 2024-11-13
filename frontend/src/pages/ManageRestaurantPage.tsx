import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";
import Loading from "@/components/Loading";
import {
  useCreateRestaurant,
  useGetRestaurant,
  useUpdateRestaurant,
} from "@/api/restaurantApi";

function ManageRestaurantPage() {
  const { restaurant, isLoading: isGetLoading } = useGetRestaurant();
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateRestaurant();

  const isEditing = !!restaurant;

  if (isGetLoading) {
    return <Loading />;
  }

  return (
    <ManageRestaurantForm
      restaurant={restaurant}
      onSave={isEditing ? updateRestaurant : createRestaurant}
      isLoading={isCreateLoading || isUpdateLoading}
    />
  );
}

export default ManageRestaurantPage;
