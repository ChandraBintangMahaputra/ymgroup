import React from "react";
import Sidebar from "../../ui/Sidebar";
import Navbar from "../../ui/Navbar";
import { useSidebar } from "../../../contexts/SidebarContext";
import Dashboard from "./Dashboard";

const Beranda: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const adminName = userData.name || "Admin";

  return (
    <div className="flex">
      <Sidebar />
      <div
        className={`flex-1 p-6 pt-20 transition-all duration-300`}
        style={{
          paddingLeft: isSidebarOpen ? '18rem' : '6rem',
        }}
      >
        <Navbar />
        <h2 className="text-2xl font-bold">Welcome, {adminName}</h2>
        <Dashboard />
      </div>
    </div>
  );
};

export default Beranda;
