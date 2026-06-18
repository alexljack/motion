import { useState } from "react";
import { Link } from "@tanstack/react-router";
import cn from "../../utils/cn";
import { navLinks } from "./links";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const linkStyles = cn(
    "bg-white border h-11 p-2 rounded-lg flex items-center justify-center transition-all duration-300",
    collapsed ? "w-11" : "w-48",
  );

  return (
    <div
      className={cn(
        "hidden lg:flex h-dvh bg-white py-2 px-2 flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-52",
      )}
    >
      <div
        className="flex items-center justify-center bg-orange-600 text-white italic size-12 mb-6 text-2xl select-none cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="font-semibold">M</span>
      </div>
      <div className="h-full flex flex-col gap-2">
        {navLinks.map((link) => (
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
