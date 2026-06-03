import { useState } from "react";
import { Link } from "@tanstack/react-router";

import cn from "../../utils/cn";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const linkStyles = cn(
    "bg-blue-500 h-11 p-2 rounded-lg flex items-center justify-center transition-all duration-300",
    collapsed ? "w-11" : "w-48"
  );

  const links = [
    { to: "/", label: "Home" },
    { to: "/exercises", label: "Exercises" },
    { to: "/workouts", label: "Workouts" },
    { to: "/my-logs", label: "Logs" },
    { to: "/sleep", label: "Sleep" },
    { to: "/nutrition", label: "Nutrition" },
    { to: "/about", label: "About" },
  ];

  return (
    <div
      className={cn(
        "h-dvh bg-gray-400 py-2 px-2 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-52"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-red-600 text-white italic size-12 mb-6 text-2xl"
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <span>F</span> : <span>Fort</span>}
      </div>
      <div className="h-full flex flex-col gap-2">
        {links.map((link) => (
          <div key={link.to} className={linkStyles}>
            <Link to={link.to} className="[&.active]:font-bold">
              {link.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
