import { useState } from "react";
import { Link } from "@tanstack/react-router";

import cn from "../../utils/cn";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const linkStyles = cn(
    "bg-blue-500 h-11 p-2 rounded-lg flex items-center justify-center transition-all duration-300",
    collapsed ? "w-11" : "w-48"
  );

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
        <div className={linkStyles}>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </div>
        <div className={linkStyles}>
          <Link to="/exercises" className="[&.active]:font-bold">
            Exercises
          </Link>
        </div>
        <div className={linkStyles}>
          {" "}
          <Link to="/workouts" className="[&.active]:font-bold">
            Workouts
          </Link>
        </div>
        <div className={linkStyles}>
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
