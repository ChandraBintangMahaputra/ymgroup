import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";

// Define the interface for article data
interface ArticleData {
  title: string;
  category: string;
  article: string;
  date_created: string;
  total_visitor: number | null;
  creator: string | null;
}

const ViewArticle = () => {
  const { darkMode } = useDarkMode();
  const { id } = useParams();
  const decodedId = atob(id!); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [articleData, setArticleData] = useState<ArticleData | null>(null); // Use the interface

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch article data from API

  useEffect(() => {
    if (decodedId) {
      // Encode the ID before sending it to the API
      
      const fetchArticle = async () => {
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/article/visitor-article/${decodedId}`
          );
          if (response.data.success) {
 
          }
        } catch (error) {
          console.error("Error fetching article:", error);
        }
      };

      fetchArticle();
    }
  }, [decodedId]);

  useEffect(() => {
    if (decodedId) {
      // Encode the ID before sending it to the API
      
      const fetchArticle = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/article/view-article/${decodedId}`
          );
          if (response.data.success) {
            setArticleData(response.data.data[0]);
          }
        } catch (error) {
          console.error("Error fetching article:", error);
        }
      };

      fetchArticle();
    }
  }, [decodedId]);

  // Format date to desired format (e.g., 10 Oktober 2024)
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }; // Use correct types
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Sidebar */}
      <SidebarAfterLogin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content area */}
      <div className="w-full lg:w-auto lg:flex-grow">
        {/* Header remains fixed */}
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />

        {/* Scrollable main section of the page */}
        <main className="p-4 w-ful lg:w-full h-full overflow-y-auto">
          {articleData ? (
            <div className="article-view">
              {/* Article Title */}
              <h1 className={`text-2xl text-center mt-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                [ {articleData.category} ]
              </h1>
              <h1 className="text-center text-4xl lg:text-7xl font-bold mb-8 mt-5">
                {articleData.title}
              </h1>

              {/* Horizontal details section */}
              <div className="flex justify-center mb-6">
                <div className="text-left">
                  <div className="grid grid-cols-2 gap-x-4">
                    <p className="text-right">
                      <strong>Dibuat</strong>
                    </p>
                    <p className="text-left">
                      {formatDate(articleData.date_created)}
                    </p>
                    <p className="text-right">
                      <strong>Oleh</strong>
                    </p>
                    <p className="text-left">{articleData.creator || "An"}</p>
                    <p className="text-right">
                      <strong>Dilihat</strong>
                    </p>
                    <p className="text-left">
                      {articleData.total_visitor !== null
                        ? articleData.total_visitor
                        : 0}{" "}
                      kali
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <hr className={`w-1/2 border-t-2 mb-10 mt-10 ${darkMode ? "border-white" : "border-black"}`} />
              </div>

              {/* Article Content */}
              <div
                className="article-content p-10 lg:p-20"
                dangerouslySetInnerHTML={{ __html: articleData.article }}
              ></div>
            </div>
          ) : (
            <p>Loading article...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewArticle;
