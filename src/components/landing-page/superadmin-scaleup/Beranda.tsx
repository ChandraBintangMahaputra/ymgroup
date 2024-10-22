import { useState } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useDarkMode } from "../../../constants/DarkModeProvider"; // Import useDarkMode
import { useRef, useEffect } from "react";
import axios from "axios";
import DashboardSuperAdmin from "../Dashboard/DashboardSuperAdmin";
import DashboardAdmin from "../Dashboard/DashboardAdmin";
import DashboardUser from "../Dashboard/DashboardUser";

const Beranda = () => {
  const hasSentDate = useRef(false);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const sendDateToApi = async () => {
    const formattedDate = getCurrentDate();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/add-visitor`,
        {
          date: formattedDate,
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending date:", error);
    }
  };

  useEffect(() => {
    if (!hasSentDate.current) {
      sendDateToApi();
      hasSentDate.current = true;
    }
    document.title = "Scaling Yourself";
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { darkMode } = useDarkMode(); // Ambil status dark mode
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserRole(parsedUserData.role);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-gray-200"
      }`}
    >
      {/* Sidebar */}
      <SidebarAfterLogin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex-grow">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />

        {/* Main section of the page */}
        <main
          className={`p-4 w-ful lg:w-full h-full overflow-y-auto ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          {userRole === "SuperAdmin" && (
            <>
              <h1 className="text-2xl bold">Dashboard Super Admin</h1>
            </>
          )}
          {userRole === "SuperAdmin" && (
            <>
              <DashboardSuperAdmin />
            </>
          )}

          {userRole === "Admin" && (
            <>
              <h1 className="text-2xl bold">Dashboard Admin</h1>
            </>
          )}
          {userRole === "Admin" && (
            <>
              <DashboardAdmin />
            </>
          )}

          {userRole === "User" && (
            <>
              <h1 className="text-2xl bold">Dashboard User</h1>
            </>
          )}
          {userRole === "User" && (
            <>
              <DashboardUser />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Beranda;
