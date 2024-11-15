import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";

function MobileNavLinks() {
  const { logout } = useAuth0();

  const handleLogout = () => logout();

  return (
    <>
      <Link
        to="/manage-restaurant"
        className="flex items-center bg-white font-bold hover:text-orange-500"
      >
        Manage Restaurant
      </Link>
      <Link
        to="/user-profile"
        className="flex items-center bg-white font-bold hover:text-orange-500"
      >
        User Profile
      </Link>

      <Button
        onClick={handleLogout}
        className="flex items-center px-3 font-bold hover:bg-gray-500"
      >
        Log Out
      </Button>
    </>
  );
}

export default MobileNavLinks;
