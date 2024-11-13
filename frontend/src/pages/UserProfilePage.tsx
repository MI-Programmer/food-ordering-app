import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";
import { useGetUser, useUpdateUser } from "@/api/userApi";
import Loading from "@/components/Loading";

function UserProfilePage() {
  const { user, isLoading: isGetLoading } = useGetUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();

  if (isGetLoading) {
    return <Loading />;
  }

  if (!user) {
    return <span>Unable to load user profile</span>;
  }

  return (
    <UserProfileForm
      currentUser={user}
      onSave={updateUser}
      isLoading={isUpdateLoading}
    />
  );
}

export default UserProfilePage;
