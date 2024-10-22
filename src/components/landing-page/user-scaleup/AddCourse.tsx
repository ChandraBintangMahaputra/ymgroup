import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useDarkMode } from "../../../constants/DarkModeProvider";


const AddCourse = () => {
    const {darkMode} = useDarkMode()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [courseContent, setcourseContent] = useState("");
  
    const { register, handleSubmit, reset } = useForm();
    const [userId, setUserId] = useState<string | null>(null);
  
    useEffect(() => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserId(parsedUserData.id);
      }
    }, []);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const onSubmit = async (data: any) => {
      try {
        const payload = {
          ...data,
          description: courseContent,
          creator: userId
        };
        await axios.post(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/add-course`,
          payload
        );
  
        // Show success message
        Swal.fire("Success", "Your course has been submitted", "success");
  
        // Reset the form
        reset();
        setcourseContent(""); // Reset rich text editor
      } catch (error) {
        console.error("Error submitting course:", error);
        Swal.fire("Error", "Failed to submit the course", "error");
      }
    };
  
    return (
      <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        {/* Sidebar */}
        <SidebarAfterLogin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
  
        {/* Main content area */}
        <div className="flex-grow flex flex-col">
          <HeaderAfterLogin toggleSidebar={toggleSidebar} />
  
          {/* Main section */}
          <main className="flex-grow overflow-y-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Add course</h2>
  
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <div className="mb-4">
                <label
                  className="block font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title", { required: true })}
                  className={`border rounded w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  placeholder="Enter course title"
                />
              </div>
  
              {/* Category */}
              <div className="mb-4">
                <label
                  className="block font-bold mb-2"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  id="category"
                  {...register("category", { required: true })}
                  className={`border rounded w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                >
                  <option value="" disabled selected>
                    Select a category
                  </option>
                  <option value="Capaian Unggulan">Capaian Unggulan</option>
                  <option value="Beasiswa">Beasiswa</option>
                  <option value="Kepemimpinan">Kepemimpinan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block font-bold mb-2"
                  htmlFor="selling_point"
                >
                  Selling Point
                </label>
                <input
                  type="text"
                  id="seling_point"
                  {...register("selling_point", { required: true })}
                  className={`border rounded w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  placeholder="Enter course selling point"
                />
              </div>
  
  
              {/* course */}
              <div className="mb-6">
                <label
                  className="block font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={courseContent}
                  onChange={setcourseContent}
                  className={`h-60 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
                />
              </div>
  
              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 mt-20 lg:mt-10 rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </main>
        </div>
      </div>
    );
}

export default AddCourse