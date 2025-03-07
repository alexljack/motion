import React from "react";

const TopBar = () => {
  return (
    <div className="h-12 bg-red-500 w-full p-3">
      <div className="w-full flex justify-end gap-2">
        <div>Notifications</div>
        <div>Language</div>
        <div>Avatar</div>
      </div>
    </div>
  );
};

export default TopBar;
