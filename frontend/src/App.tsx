import { Outlet } from "@tanstack/react-router";

import "./App.css";
import { Sidebar } from "./ui";

function App() {
  return (
    <div className="outline h-screen w-full flex">
      <Sidebar />
      <div className="py-3 px-6 w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
