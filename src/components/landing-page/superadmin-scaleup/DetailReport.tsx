import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import Swal from "sweetalert2";

// Define the interface for report data
interface Report {
  report_id: number;
  suspect_report_name: string;
  reporter_report_name: string;
  reporter_description: string;
  report_category: string;
  report_date_created: string;
  suspect_content: string;
}

const DetailReport = () => {
  const { darkMode } = useDarkMode();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [reportData, setReportData] = useState<Report | null>(null); // Use the interface
  const [warningText, setWarningText] = useState(""); // State for warning text
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submit button

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch report data from API
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_PREFIX_BACKEND
          }/api/discuss/report-superadmin/${id}`
        );
        if (response.data.success) {
          console.log("ini data", response.data);
          setReportData(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, [id]);

  // Handle submit warning
  const handleWarningSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/warning-to-suspect/${reportData?.report_id}`,
        {
          warning: warningText, // Sending warning text in the body
        }
      );
      if (response.data.message === "Pesan peringatan terkirim") {
        Swal.fire("Success", "Warning berhasil terkirim ke suspect", "success")
        setWarningText(""); // Clear the text area after success
      } else {
        Swal.fire("Error", "Warning gagal terkirim ke suspect", "error")
      }
    } catch (error) {
      console.error("Error sending warning:", error);
      Swal.fire("Error", "Ada gangguan internal", "error")
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date to desired format (e.g., 10 Oktober 2024)
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }; // Use correct types
    return date.toLocaleDateString("id-ID", options);
  };

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
          {reportData ? (
            <div
              className={`report-view max-w-6xl mx-auto my-10 p-6 shadow-lg rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              {/* Report Title */}
              <h1 className={`text-2xl text-left mt-5 mb-6 `}>Detail Report</h1>

              {/* Report Content */}
              <div className="report-content mt-6 mb-6 p-9 border border-red-500">
                <p>{reportData.suspect_content}</p>
              </div>

              {/* Horizontal details section */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-x-4">
                  <p className="text-left">
                    <strong>Suspect Name</strong>
                  </p>
                  <p className="text-left">{reportData.suspect_report_name}</p>

                  <p className="text-left">
                    <strong>Reporter Name</strong>
                  </p>
                  <p className="text-left">{reportData.reporter_report_name}</p>

                  <p className="text-left">
                    <strong>Category</strong>
                  </p>
                  <p className="text-left">{reportData.report_category}</p>

                  <p className="text-left">
                    <strong>Date Created</strong>
                  </p>
                  <p className="text-left">
                    {formatDate(reportData.report_date_created)}
                  </p>
                </div>
              </div>

              {/* Warning textarea */}
              <div className="warning-section mb-6">
                <label htmlFor="warningText" className="block text-left mb-2">
                  <strong>Warning to Suspect</strong>
                </label>
                <textarea
                  id="warningText"
                  className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                  rows={4}
                  value={warningText}
                  onChange={(e) => setWarningText(e.target.value)}
                  placeholder="Enter your warning here..."
                />
              </div>

              {/* Submit button */}
              <div className="text-right">
                <button
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleWarningSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Warning"}
                </button>
              </div>
            </div>
          ) : (
            <p>Loading report...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DetailReport;
