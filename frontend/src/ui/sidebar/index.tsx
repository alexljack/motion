import { useState } from "react";
import { Link } from "@tanstack/react-router";
import cn from "../../utils/cn";
import { navLinks } from "./links";
import Button from "../button/button";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const linkStyles = cn(
    "bg-white rounded-lg flex items-center justify-center transition-all duration-300",
    collapsed ? "w-11" : "w-48",
  );

  return (
    <div
      className={cn(
        "hidden lg:flex h-dvh bg-white py-2 px-2 flex-col transition-all duration-300 drop-shadow-lg drop-shadow-gray-500",
        collapsed ? "w-16" : "w-52",
      )}
    >
      <div
        className="flex items-center justify-center bg-white text-black italic h-12 mb-6 text-2xl select-none cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {!collapsed ? (
          <span className="font-semibold italic">Motion</span>
        ) : (
          <img src="/assets/logo-light.png" className="size-12" />
        )}
      </div>
      <div className="h-full flex flex-col gap-2">
        {navLinks.map((link) => (
          <div key={link.to} className={linkStyles}>
            <Button className="w-full p-0" variant="ghost">
              <Link
                to={link.to}
                className="p-2 [&.active]:font-bold w-full flex gap-2 [&.active]:bg-black [&.active]:text-white justify-center rounded-lg"
              >
                {/* {collapsed ? <link.icon /> : link.label} */}
                <link.icon /> {!collapsed && link.label}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
