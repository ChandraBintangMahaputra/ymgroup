import { useState, useEffect } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import axios from "axios";

// Define the interface for the API response
interface AuthorizationData {
  id: number;
  name: string;
  email: string;
  institution: string;
  faculty: string;
  prodi: string;
  position: string;
  role: string;
  isAlumniIPB: number;
  isActive: number;
  isIPB: number;
}

const MasterAuthorization = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<AuthorizationData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<AuthorizationData | null>(
    null
  );
  const [initialData, setInitialData] = useState<AuthorizationData | null>(
    null
  );
  const [faculties, setFaculties] = useState<
    { value: number; label: string }[]
  >([]);
  const [prodis, setProdis] = useState<{ value: string; label: string }[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/master/get-faculty`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Faculties:", data); // Log faculty data
        if (Array.isArray(data.data)) {
          const facultyOptions = data.data.map(
            (faculty: { id: number; description: string }) => ({
              value: faculty.id,
              label: faculty.description,
            })
          );
          setFaculties(facultyOptions);
        }
      })
      .catch((error) => {
        console.error("Error fetching faculties:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedFacultyId) {
      fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/master/get-study-program/${selectedFacultyId}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Programs:", data); // Log program data
          if (Array.isArray(data.data)) {
            const prodiOptions = data.data.map(
              (prodi: { description: string }) => ({
                value: prodi.description,
                label: prodi.description,
              })
            );
            setProdis(prodiOptions);
          }
        })
        .catch((error) => {
          console.error("Error fetching prodis:", error);
        });
    }
  }, [selectedFacultyId]);

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

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/master/get-authorization`
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    };
    fetchData();
  }, []);

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleEditClick = (item: AuthorizationData) => {
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
    const updatedFields: Partial<
      Record<keyof AuthorizationData, string | number>
    > = {};

    for (const key in selectedData) {
      const newValue = selectedData[key as keyof AuthorizationData];
      const oldValue = initialData[key as keyof AuthorizationData];
      if (newValue !== oldValue) {
        updatedFields[key as keyof AuthorizationData] =
          newValue !== undefined ? newValue : oldValue;
      }
    }

    if (Object.keys(updatedFields).length > 0) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_PREFIX_BACKEND
          }/api/master/edit-authorization/${selectedData.id}`,
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

  // Handle input changes in modal
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (selectedData) {
      const { name, value } = e.target;
      setSelectedData({ ...selectedData, [name]: value });
    }
  };

  useEffect(() => {
    if (selectedData) {
      setSelectedFacultyId(
        faculties.find((f) => f.label === selectedData.faculty)?.value || null
      );
    }
  }, [selectedData, faculties]);

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
          const response = await axios.put(
            `${
              import.meta.env.VITE_PREFIX_BACKEND
            }/api/master/delete-authorization/${id}`
          );
          if (response.data.success) {
            Swal.fire("Deleted!", "Faculty berhasil dihapus.", "success").then(
              () => {
                window.location.reload();
              }
            );
          } else {
            Swal.fire("Error", "Gagal menghapus data.", "error");
          }
        } catch (error) {
          console.error("Error deleting Faculty:", error);
          Swal.fire("Error", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <SidebarAfterLogin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="w-full lg:w-auto lg:flex-grow">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />
        <main className="p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Authorization Management</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search..."
              className={`border p-2 rounded mb-2 ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
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
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Institution</th>
                    <th className="border px-4 py-2">Faculty</th>
                    <th className="border px-4 py-2">Prodi</th>
                    <th className="border px-4 py-2">Position</th>
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
                        <td className="border px-2 py-1">{item.name}</td>
                        <td className="border px-2 py-1">{item.email}</td>
                        <td className="border px-2 py-1">{item.institution}</td>
                        <td className="border px-2 py-1">
                          {item.faculty || "-"}
                        </td>
                        <td className="border px-2 py-1">
                          {item.prodi || "-"}
                        </td>
                        <td className="border px-2 py-1">{item.position}</td>
                        <td className="border px-2 py-1">{item.role}</td>
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
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 ${
              darkMode ? "bg-black" : "bg-black"
            }`}
          >
            <div
              className={`rounded-lg m-6 p-4 max-w-lg w-full ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Edit Authorization</h2>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedData.name}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={selectedData.email}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      Institution
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={selectedData.institution}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
                    />
                  </div>
                  {selectedData.isIPB === 1 && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Faculty
                        </label>
                        <select
                          name="faculty"
                          value={
                            selectedFacultyId || selectedData?.faculty || ""
                          }
                          onChange={(e) => {
                            const facultyId = Number(e.target.value);
                            setSelectedFacultyId(facultyId); // Update selected faculty
                            handleInputChange(e); // Update selectedData with faculty ID
                          }}
                          className={`border rounded w-full p-2 ${
                            darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          <option value="">Select Faculty</option>
                          {faculties.map((faculty) => (
                            <option key={faculty.value} value={faculty.value}>
                              {faculty.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {selectedData.isIPB === 1 && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Prodi
                        </label>
                        <select
                          name="prodi"
                          value={selectedData?.prodi || ""}
                          onChange={handleInputChange}
                          className={`border rounded w-full p-2 ${
                            darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          <option value="">Select Prodi</option>
                          {prodis.map((prodi) => (
                            <option key={prodi.value} value={prodi.value}>
                              {prodi.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={selectedData.position}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={selectedData.role}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      is Active
                    </label>
                    <input
                      type="number"
                      name="isActive"
                      value={selectedData.isActive}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      is Alumni IPB
                    </label>
                    <input
                      type="number"
                      name="isAlumniIPB"
                      value={selectedData.isAlumniIPB}
                      onChange={handleInputChange}
                      className={`border rounded w-full p-2 ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-black"
                      }`}
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
    </div>
  );
};

export default MasterAuthorization;
