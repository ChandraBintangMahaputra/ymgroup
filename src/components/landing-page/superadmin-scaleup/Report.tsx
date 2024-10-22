import { useState, useEffect } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import { IoIosPaper } from "react-icons/io";

interface Report {
  report_id: number;
  suspect_report_name: string;
  reporter_report_name: string;
  reporter_description: string;
  report_category: string;
  report_date_created: string;
  suspect_content: string;
  status: number;
}

const Report = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<Report[]>([]); // Ensure data is always an array
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // Track expanded row
  const itemsPerPage = 5;
  const [totalReport, setTotalReport] = useState<number | null>(null);
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
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
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_PREFIX_BACKEND
            }/api/discuss/report-superadmin`
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_PREFIX_BACKEND
          }/api/discuss/count-report-superadmin`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setTotalReport(result.data[0].total_report); // Make sure it's an array
        } else {
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
            `${
              import.meta.env.VITE_PREFIX_BACKEND
            }/api/discuss/delete-report-superadmin/${id}`
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
      item.reporter_report_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.suspect_report_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.reporter_description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.report_category.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-2xl font-semibold">Report</h1>
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
          <div
            className={`shadow-lg rounded w-60 mb-7 text-center p-4 ${
              darkMode ? "bg-gray-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            <h3 className="text-2xl">Total Report: {totalReport}</h3>
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
                    <th className="border px-4 py-2">Suspect Name</th>
                    <th className="border px-4 py-2">Reporter Name</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Date Created</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <>
                        <tr
                          key={item.report_id}
                          onClick={() => handleRowClick(item.report_id)}
                          className="cursor-pointer"
                        >
                          <td className="border px-2 py-1">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="border px-2 py-1">
                            {item.suspect_report_name}
                          </td>
                          <td className="border px-2 py-1">
                            {item.reporter_report_name}
                          </td>
                          <td className="border px-2 py-1">
                            {item.report_category}
                          </td>
                          <td className="border px-2 py-1">
                            {item.report_date_created}
                          </td>
                          <td className="border px-2 py-1">
                            {item.status === 0
                              ? "Belum diproses"
                              : item.status === 1
                              ? "Sudah diproses"
                              : "Tidak terbukti"}
                          </td>
                          <td className="border px-2 py-1">
                            <div className="flex space-x-2">
                              <button
                                className="text-yellow-500 hover:text-gray-400"
                                onClick={() =>
                                  navigate(`/detail-report/${item.report_id}`)
                                }
                              >
                                <IoIosPaper />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(item.report_id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedRow === item.report_id && (
                          <tr>
                            <td
                              colSpan={5}
                              className={`p-10 max-w-4xl mx-auto border ${
                                darkMode
                                  ? "bg-gray-900 text-white"
                                  : "bg-white text-black"
                              }`}
                            >
                              <p>
                                <strong>Reporter Description:</strong>{" "}
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.reporter_description,
                                  }}
                                />
                              </p>
                              <p className="mt-10">
                                <strong>Suspect Content:</strong>{" "}
                                {item.suspect_content}
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
    </div>
  );
};

export default Report;
