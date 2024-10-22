import { useState, useEffect } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useDarkMode } from '../../../constants/DarkModeProvider';
import { v4 as uuidv4 } from 'uuid'; 


interface token {
  id: number;
  token: string;
  expired: string;
  date_created: string;

}

const TokenAdmin = () => {
  const { darkMode } = useDarkMode(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<token[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddtokenModalOpen, setIsAddtokenModalOpen] = useState(false);
  const [newtokenDescription, setNewtokenDescription] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState("");
  const itemsPerPage = 5;

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
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/security/get-token-admin`
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    };
    fetchData();
  }, []);

  const generateToken = () => {
    const generatedToken = uuidv4(); // generate random token
    setNewtokenDescription(generatedToken);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Hapus data?',
      text: "Data yang terhapus tidak dapat dikembalikan",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/security/delete-token-admin/${id}`
          );
          if (response.data.success) {
            Swal.fire('Deleted!', 'token berhasil dihapus.', 'success').then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire('Error', 'Gagal menghapus data.', 'error');
          }
        } catch (error) {
          console.error('Error deleting token:', error);
          Swal.fire('Error', 'Terjadi kesalahan saat menghapus data.', 'error');
        }
      }
    });
  };
  

  const filteredData = data.filter((item) =>
    item.date_created.toLowerCase().includes(searchTerm.toLowerCase())
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



  const handleAddtokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/security/add-token-admin`,
        { token: newtokenDescription, expired: tokenExpiration },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        Swal.fire("Success", "token added successfully", "success").then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add token", "error");
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <SidebarAfterLogin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="w-full lg:w-auto lg:flex-grow">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />
        <main className="p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">token Management</h1>
          </div>
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search..."
              className={`border p-2 rounded mb-2 ${darkMode ? 'bg-gray-700': 'bg-white'}`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className={`px-4 py-2 rounded ${darkMode ? "bg-gray-600 text-white" : "bg-blue-600 text-white"}`}
              onClick={() => setIsAddtokenModalOpen(true)}
            >
              Add token
            </button>
          </div>
          <div className={`shadow-lg rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="overflow-x-auto">
              <table className={`min-w-full border ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <thead>
                  <tr>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">token</th>
                    <th className="border px-4 py-2">expired</th>
                    <th className="border px-4 py-2">date_created</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border px-2 py-1">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="border px-2 py-1">{item.token}</td>
                        <td className="border px-2 py-1">{item.expired}</td>
                        <td className="border px-2 py-1">{item.date_created}</td>
                        <td className="border px-2 py-1">
                          <div className="flex space-x-2">
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

        {isAddtokenModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className={`rounded-lg m-6 p-4 max-w-lg w-full ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                <h2 className="text-lg font-semibold mb-4">Add Token</h2>
                <form onSubmit={handleAddtokenSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Token</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={newtokenDescription}
                        onChange={(e) => setNewtokenDescription(e.target.value)}
                        className={`border rounded w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={generateToken}
                        className={`ml-2 px-4 py-2 rounded ${darkMode ? "bg-gray-600 text-white" : "bg-blue-600 text-white"}`}
                      >
                        Auto Generate
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Expired</label>
                    <input
                      type="datetime-local"
                      value={tokenExpiration}
                      onChange={(e) => setTokenExpiration(e.target.value)}
                      className={`border rounded w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                      required
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddtokenModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add Token
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default TokenAdmin;
