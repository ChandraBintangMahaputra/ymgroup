import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import SidebarCourseMenu from "./SidebarCourseMenu";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";

interface CourseData {
  title: string;
  category: string;
  description: string;
  creator: string | null;
}

const ViewCourse = () => {
  const { darkMode } = useDarkMode();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // SidebarAfterLogin state
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSidebarCourseOpen, setIsSidebarCourseOpen] = useState(false);

  const handleSidebarToggle = (isVisible: boolean) => {
    setIsSidebarCourseOpen(isVisible);
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      console.log("sidebar", isSidebarCourseOpen)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/view-course/${id}`
        );
        if (response.data.success) {
          setCourseData(response.data.data[0]);
          setTitle(response.data.data[0].title);
          setContent(response.data.data[0].description);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchCourse();
  }, [id]);

  const updateContent = (newTitle: string, newContent: string) => {
    setTitle(newTitle);
    setContent(newContent);
  };

  const resetContent = () => {
    if (courseData) {
      setTitle(courseData.title);
      setContent(courseData.description);
    }
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Sidebar */}
      <SidebarAfterLogin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex flex-col w-full lg:flex-grow">
        {/* Header remains fixed */}
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />

        {/* Flex container for main content */}
        <div className="flex h-screen">
          <main className="flex-grow p-4 overflow-y-auto">
            {courseData ? (
              <div className="course-view">
                <h1
                  className={`text-2xl text-center mt-5 ${darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  [ {courseData.category} ]
                </h1>
                <h1 className="text-center text-4xl lg:text-7xl font-bold mb-8 mt-5">
                  {title}
                </h1>

                <div className="flex justify-center">
                  <hr
                    className={`w-1/2 border-t-2 mb-10 mt-10 ${darkMode ? "border-white" : "border-black"
                      }`}
                  />
                </div>

                <div
                  className="course-content p-10 lg:p-20"
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              </div>
            ) : (
              <p>Loading course...</p>
            )}
          </main>

          {/* Sidebar Course Menu on the right (Desktop) */}
          <div className="lg:w-1/4 flex-shrink-0 lg:h-full lg:z-999 hidden md:hidden md:flex-shrink-0 lg:block">
            <SidebarCourseMenu
              courseId={id!}
              updateContent={updateContent}
              resetContent={resetContent}
              onSidebarToggle={handleSidebarToggle}
            />
          </div>

          {/* Sidebar Course Menu on the right (Mobile) */}
          <div className={`${isSidebarCourseOpen ? "fixed" : ""} right-0 h-full w-64 lg:w-1/4 lg:hidden transition-transform duration-300`}>
            <SidebarCourseMenu
              courseId={id!}
              updateContent={updateContent}
              resetContent={resetContent}
              onSidebarToggle={handleSidebarToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
