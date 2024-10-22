import { useState, useEffect } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useDarkMode } from '../../../constants/DarkModeProvider';




interface Role {
  id: number;
  description: string;
}

const MasterRole = () => {
  const { darkMode } = useDarkMode(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Role | null>(null);
  const [initialData, setInitialData] = useState<Role | null>(null);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleDescription, setNewRoleDescription] = useState("");
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
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/master/get-role`
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    };
    fetchData();
  }, []);

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
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/master/delete-role/${id}`
          );
          if (response.data.success) {
            Swal.fire('Deleted!', 'Role berhasil dihapus.', 'success').then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire('Error', 'Gagal menghapus data.', 'error');
          }
        } catch (error) {
          console.error('Error deleting role:', error);
          Swal.fire('Error', 'Terjadi kesalahan saat menghapus data.', 'error');
        }
      }
    });
  };
  

  const filteredData = data.filter((item) =>
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

  // Open modal with selected row data
  const handleEditClick = (item: Role) => {
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
    const updatedFields: Partial<Record<keyof Role, string | number>> = {};

    for (const key in selectedData) {
      const newValue = selectedData[key as keyof Role];
      const oldValue = initialData[key as keyof Role];
      if (newValue !== oldValue) {
        updatedFields[key as keyof Role] =
          newValue !== undefined ? newValue : oldValue;
      }
    }

    if (Object.keys(updatedFields).length > 0) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/master/edit-role/${
            selectedData.id
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

  const handleAddRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/master/add-role`,
        { description: newRoleDescription },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        Swal.fire("Success", "Role added successfully", "success").then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add role", "error");
    }
  };

  // Handle input changes in modal
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (selectedData) {
      const { name, value } = e.target;
      setSelectedData({ ...selectedData, [name]: value });
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <SidebarAfterLogin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="w-full lg:w-auto lg:flex-grow">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />
        <main className="p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Role Management</h1>
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
              onClick={() => setIsAddRoleModalOpen(true)}
            >
              Add Role
            </button>
          </div>
          <div className={`shadow-lg rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="overflow-x-auto">
              <table className={`min-w-full border ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <thead>
                  <tr>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Role</th>
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
                        <td className="border px-2 py-1">{item.description}</td>
                        <td className="border px-2 py-1">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleEditClick(item)}
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

        {/* Modal for editing */}
        {isModalOpen && selectedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`rounded-lg m-6 p-4 max-w-lg w-full ${darkMode ? "bg-gray-600" : "bg-white"}`}>
              <h2 className="text-lg font-semibold mb-4">Edit Role</h2>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Role</label>
                    <input
                      type="text"
                      name="description"
                      value={selectedData.description}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                      required
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

        {isAddRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`rounded-lg m-6 p-4 max-w-lg w-full ${darkMode ? "bg-gray-600" : "bg-white"}`}>
              <h2 className="text-lg font-semibold mb-4">Add Role</h2>
              <form onSubmit={handleAddRoleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    className={`border rounded w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    required
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddRoleModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add Role
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

export default MasterRole;
