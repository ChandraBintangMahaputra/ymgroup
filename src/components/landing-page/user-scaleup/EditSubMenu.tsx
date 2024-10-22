import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useParams } from "react-router-dom";
import { useDarkMode } from "../../../constants/DarkModeProvider";


const EditSubMenu = () => {
    const {darkMode} = useDarkMode()
    const { id } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [submenuContent, setsubmenuContent] = useState("");
    const { register, handleSubmit, setValue } = useForm();

  
    useEffect(() => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        // const parsedUserData = JSON.parse(storedUserData);
        // setUserId(parsedUserData.id);
      }
    }, []);
  
    // Fetch submenu data when component mounts
    useEffect(() => {
      const fetchsubmenu = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/detail-sub-menu-course/${id}`
          );
          if (response.data.success) {
            const submenu = response.data.data[0];
            setValue("description", submenu.description);
            setsubmenuContent(submenu.course_content);
          }
        } catch (error) {
          console.error("Error fetching submenu:", error);
          Swal.fire("Error", "Failed to load submenu data", "error");
        }
      };
  
      fetchsubmenu();
    }, [id, setValue]);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const onSubmit = async (data: any) => {
      try {
        // Prepare payload with only changed data
        const payload = {
          description: data.description !== "" ? data.description : undefined,
          course_content: submenuContent
        };
  
        // Filter out undefined properties
        const filteredPayload = Object.fromEntries(
          Object.entries(payload).filter(([_, v]) => v !== undefined)
        );
  
        await axios.put(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/edit-sub-menu-course/${id}`,
          filteredPayload
        );
  
        // Show success message
        Swal.fire("Success", "Your submenu has been submitted", "success");
  
   // Reset rich text editor
      } catch (error) {
        console.error("Error submitting submenu:", error);
        Swal.fire("Error", "Failed to submit the submenu", "error");
      }
    };
  
    return (
      <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        {/* Sidebar */}
        <SidebarAfterLogin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
  
        {/* Main content area */}
        <div className="flex-grow">
          <HeaderAfterLogin toggleSidebar={toggleSidebar} />
  
          {/* Main section */}
          <main className="flex-grow overflow-y-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Edit submenu</h2>
  
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* description */}
              <div className="mb-4">
                <label
                  className="block font-bold mb-2"
                  htmlFor="description"
                >
                  Sub Menu
                </label>
                <input
                  type="text"
                  id="description"
                  {...register("description", { required: true })}
                  className={`border rounded w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  placeholder="Enter submenu name"
                />
              </div>
  
  
              {/* submenu */}
              <div className="mb-6">
                <label
                  className="block font-bold mb-2"
                  htmlFor="submenu"
                >
                  submenu
                </label>
                <ReactQuill
                  theme="snow"
                  value={submenuContent}
                  onChange={setsubmenuContent}
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

export default EditSubMenu