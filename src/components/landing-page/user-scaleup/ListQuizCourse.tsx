import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import { useParams } from "react-router-dom";

interface QuizCourse {
  id: number;
  description: string;
}

const ListQuizCourse = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState<QuizCourse[]>([]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/list-quiz-course/${courseId}`
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [courseId]);

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <SidebarAfterLogin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-grow">
        <HeaderAfterLogin toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4">Quiz Course</h1>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 px-3">
            {courses.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                Data tidak ada
              </div>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 border rounded shadow-md relative transition-transform transform hover:scale-102 hover:border-blue-500 transition duration-300"
                  onClick={() => navigate(`/quiz-intro/${course.id}`)}
                >
                  <h2 className="text-xl font-semibold">{course.description}</h2>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListQuizCourse;
