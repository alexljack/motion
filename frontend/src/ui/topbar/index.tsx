import { Link, useNavigate } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";

import useLogout from "../../api/authentication/use-logout";

const TopBar = () => {
  const goTo = useNavigate();
  const { mutate: logout } = useLogout({
    onError: (err: Error) => {
      console.log(err);
      // add toast
    },
    onSuccess: () => {
      console.log("successfully logged out");
      localStorage.removeItem("user");
      goTo({ to: "/auth" });
    },
  });

  const handleLogout = () => {
    logout();
  };

  const buttonStyles =
    "border rounded p-1 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed";

  return (
    <div className="h-12 flex items-center bg-white w-full p-3">
      <div className="w-full flex justify-end gap-2">
        <button className={buttonStyles} disabled>
          Notifications
        </button>
        <button className={buttonStyles} disabled>
          Language
        </button>
        <Link to={"/profile"}>
          <button className={buttonStyles}>
            <UserIcon />
          </button>
        </Link>
        <button className={buttonStyles} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
