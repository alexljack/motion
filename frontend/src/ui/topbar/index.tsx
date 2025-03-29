import { useNavigate } from "@tanstack/react-router";

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

  return (
    <div className="h-12 bg-red-500 w-full p-3">
      <div className="w-full flex justify-end gap-2">
        <div>Notifications</div>
        <div>Language</div>
        <div>Avatar</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default TopBar;
