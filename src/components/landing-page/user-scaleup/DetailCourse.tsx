import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import Swal from "sweetalert2";

const DetailCourse = () => {
  const { id: id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMenuExist, setMenuExist] = useState(false);
  const [isQuizExist, setQuizExist] = useState(false);
  const [isEnrollExist, setEnrollExist] = useState(false);

  console.log("is quiz", isQuizExist);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchMenuCourses = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/course/check-menu-course/${id}`
      );

      console.log("ini menu respon", response.data);

      if (
        response.data.success === true &&
        response.data.data !== "record not found"
      ) {
        setMenuExist(true);
      } else {
        setMenuExist(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const [userId, setUserId] = useState<string | null>(null);

const storeUserdata = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData?.id) {
        setUserId(parsedUserData.id);
        resolve(parsedUserData.id); // return the userId
      } else {
        console.error("User ID not found in stored data");
        resolve(null);
      }
    } else {
      console.error("No userData found in localStorage");
      resolve(null);
    }
  });
};

useEffect(() => {
  storeUserdata();
}, []);

const checkEnroll = async () => {
  const currentUserId = await storeUserdata(); // wait for the userId
  if (currentUserId) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/check-user-enroll/${id}/${currentUserId}`
      );

      console.log("ini enroll", response.data);

      if (
        response.data.success === true &&
        response.data.data !== "record not found"
      ) {
        setEnrollExist(true);
      } else {
        setEnrollExist(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setEnrollExist(false);
    }
  } else {
    console.error("User ID is not available");
  }
};

useEffect(() => {
  checkEnroll();
}, [userId]); // ensure that checkEnroll runs only when userId is set


  useEffect(() => {
    fetchMenuCourses();
  }, []);

  const fetchQuizCourses = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/course/check-quiz-course/${id}`
      );

      console.log("ini quiz respon", response.data);

      if (
        response.data.success === true &&
        response.data.data !== "record not found"
      ) {
        setQuizExist(true);
      } else {
        setQuizExist(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchQuizCourses();
  }, []);

  const handleEnroll = async () => {
    Swal.fire({
      title: "Enroll Course?",
      text: "Akses materi akan dibuka setelah enroll berhasil",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Enroll",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/add-enroll`,
            {
              user_id: userId,
              course_id: id,
            }
          );
          if (response.data.success) {
            Swal.fire("Berhasil!", "Course berhasil dienroll", "success").then(
              () => {
                window.location.reload();
              }
            );
          } else {
            Swal.fire("Error", "Course gagal dienroll", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Terjadi kesalahan saat enroll", "error");
        }
      }
    });
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <SidebarAfterLogin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="w-full lg:w-auto lg:flex-grow">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />

        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4">Course</h1>
          {isEnrollExist === false && (
            <>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
                onClick={() => handleEnroll()}
              >
                Enroll Course
              </button>
            </>
          )}

          {/* course Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isMenuExist === false && isQuizExist === false && (
              <div className="col-span-full text-center text-gray-500">
                Data tidak ada
              </div>
            )}
            {isMenuExist === true && (
              <div
                className={`p-6 border rounded shadow-md transition-transform transform hover:scale-102 hover:border-blue-500 transition duration-300 ${
                  isEnrollExist === false ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => isEnrollExist === true && navigate(`/view-course/${id}`)} // Disable click if not enrolled
              >
                <h2 className="text-xl font-semibold">Materi</h2>
              </div>
            )}

            {isQuizExist === true && (
              <div
                className={`p-6 border rounded shadow-md transition-transform transform hover:scale-102 hover:border-blue-500 transition duration-300 ${
                  isEnrollExist === false ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  isEnrollExist === true && navigate(`/list-quiz-course/${id}`)
                } // Disable click if not enrolled
              >
                <h2 className="text-xl font-semibold">Quiz</h2>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailCourse;
