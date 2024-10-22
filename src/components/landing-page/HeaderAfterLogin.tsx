import { useState, useEffect } from "react";
import {
  FaUser,
  FaMoon,
  FaSun,
  FaBars,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDarkMode } from "../../constants/DarkModeProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { HiBars3BottomLeft } from "react-icons/hi2";

interface HeaderAfterLoginProps {
  toggleSidebar: () => void;
}

const HeaderAfterLogin = ({ toggleSidebar }: HeaderAfterLoginProps) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [isToggleSidebarClick, setToggleSidebarClick] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const handleLogout = () => {
    // Tampilkan swal konfirmasi
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna mengonfirmasi, lakukan logout
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("darkMode");
        navigate("/login");

        Swal.fire("Logged out!", "You have been logged out.", "success");
      }
    });
  };

  const toggleSidebarClick = () => {
    toggleSidebar;
    if (isToggleSidebarClick === false) {
      setToggleSidebarClick(true);
    } else if (isToggleSidebarClick === true) {
      setToggleSidebarClick(false);
    } else {
      setToggleSidebarClick(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      className={`flex justify-between items-center overflowo-hidden p-4 ${
        darkMode ? "bg-gray-600" : "bg-gray-800"
      } text-white`}
    >
      {isDesktop ? (
        isToggleSidebarClick ? (
          <FaBars
            className="cursor-pointer"
            onClick={() => {
              toggleSidebarClick();
              toggleSidebar();
            }}
          />
        ) : (
          <HiBars3BottomLeft
            className="cursor-pointer"
            size={30}
            onClick={() => {
              toggleSidebarClick();
              toggleSidebar();
            }}
          />
        )
      ) : (
        <HiBars3BottomLeft
          className="cursor-pointer"
          size={20}
          onClick={() => {
            toggleSidebarClick();
            toggleSidebar();
          }}
        />
      )}

      <div className="relative flex items-center space-x-4 pr-2 lg:pr-20">
        {darkMode ? (
          <FaSun
            className="cursor-pointer mr-1 lg:mr-2"
            onClick={toggleDarkMode}
          />
        ) : (
          <FaMoon
            className="cursor-pointer mr-1 lg:mr-2"
            onClick={toggleDarkMode}
          />
        )}
        <div className="relative">
          <FaUser className="cursor-pointer" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-30 bg-white text-gray-800 rounded-lg shadow-lg z-10">
              <ul>
                <li
                  className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <FaUser className="mr-2" /> Profile
                </li>
                <li
                  className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate("/setting")}
                >
                  <FaCog className="mr-2" /> Setting
                </li>
                <li
                  className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderAfterLogin;
