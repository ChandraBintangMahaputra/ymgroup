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

const EditArticle = () => {
  const {darkMode} = useDarkMode()
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [articleContent, setArticleContent] = useState("");
  const { register, handleSubmit, setValue } = useForm();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
  }, []);

  // Fetch article data when component mounts
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/article/detail-article/${id}`
        );
        if (response.data.success) {
          const article = response.data.data[0];
          setValue("title", article.title);
          setValue("category", article.category);
          setArticleContent(article.article);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        Swal.fire("Error", "Failed to load article data", "error");
      }
    };

    fetchArticle();
  }, [id, setValue]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onSubmit = async (data: any) => {
    try {
      // Prepare payload with only changed data
      const payload = {
        title: data.title !== "" ? data.title : undefined,
        category: data.category !== "" ? data.category : undefined,
        article: articleContent,
        creator: userId,
      };

      // Filter out undefined properties
      const filteredPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      );

      await axios.put(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/article/edit-article/${id}`,
        filteredPayload
      );

      // Show success message
      Swal.fire("Success", "Your article has been submitted", "success");

 // Reset rich text editor
    } catch (error) {
      console.error("Error submitting article:", error);
      Swal.fire("Error", "Failed to submit the article", "error");
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
          <h2 className="text-2xl font-bold mb-4">Edit Article</h2>

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
                placeholder="Enter article title"
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
                <option value="" disabled>
                  Select a category
                </option>
                <option value="Capaian Unggulan">Capaian Unggulan</option>
                <option value="Beasiswa">Beasiswa</option>
                <option value="Kepemimpinan">Kepemimpinan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Article */}
            <div className="mb-6">
              <label
                className="block font-bold mb-2"
                htmlFor="article"
              >
                Article
              </label>
              <ReactQuill
                theme="snow"
                value={articleContent}
                onChange={setArticleContent}
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
};

export default EditArticle;
