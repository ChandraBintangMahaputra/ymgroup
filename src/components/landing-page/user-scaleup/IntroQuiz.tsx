import HeaderAfterLogin from "../HeaderAfterLogin"; 
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";

interface Result{
    score: number;
    status:number;
    date_created: string;
    }

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

const QuizIntro = () => {
  const { darkMode } = useDarkMode();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [topic, setTopic] = useState<string>(""); // Use lowercase 'string'
  const [duration, setDuration] = useState<number>(25); // Use lowercase 'number'
  const [totalQuestion, setTotalQuestion] = useState<number | null>(null); // Use lowercase 'number'
  const navigate = useNavigate();
  const [data, setData] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [userId, setUserId] = useState<string | null>(null);


  const storeUserdata = (): Promise<void> => {
    return new Promise((resolve) => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        if (parsedUserData?.id) {
          setUserId(parsedUserData.id);
        } else {
          console.error("User ID not found in stored data");
        }
      } else {
        console.error("No userData found in localStorage");
      }
      resolve();
    });
  };

  useEffect(() => {
    storeUserdata();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/quiz-result/${userId}/${id}`
      );
      const result = await response.json();
      console.log("resulr", result)
      if (result.success) {
        console.log("ini data lohh", result.data)
        setData(Array.isArray(result.data) ? result.data : []); // Ensure it's an array
      }
    };
    fetchData();
  }, [id, userId]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  // Fetch report data from API
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/get-quiz-topic/${id}`
        );
        if (response.data.success) {
          console.log("ini data", response.data);
          setTopic(response.data.data[0].title);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/count-quiz-question/${id}`
        );
        if (response.data.success) {
          console.log("ini data", response.data);
          setTotalQuestion(response.data.data[0].total_question);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/get-quiz-duration/${id}`
        );
        if (response.data.success) {
          console.log("ini data", response.data);
          setDuration(response.data.data[0].time_stopwatch);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
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
        <main className={` w-ful lg:w-full h-full overflow-y-auto`}>
        <div
              className={`report-view max-w-6xl mx-auto my-10 p-6 shadow-lg rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              {/* Report Title */}
              <h1 className={`text-2xl text-left mt-5 mb-6 `}>Detail Quiz</h1>

              {/* Report Content */}
              <div className="report-content mt-6 mb-6 p-9 border border-red-500">
                <p>Kuis berisikan pertanyaan yang bersumber dari materi yang diberikan yakni 
                    tentang <strong>{topic}</strong>, terdapat <strong>{totalQuestion ?? 0} pertanyaan</strong> yang diberikan. 
                    Syarat nilai kelulusan 80%. Durasi ujian adalah <strong>{convertTimeToMinutes(duration) ?? 25} menit.</strong>&nbsp; Apabila tidak lulus, Anda bisa mengikuti kuis kembali 20 menit kemudian.</p>
              </div>

              {/* Submit button */}
              <div className="text-right">
                <button
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md`}
                  onClick={() => navigate(`/start-quiz/${id}`)}
                >
                Mulai
                </button>
              </div>

               {/* Quiz Results Table */}
            <div className={`shadow-lg rounded-lg p-4 mt-6 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div className="overflow-x-auto">
                <h5 className="mb-4 mt-4">Hasil Quiz</h5>
                <table className={`min-w-full border ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">#</th>
                      <th className="border px-4 py-2">Score</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Date Created</th>

                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((result, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td
                          className={`border px-4 py-2 ${
                            result.score >= 80 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {result.score}
                        </td>
                        <td className="border px-4 py-2">
                          {result.status === 1 ? "Lulus" : "Belum Lulus"}
                        </td>
                        <td className="border px-4 py-2">{result.date_created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`mx-1 px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-black"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default QuizIntro;
