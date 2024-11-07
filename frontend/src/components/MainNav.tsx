import { useAuth0 } from "@auth0/auth0-react";

import { Button } from "./ui/button";
import UsernameMenu from "./UsernameMenu";

function MainNav() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const handleLogin = async () => await loginWithRedirect();

  return (
    <span className="flex items-center space-x-2">
      {isAuthenticated ? (
        <UsernameMenu />
      ) : (
        <Button
          variant="ghost"
          className="font-bold hover:bg-white hover:text-orange-500"
          onClick={handleLogin}
        >
          Log In
        </Button>
      )}
    </span>
  );
}

export default MainNav;
