import { useState, useEffect } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";


interface SubMenu {
  id: number;
  description: string;
}

const SubMenu = () => {
    const {id} = useParams()
    const {darkMode} = useDarkMode()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [data, setData] = useState<SubMenu[]>([]); // Ensure data is always an array
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          setIsSidebarOpen(true);
        } else {
          setIsSidebarOpen(false);
        }
      };
  
      handleResize(); // Initial check
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/list-sub-menu-course/${id}`
          );
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setData(result.data); // Make sure it's an array
          } else {
            setData([]); // Default to empty array if result is not valid
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setData([]); // Handle fetch error by setting an empty array
        }
      };
      fetchData();
    }, []);
  
    const handleDelete = async (id: number) => {
      Swal.fire({
        title: "Hapus data?",
        text: "Data yang terhapus tidak dapat dikembalikan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(
              `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/delete-sub-menu-course/${id}`
            );
            if (response.data.success) {
              Swal.fire("Deleted!", "Article berhasil dihapus.", "success").then(
                () => {
                  window.location.reload();
                }
              );
            } else {
              Swal.fire("Error", "Gagal menghapus data.", "error");
            }
          } catch (error) {
            console.error("Error deleting article:", error);
            Swal.fire("Error", "Terjadi kesalahan saat menghapus data.", "error");
          }
        }
      });
    };
  
    const filteredData = data.filter(
      (item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // Reset to the first page when searching
    };
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
        <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
          <SidebarAfterLogin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="w-full lg:w-auto lg:flex-grow">
            <HeaderAfterLogin toggleSidebar={toggleSidebar} />
            <main className="p-4 overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Sub Menu Management</h1>
              </div>
              <div className="flex justify-between mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className={`border p-2 rounded ${darkMode ? "bg-gray-600" : "bg-white"}`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/add-submenu/${id}`)}
                >
                  Add Sub Menu
                </button>
              </div>
              <div className={`shadow-lg rounded-lg p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                <div className="overflow-x-auto">
                  <table className={`min-w-full border ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                          <tr key={item.id}>
                            <td className="border px-2 py-1">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="border px-2 py-1">{item.description}</td>
                            <td className="border px-2 py-1">
                              <div className="flex space-x-2">
                                <button
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() => navigate(`/edit-submenu/${item.id}`)}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center p-4">
                            No data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-between mt-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      );
}

export default SubMenu