import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  DumbbellIcon,
  WeightIcon,
  SportShoeIcon,
  ActivityIcon,
  AppleIcon,
  LayoutDashboardIcon,
} from "lucide-react";

import cn from "../../utils/cn";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const linkStyles = cn(
    "bg-white border h-11 p-2 rounded-lg flex items-center justify-center transition-all duration-300",
    collapsed ? "w-11" : "w-48",
  );

  const links = [
    { to: "/", label: "Home", icon: LayoutDashboardIcon },
    { to: "/exercises", label: "Exercises", icon: DumbbellIcon },
    { to: "/workouts", label: "Workouts", icon: WeightIcon },
    { to: "/my-logs", label: "Logs", icon: SportShoeIcon },
    { to: "/sleep", label: "Sleep", icon: ActivityIcon },
    { to: "/nutrition", label: "Nutrition", icon: AppleIcon },
  ];

  return (
    <div
      className={cn(
        "h-dvh bg-white py-2 px-2 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-52",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-orange-600 text-white italic size-12 mb-6 text-2xl select-none",
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="font-semibold">M</span>
      </div>
      <div className="h-full flex flex-col gap-2">
        {links.map((link) => (
          <div key={link.to} className={linkStyles}>
            <Link to={link.to} className="[&.active]:font-bold">
              {collapsed ? <link.icon /> : link.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
