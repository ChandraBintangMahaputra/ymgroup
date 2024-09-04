import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaMoneyBill, FaDatabase, FaSignOutAlt } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { useSidebar } from "../../contexts/SidebarContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tpl } from "../../assets";

const Sidebar: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setShowLogoutConfirm(false);
    toast.success("Logout successful!");
    setTimeout(() => {
      window.location.href = "/#/admin/login";
    }, 1000);
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-22"
      } bg-white text-black flex flex-col h-screen shadow transition-all duration-300 fixed top-0 left-0 z-10`}
    >
      <div className="flex items-center justify-center h-16 shadow">
        <img src={tpl} alt="TPL Logo" className="h-10" />
      </div>
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-2">
            <Link
              to="/admin/beranda"
              className={`block px-4 py-2 rounded flex items-center ${
                location.pathname === "/admin/beranda"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaHome className="mr-2" />{" "}
              {isSidebarOpen && <span>Beranda</span>}
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin/payment"
              className={`block px-4 py-2 rounded flex items-center ${
                location.pathname === "/admin/payment"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaMoneyBill className="mr-2" />{" "}
              {isSidebarOpen && <span>Payment</span>}
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin/data"
              className={`block px-4 py-2 rounded flex items-center ${
                location.pathname === "/admin/data"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaDatabase className="mr-2" />{" "}
              {isSidebarOpen && <span>Company Visit</span>}
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin/students"
              className={`block px-4 py-2 rounded flex items-center ${
                location.pathname === "/admin/students"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <MdPeople className="mr-2" />{" "}
              {isSidebarOpen && <span>Students</span>}
            </Link>
          </li>
          <li>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="block px-4 py-2 rounded hover:bg-gray-700 w-full text-left hover:text-white flex items-center"
            >
              <FaSignOutAlt className="mr-2" />{" "}
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout confirmation popup */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div
            className="bg-white text-black p-6 rounded shadow-lg"
            style={{ zIndex: 10000 }}
          >
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
