import { Link, useNavigate } from "@tanstack/react-router";
import { MenuIcon, UserIcon } from "lucide-react";
import useLogout from "../../api/authentication/use-logout";

type TopBarProps = {
  onMenuOpen: () => void;
};

const TopBar = ({ onMenuOpen }: TopBarProps) => {
  const goTo = useNavigate();
  const { mutate: logout } = useLogout({
    onError: (err: Error) => {
      console.log(err);
    },
    onSuccess: () => {
      console.log("successfully logged out");
      localStorage.removeItem("user");
      goTo({ to: "/auth" });
    },
  });

  const buttonStyles =
    "border rounded p-1 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed";

  return (
    <div className="h-12 flex items-center bg-white w-full px-3 gap-3">
      {/* Hamburger — only visible on mobile/tablet */}
      <button
        type="button"
        onClick={onMenuOpen}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600"
        aria-label="Open navigation"
      >
        <MenuIcon size={22} />
      </button>

      <div className="flex-1 flex justify-end gap-2">
        <button className={buttonStyles} disabled>
          Notifications
        </button>
        <button className={buttonStyles} disabled>
          Language
        </button>
        <Link to="/profile">
          <button className={buttonStyles}>
            <UserIcon />
          </button>
        </Link>
        <button className={buttonStyles} onClick={() => logout()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
