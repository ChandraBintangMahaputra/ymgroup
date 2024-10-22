import { useState, useEffect } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import { IoIosPaper } from "react-icons/io";


interface comment {
  comment_id: number;
  comment_date_created: string;
  description: string;
  comment_creator: string;
}

const Reportcomment = () => {
  const {id: id} = useParams()
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<comment[]>([]); // Ensure data is always an array
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // Track expanded row
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<comment | null>(null);
  const [initialData, setInitialData] = useState<comment | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const [totalcomment, setTotalcomment] = useState<number | null>(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_PREFIX_BACKEND
            }/api/discuss/count-comment-superadmin/${id}`
          );
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setTotalcomment(result.data[0].total_comment); // Make sure it's an array
          } else {
            
          }
        } catch (error) {
          console.error("Error fetching data:", error);
    
        }
      };
      fetchData();
  }, []);

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
    if(userId){
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/get-comment-superadmin/${id}`
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
    }
  }, [userId]);

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
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/delete-comment/${id}`
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

  const filteredData = data.filter((item) =>
    item.comment_creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleRowClick = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id)); // Toggle the expanded row
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (selectedData) {
      const { name, value } = e.target;
      setSelectedData({ ...selectedData, [name]: value });
    }
  };

  const handleEditClick = (item: comment) => {
    console.log("ini seleted data", selectedData);
    setSelectedData(item);
    setInitialData(item);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
    setInitialData(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedData || !initialData) return;
    const updatedFields: Partial<Record<keyof comment, string | number>> = {};

    for (const key in selectedData) {
      const newValue = selectedData[key as keyof comment];
      const oldValue = initialData[key as keyof comment];
      if (newValue !== oldValue) {
        updatedFields[key as keyof comment] =
          newValue !== undefined ? newValue : oldValue;
      }
    }

    if (Object.keys(updatedFields).length > 0) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/edit-comment/${
            selectedData.comment_id
          }`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFields),
          }
        );

        const result = await response.json();
        if (result.success) {
          Swal.fire(
            "Success",
            "Your change has been submitted",
            "success"
          ).then(() => {
            setTimeout(() => {
              window.location.reload();
              closeModal();
            }, 10);
          });
        } else {
          console.error("Error saving changes:", result.message);
          Swal.fire("Error", "There was a problem submitting", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "There was an issue with the submission", "error");
      }
    } else {
      // No changes, close the modal
      closeModal();
    }
  };

  return (
    <div
      className={`flex h-auto h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <SidebarAfterLogin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="w-full flex-grow lg:w-auto lg:flex-grow lg:flex lg:flex-col">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />
        <main className="p-4 overflow-x-auto lg:overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">comment Report</h1>
          </div>
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search..."
              className={`border p-2 rounded ${
                darkMode ? "bg-gray-600" : "bg-white"
              }`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className={`shadow-lg rounded w-60 mb-7 text-center px-2 py-4 ${darkMode ? "bg-gray-500 text-white" : "bg-green-500 text-white"}`}>
                <h3 className="text-2xl">Total comment: {totalcomment}</h3>
            </div>
          <div
            className={`shadow-lg rounded-lg p-4 ${
              darkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <div className="overflow-x-auto">
              <table
                className={`min-w-full border ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <thead>
                  <tr>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Creator Name</th>
                    <th className="border px-4 py-2">Date Created</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <>
                        <tr
                          key={item.comment_id}
                          onClick={() => handleRowClick(item.comment_id)}
                          className="cursor-pointer"
                        >
                          <td className="border px-2 py-1">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="border px-2 py-1">
                            {item.comment_creator}
                          </td>
                          <td className="border px-2 py-1">
                            {item.comment_date_created}
                          </td>
                          <td className="border px-2 py-1">
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => handleEditClick(item)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="text-yellow-500 hover:text-gray-400"
                                onClick={() =>
                                    navigate(`/report-reply-comment/${item.comment_id}`)
                                  }
                              >
                                <IoIosPaper />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(item.comment_id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedRow === item.comment_id && (
                          <tr>
                            <td colSpan={5} className={`p-10 max-w-4xl mx-auto  border ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`} >
                            <p>
                                <strong>Description:</strong>{" "}
                                <div>
                                    <p className="mt-2">{ item.description}</p>
                                </div>
                              </p>
                            </td>
                          </tr>
                        )}
                      </>
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
      {isModalOpen && selectedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`rounded-lg m-6 p-4 max-w-lg w-full ${darkMode ? "bg-gray-600" : "bg-white"}`}>
              <h2 className="text-lg font-semibold mb-4">Edit comment</h2>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium">comment</label>
                    <input
                      type="text"
                      name="description"
                      value={selectedData.description}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default Reportcomment;
