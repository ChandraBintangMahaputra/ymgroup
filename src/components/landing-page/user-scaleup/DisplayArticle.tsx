import HeaderAfterLogin from '../HeaderAfterLogin';
import SidebarAfterLogin from '../SidebarAfterLogin';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../constants/DarkModeProvider';

// Interface for Article
interface Article {
  article_id: number;
  article_title: string;
  article_date_create: string;
}

const DisplayArticle = () => {
  const navigate = useNavigate()
  const {darkMode} = useDarkMode()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]); // Ensure articles is always an array
  const [category, setCategory] = useState('null');
  const [date, setDate] = useState('null');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/article/display-article/${category}/${date}`
      );
      
      if (response.data.success && Array.isArray(response.data.data)) {
        // Ensure response data is an array before setting articles
        setArticles(response.data.data);
      } else {
        // If data is not an array, set articles as an empty array
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]); // Set articles as empty array on error
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category, date]);

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <SidebarAfterLogin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

      <div className="w-full lg:w-auto lg:flex-grow">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />

        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4">Artikel</h1>

          {/* Filter section */}
          <div className="flex mb-4 space-x-4">
            <select
              className={`border p-2 rounded ${darkMode ? "bg-gray-600" : "bg-white"}`}
              value={category}
              onChange={(e) => setCategory(e.target.value || 'null')}
            >
              <option value="null">Semua Kategori</option>
              <option value="Capaian Unggulan">Capaian Unggulan</option>
              <option value="Beasiswa">Beasiswa</option>
              <option value="Kepemimpinan">Kepemimpinan</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <input
              type="date"
              className={`border p-2 rounded ${darkMode ? "bg-gray-600" : "bg-white"}`}
              onChange={(e) => setDate(e.target.value || 'null')}
            />
          </div>

          {/* Article Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                Data tidak ada
              </div>
            ) : (
              articles.map((article) => (
                <div
                  key={article.article_id}
                  className="p-6 border rounded shadow-md transition-transform transform hover:scale-102 hover:border-blue-500 transition duration-300"
                  onClick={() => navigate(`/view-article/${btoa(article.article_id.toString())}`)}
                >
                  <h2 className="text-xl font-semibold">{article.article_title}</h2>
                  <p className="text-gray-500">{article.article_date_create}</p>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DisplayArticle;
