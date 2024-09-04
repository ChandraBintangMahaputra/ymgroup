import React from "react";
import { FaBars } from "react-icons/fa";
import { useSidebar } from "../../contexts/SidebarContext";


const Navbar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const adminName = userData.name || "Admin";

  return (
    <div className="grid grid-cols-[auto,1fr]">
      <nav
        className="bg-white fixed shadow-md p-4 flex justify-between items-center transition-all duration-300"
        style={{
          top: 0,
          left: isSidebarOpen ? "16rem" : "5.5rem",
          width: `calc(100% - ${isSidebarOpen ? "16rem" : "5.5rem"})`,
          transition: "left 0.3s ease, width 0.3s ease",
          zIndex: 1
        }}
      >
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-black mr-2 pr-8">
            <FaBars size={24} />
          </button>
        </div>
        <div className="flex items-center ml-auto">
          <span className="text-black font-bold pr-4">{adminName}</span>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
