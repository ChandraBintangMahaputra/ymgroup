import { useState, useEffect } from "react";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";

interface MenuItem {
  menu_name: string;
  sub_menu_name: string;
  menu_id: number;
  nomor_urut_by_menu: number;
  course_name: string;
  submenu_id: number;
}

interface SidebarCourseMenuProps {
  courseId: string;
  updateContent: (title: string, content: string) => void;
  resetContent: () => void;
  onSidebarToggle: (isVisible: boolean) => void;
}

const SidebarCourseMenu = ({ courseId, updateContent, resetContent, onSidebarToggle }: SidebarCourseMenuProps) => {
  const { darkMode } = useDarkMode();
  const [menus, setMenus] = useState<{ [key: string]: MenuItem[] }>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchSidebarMenu = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/sidebar-course/${courseId}`
        );
        if (response.data.success) {
          const menuData: MenuItem[] = response.data.data;
          const organizedMenu = menuData.reduce((acc, item) => {
            if (!acc[item.menu_name]) acc[item.menu_name] = [];
            acc[item.menu_name].push(item);
            return acc;
          }, {} as { [key: string]: MenuItem[] });
          setMenus(organizedMenu);
        }
      } catch (error) {
        console.error("Error fetching sidebar menu:", error);
      }
    };
    fetchSidebarMenu();
  }, [courseId]);

  const handleSubmenuClick = async (submenuId: number, title: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/content-course/${submenuId}`
      );
      if (response.data.success) {
        const contentData = response.data.data[0];
        updateContent(title, contentData.course_content);
        setActiveSubmenu(submenuId);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const toggleSidebarVisibility = () => {
    setIsSidebarVisible((prev) => !prev);
    onSidebarToggle(!isSidebarVisible);
  };

  return (
    <div>
      <div className={`sidebar-course-menu p-4 h-screen shadow-lg rounded-lg transition-colors overflow-y-auto duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${isSidebarVisible ? 'block z-10' : 'hidden md:hidden lg:block'}`}>
        <div className="menu-description cursor-pointer mb-4" onClick={resetContent}>
          <h2 className="font-bold text-xl">Pengantar</h2>
        </div>

        <ul>
          {Object.keys(menus).map((menuName) => (
            <li key={menuName} className="mb-2">
              <div
                className={`cursor-pointer font-semibold p-4 rounded ${activeMenu === menuName ? 'bg-blue-200' : ''} hover:bg-blue-100 transition-colors duration-200`}
                onClick={() => toggleMenu(menuName)}
              >
                {menuName}
              </div>
              {activeMenu === menuName && (
                <ul className="ml-4">
                  {menus[menuName].map((submenu) => (
                    <li
                      key={submenu.submenu_id}
                      className={`cursor-pointer p-2 mt-4 rounded ${activeSubmenu === submenu.submenu_id ? 'bg-blue-300 text-white' : ''} hover:bg-blue-200 transition-colors duration-200`}
                      onClick={() => handleSubmenuClick(submenu.submenu_id, submenu.sub_menu_name)}
                    >
                      {submenu.sub_menu_name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg lg:hidden transition-transform duration-300 ${isSidebarVisible ? 'rotate-45' : ''}`}
        onClick={toggleSidebarVisibility}
      >
        +
      </button>
    </div>
  );
};

export default SidebarCourseMenu;
