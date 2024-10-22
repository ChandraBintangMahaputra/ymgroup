import { useState, useEffect } from "react";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";

interface Question {
  question_id: number;
  question_description: string;
  question_option_a: string;
  question_option_b: string;
  question_option_c: string;
  question_option_d: string;
  question_true_option: string;
  question_date_created: string;
  question_poin: number;
}

const formatMinutesToTime = (minutes: any) => {
  const hours = Math.floor(minutes / 60); // Menghitung jam
  const mins = minutes % 60; // Sisa menit
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:00`; // Menjadi HH:MM:SS
};

function convertTimeToMinutes(time:any) {
    console.log("Received time value:", time); // Logging untuk memeriksa input
  
    // Cek jika input adalah angka
    if (typeof time === 'number') {
      return time; // Mengembalikan input sebagai menit
    }
  
    // Pastikan input adalah string
    if (typeof time === 'string') {
      const parts = time.split(":");
      console.log("Time parts after split:", parts); // Logging untuk hasil split
  
      // Cek apakah panjang parts sesuai untuk HH:MM:SS
      if (parts.length === 3) {
        const hours = parseInt(parts[0], 10) || 0; // Mengambil jam dan pastikan default ke 0
        const minutes = parseInt(parts[1], 10) || 0; // Mengambil menit dan pastikan default ke 0
        const seconds = parseInt(parts[2], 10) || 0; // Mengambil detik dan pastikan default ke 0
        console.log("Parsed hours:", hours, "Parsed minutes:", minutes, "Parsed seconds:", seconds); // Logging parsed values
  
        // Menghitung total dalam menit
        return hours * 60 + minutes + Math.floor(seconds / 60); // Tambahkan detik jika perlu
      } else {
        // Jika format tidak sesuai, coba konversi input sebagai menit
        const singleInput = parseInt(time, 10);
        if (!isNaN(singleInput)) {
          return singleInput; // Jika input adalah angka yang valid, kembalikan sebagai menit
        }
        console.error("Invalid time format, expecting HH:MM:SS or a single number:", time);
        return 0; // Mengembalikan 0 untuk format yang tidak valid
      }
    } else {
      console.error("Invalid input, expecting a string in HH:MM:SS format or a number");
      return 0; // Mengembalikan 0 jika input bukan string atau angka
    }
  }
  

const ListQuizQuestion = () => {
  const { id: id } = useParams();
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<Question[]>([]); // Ensure data is always an array
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // Track expanded row
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [timeExist, setTimeExist] = useState(false);

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

  const handleSetDuration = async () => {
    if (duration !== null && id) {
      const formatedTime = formatMinutesToTime(duration);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/add-duration`,
          {
            time_stopwatch: formatedTime,
            quiz_id: id,
          }
        );
        if (response.data.success) {
          Swal.fire("Success", "Durasi berhasil diatur.", "success");
          setIsModalOpen(false); // Tutup modal setelah berhasil
        } else {
          Swal.fire("Error", "Gagal mengatur durasi.", "error");
        }
      } catch (error) {
        console.error("Error setting duration:", error);
        Swal.fire("Error", "Terjadi kesalahan saat mengatur durasi.", "error");
      }
    }
  };

  const handleChangeDuration = async () => {
    if (duration !== null && id) {
      const formatedTime = formatMinutesToTime(duration);
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/edit-duration/${id}`,
          {
            time_stopwatch: formatedTime,
            quiz_id: id,
          }
        );
        if (response.data.success) {
          Swal.fire("Success", "Durasi berhasil diatur.", "success");
          setIsModalOpen(false); // Tutup modal setelah berhasil
        } else {
          Swal.fire("Error", "Gagal mengatur durasi.", "error");
        }
      } catch (error) {
        console.error("Error setting duration:", error);
        Swal.fire("Error", "Terjadi kesalahan saat mengatur durasi.", "error");
      }
    }
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_PREFIX_BACKEND
            }/api/course/get-quiz-time/${id}`
          );
          const result = await response.json();
          console.log(result)
          if (
            result.success &&
            result.data !== "record not found"
          ) {
            console.log("ini time", result.data[0].time_stopwatch);
            setDuration(result.data[0].time_stopwatch);
            setTimeExist(true);
          } else if(result.data === "record not found") {
            setDuration(null);
            setTimeExist(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setDuration(null);
          setTimeExist(false);
        }
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_PREFIX_BACKEND
            }/api/course/list-question-quiz/${id}`
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
  }, [id]);



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
            }/api/course/delete-question/${id}`
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
          console.error("Error deleting Data:", error);
          Swal.fire("Error", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  const handleDeleteDuration = async () => {
    Swal.fire({
      title: "Hapus durasi?",
      text: "Quiz akan dijalankan tanpa durasi",
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
            }/api/course/delete-duration/${id}`
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
          console.error("Error deleting Data:", error);
          Swal.fire("Error", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  const filteredData = data.filter((item) =>
    item.question_description.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-2xl font-semibold">Daftar Pertanyaan</h1>
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
          <div className="flex justify-space-between gap-4 mb-5">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/add-question/${id}`)}
            >
              Tambah Pertanyaan
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Setting Time
            </button>
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
                    <th className="border px-4 py-2">Pertanyaan</th>
                    <th className="border px-4 py-2">Poin</th>
                    <th className="border px-4 py-2">Date Created</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <>
                        <tr
                          key={item.question_id}
                          onClick={() => handleRowClick(item.question_id)}
                          className="cursor-pointer"
                        >
                          <td className="border px-2 py-1">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="max-w-4xl mx-auto border px-2 py-1">
                            {item.question_description}
                          </td>
                          <td className="border px-2 py-1">
                            {item.question_poin}
                          </td>
                          <td className="border px-2 py-1">
                            {item.question_date_created}
                          </td>
                          <td className="border px-2 py-1">
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() =>
                                  navigate(`/edit-question/${item.question_id}`)
                                }
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(item.question_id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedRow === item.question_id && (
                          <tr>
                            <td
                              colSpan={5}
                              className={`p-10 max-w-4xl mx-auto  border ${
                                darkMode
                                  ? "bg-gray-900 text-white"
                                  : "bg-white text-black"
                              }`}
                            >
                              <p>
                                <strong>Pilihan Jawaban:</strong>{" "}
                              </p>
                              <p>A.{item.question_option_a}</p>
                              <p>B.{item.question_option_b}</p>
                              {item.question_option_c !== null &&
                                item.question_option_c !== "" && (
                                  <p>C.{item.question_option_c}</p>
                                )}
                              {item.question_option_d !== null &&
                                item.question_option_d !== "" && (
                                  <p>D.{item.question_option_d}</p>
                                )}
                              <p className="mt-10">
                                <strong>Jawaban Benar:</strong>{" "}
                                {item.question_true_option}
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
      {isModalOpen && timeExist === false && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
            isModalOpen ? "block" : "hidden"
          }`}
        >
          <div className={`${darkMode ? "bg-gray-700 text-white": "bg-white text-black"} m-4 p-4 rounded-lg shadow-lg max-w-md w-full`}>
            <h2 className="text-xl font-bold mb-4">Set Quiz Duration</h2>
            <p>Ex: jika 20 menit, cukup input angka 20</p>
            <input
              type="number"
              placeholder="Enter duration in minutes"
              className={`border w-full p-2 rounded ${darkMode ? "bg-gray-700 text-white": "bg-white text-black"}`}
              value={duration !== null ? duration : ""}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSetDuration}
              >
                Set Duration
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && timeExist === true && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
            isModalOpen ? "block" : "hidden"
           }`}
        >
          <div className={`${darkMode ? "bg-gray-700 text-white": "bg-white text-black"} m-4 p-4 rounded-lg shadow-lg max-w-md w-full`}>
            <h2 className="text-xl font-bold mb-4">Edit Quiz Duration</h2>
            <p>Ex: jika 20 menit, cukup input angka 20</p>
            <input
              type="number"
              placeholder="Enter duration in minutes"
              className={`border w-full p-2 rounded ${darkMode ? "bg-gray-700 text-white": "bg-white text-black"}`}
              value={duration ? convertTimeToMinutes(duration) : ""}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleChangeDuration}
              >
                Change Duration
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteDuration()}
              >
                Delete Duration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListQuizQuestion;
