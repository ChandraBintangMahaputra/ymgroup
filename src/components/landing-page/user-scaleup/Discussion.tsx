import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { AllDiscussion } from "./AllDiscussion";
import { useDarkMode } from "../../../constants/DarkModeProvider";

const Discussion = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
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

  const handleSubmit = async () => {
    if (!category || !description) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/add-discuss`,
        {
          user_id: userId,
          category,
          description,
        }
      );
      Swal.fire("Success", "Diskusi berhasil ditambahkan", "success");
      setCategory("");
      setDescription("");
      fetchData();
    } catch (error) {
      console.error("Error adding discussion:", error);
      Swal.fire("Error", "Diskusi gagal ditambahkan", "error");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/get-all-discuss`
      );
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
      } else {
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
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
        <main className="p-4 w-ful lg:w-full h-full overflow-y-auto">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-4">Buat Diskusi</h1>
            <div
              className={`shadow-md rounded-lg p-6 lg:w-full ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              {/* Dropdown Field */}
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className={`block text-sm font-medium ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`mt-1 block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  } ${window.innerWidth < 640 ? "text-xs" : ""}`}
                >
                  <option value="">Select Category</option>
                  <option value="Kepemimpinan">Kepemimpinan</option>
                  <option value="Capaian Unggulan">Capaian Unggulan</option>
                  <option value="Beasiswa">Beasiswa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Textarea Field */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className={`block text-sm font-medium ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                >
                  Discussion
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 mr-4"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Title and AllDiscussion Component */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Diskusi</h2>
            <AllDiscussion fetchDataDiscuss={fetchData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discussion;
