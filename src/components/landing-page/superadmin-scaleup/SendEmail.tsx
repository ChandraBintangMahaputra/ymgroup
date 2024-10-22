import { useState, useEffect } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";


interface SendEmail {
    id: number;
    header: string;
    description: string;
    email_recipient: string;
    date_created: string;
    name_recipient: string;

}

const SendEmailReport = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<SendEmail[]>([]); // Ensure data is always an array
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // Track expanded row
  const itemsPerPage = 5;
  const [totalSendEmailReport, setTotalSendEmailReport] = useState<number | null>(null);
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
            }/api/security/send-email-data`
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
          }/api/security/count-send-email`
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setTotalSendEmailReport(result.data[0].total_send_email); // Make sure it's an array
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
            }/api/security/delete-send-email/${id}`
          );
          if (response.data.success) {
            Swal.fire("Deleted!", "Data berhasil dihapus.", "success").then(
              () => {
                window.location.reload();
              }
            );
          } else {
            Swal.fire("Error", "Gagal menghapus data.", "error");
          }
        } catch (error) {
          console.error("Error deleting data:", error);
          Swal.fire("Error", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  const filteredData = data.filter(
    (item) =>
      item.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.name_recipient
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.email_recipient
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.header.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-2xl font-semibold">Send Email Report</h1>
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
             <button
              className={`px-4 py-2 rounded ${darkMode ? "bg-gray-600 text-white" : "bg-blue-600 text-white"}`}
              onClick={() =>
                navigate(`/add-send-email`)
              }
            >
              Add Send Email
            </button>
          </div>
          <div
            className={`shadow-lg rounded w-60 mb-7 text-center p-4 ${
              darkMode ? "bg-gray-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            <h3 className="text-2xl">Total Send Email: {totalSendEmailReport}</h3>
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
                    <th className="border px-4 py-2">Header</th>
                    <th className="border px-4 py-2">Email Recipient</th>
                    <th className="border px-4 py-2">Name Recipient</th>
                    <th className="border px-4 py-2">Date Created</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <>
                        <tr
                          key={item.id}
                          onClick={() => handleRowClick(item.id)}
                          className="cursor-pointer"
                        >
                          <td className="border px-2 py-1">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="border px-2 py-1">
                            {item.header}
                          </td>
                          <td className="border px-2 py-1">
                            {item.email_recipient}
                          </td>
                          <td className="border px-2 py-1">
                            {item.name_recipient}
                          </td>
                          <td className="border px-2 py-1">
                            {item.date_created}
                          </td>
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
                        {expandedRow === item.id && (
                          <tr>
                            <td
                              colSpan={5}
                              className={`p-10 max-w-4xl mx-auto border ${
                                darkMode
                                  ? "bg-gray-900 text-white"
                                  : "bg-white text-black"
                              }`}
                            >
                              <p className="mt-10">
                                <strong>Description:</strong>{" "}
                                {item.description}
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

export default SendEmailReport;
