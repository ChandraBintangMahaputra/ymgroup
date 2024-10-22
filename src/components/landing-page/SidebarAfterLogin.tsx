import { useState, useEffect } from "react";
import {
  FaHome,
  FaBook,
  FaComments,
  FaNewspaper,
  FaChevronDown,
  FaTimes,
  FaBookReader,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { IoDocumentText } from "react-icons/io5";

interface SidebarAfterLoginProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarAfterLogin = ({
  isSidebarOpen,
  toggleSidebar,
}: SidebarAfterLoginProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [openMaster, setOpenMaster] = useState(false); // State to toggle Master submenu
  const [openArticle, setOpenArticle] = useState(false); // State to toggle Article submenu
  const [openReport, setOpenReport] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserRole(parsedUserData.role);
    }
  }, []);

  console.log("ini role", userRole);

  // Handle screen resizing to determine mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile threshold (768px)
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Only render the sidebar if it's not mobile or the sidebar is open on mobile
  if (isMobile && !isSidebarOpen) {
    return null; // Hide sidebar on mobile when not open
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-gray-700 text-white h-screen p-4 overflow-y-auto transition-all duration-300 ${
        isMobile
          ? isSidebarOpen
            ? "fixed top-0 left-0 z-50 w-64" // Sidebar appears on mobile if open
            : "w-0" // Hide sidebar when closed on mobile
          : isSidebarOpen || isHovering
          ? "w-64" // Default full width on desktop
          : "w-20" // Collapsed on desktop
      }`}
    >
      {/* Close Icon for Mobile */}
      {isMobile && isSidebarOpen && (
        <div className="flex justify-end mb-5 mt-5">
          <FaTimes className="text-xl cursor-pointer" onClick={toggleSidebar} />
        </div>
      )}
      {/* Sidebar Menu */}
      <nav className="space-y-2 h-full">
        <NavLink
          to="/beranda"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
              isActive ? "bg-gray-600" : ""
            }`
          }
        >
          <FaHome className="text-xl" />
          <span
            className={`${
              isSidebarOpen || isHovering ? "block ml-2" : "hidden"
            } font-bold`}
          >
            Beranda
          </span>
        </NavLink>

        {/* Master Dropdown */}
        {userRole === "SuperAdmin" && (
          <div>
            <div
              className="flex items-center p-2 rounded-md cursor-pointer transition duration-200 hover:bg-gray-600"
              onClick={() => setOpenMaster(!openMaster)} // Toggle Master submenu
            >
              <FaBook className="text-xl" />
              <span
                className={`${
                  isSidebarOpen || isHovering ? "block ml-2" : "hidden"
                } font-bold`}
              >
                Master
              </span>
              <FaChevronDown
                className={`ml-auto transform transition-transform ${
                  openMaster ? "rotate-180" : "rotate-0"
                } ${isSidebarOpen || isHovering ? "block" : "hidden"}`}
              />
            </div>
            <ul
              className={`ml-6 mt-1 space-y-1 ${
                (openMaster && isSidebarOpen) || (openMaster && isHovering)
                  ? "block"
                  : "hidden"
              }`}
            >
              {/* Master Submenu Items */}
              <li>
                <NavLink
                  to="/master-authorization"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Master Authorization
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/master-role"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Master Role
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/master-faculty"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Master Faculty
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/master-prodi"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Master Study Program
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {/* Report Dropdown */}
        {userRole === "SuperAdmin" && (
          <div>
            <div
              className="flex items-center p-2 rounded-md cursor-pointer transition duration-200 hover:bg-gray-600"
              onClick={() => setOpenReport(!openReport)} // Toggle Master submenu
            >
              <IoDocumentText className="text-xl" />
              <span
                className={`${
                  isSidebarOpen || isHovering ? "block ml-2" : "hidden"
                } font-bold`}
              >
                Report
              </span>
              <FaChevronDown
                className={`ml-auto transform transition-transform ${
                  openReport ? "rotate-180" : "rotate-0"
                } ${isSidebarOpen || isHovering ? "block" : "hidden"}`}
              />
            </div>
            <ul
              className={`ml-6 mt-1 space-y-1 ${
                (openReport && isSidebarOpen) || (openReport && isHovering)
                  ? "block"
                  : "hidden"
              }`}
            >
              {/* Master Submenu Items */}
              <li>
                <NavLink
                  to="/report-article"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Report Article
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/report-course"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Report Course
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/report-discuss"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Report Discuss
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/report-pelanggaran"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Report Pelanggaran
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/generate-token-admin"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Token Admin
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/send-email"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Send Email
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {/* Discussion Link */}
        <NavLink
          to="/discussion"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
              isActive ? "bg-gray-600" : ""
            }`
          }
        >
          <FaComments className="text-xl" />
          <span
            className={`${
              isSidebarOpen || isHovering ? "block ml-2" : "hidden"
            } font-bold`}
          >
            Discussion
          </span>
        </NavLink>

        {/* Article Dropdown */}
        <div>
          <div
            className="flex items-center p-2 rounded-md cursor-pointer transition duration-200 hover:bg-gray-600"
            onClick={() => setOpenArticle(!openArticle)} // Toggle Article submenu
          >
            <FaNewspaper className="text-xl" />
            <span
              className={`${
                isSidebarOpen || isHovering ? "block ml-2" : "hidden"
              } font-bold`}
            >
              Article
            </span>
            <FaChevronDown
              className={`ml-auto transform transition-transform ${
                openArticle ? "rotate-180" : "rotate-0"
              } ${isSidebarOpen || isHovering ? "block" : "hidden"}`}
            />
          </div>
          <ul
            className={`ml-6 mt-1 space-y-1 ${
              (openArticle && isSidebarOpen) || (openArticle && isHovering)
                ? "block"
                : "hidden"
            }`}
          >
            {/* Article Submenu Items */}
            {(userRole === "SuperAdmin" || userRole === "Admin") && (
              <li>
                <NavLink
                  to="/list-article"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Buat Article
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/display-article"
                className={({ isActive }) =>
                  `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                Article
              </NavLink>
            </li>
          </ul>
        </div>

        {/*Course Menu*/}
        <div>
          <div
            className="flex items-center p-2 rounded-md cursor-pointer transition duration-200 hover:bg-gray-600"
            onClick={() => setOpenCourse(!openCourse)}
          >
            <FaBookReader className="text-xl" />
            <span
              className={`${
                isSidebarOpen || isHovering ? "block ml-2" : "hidden"
              } font-bold`}
            >
              Course
            </span>
            <FaChevronDown
              className={`ml-auto transform transition-transform ${
                openCourse ? "rotate-180" : "rotate-0"
              } ${isSidebarOpen || isHovering ? "block" : "hidden"}`}
            />
          </div>
          <ul
            className={`ml-6 mt-1 space-y-1 ${
              (openCourse && isSidebarOpen) || (openCourse && isHovering)
                ? "block"
                : "hidden"
            }`}
          >
            {(userRole === "SuperAdmin" || userRole === "Admin") && (
              <li>
                <NavLink
                  to="/list-course"
                  className={({ isActive }) =>
                    `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                      isActive ? "bg-gray-600" : ""
                    }`
                  }
                >
                  Buat Course
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/display-course"
                className={({ isActive }) =>
                  `block p-2 rounded-md transition duration-200 hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                Course
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default SidebarAfterLogin;
