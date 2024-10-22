import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useDarkMode } from "../../../constants/DarkModeProvider";

// Define the types for API data
type UserData = {
  name_user: string;
  email_user: string;
};

const AddSendEmail = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [SendEmailContent, setSendEmailContent] = useState("");
  const [userData, setUserData] = useState<UserData[]>([]); // Use the defined type

  const { register, handleSubmit, reset } = useForm();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch the email data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/security/get-email`
        );
        setUserData(response.data.data); // Make sure to access the correct path to the data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        description: SendEmailContent,
      };
      await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/security/add-send-email`,
        payload
      );

      Swal.fire("Success", "Your SendEmail has been submitted", "success");

      reset();
      setSendEmailContent("");
    } catch (error) {
      console.error("Error submitting SendEmail:", error);
      Swal.fire("Error", "Failed to submit the SendEmail", "error");
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <SidebarAfterLogin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-grow flex flex-col">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />

        <main className="flex-grow overflow-y-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Add Send Email</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* header */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="header">
                Header
              </label>
              <input
                type="text"
                id="header"
                {...register("header", { required: true })}
                className={`border rounded w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                placeholder="Enter SendEmail header"
              />
            </div>

            {/* Name Recipient */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="name_recipient">
                Name Recipient
              </label>
              <select
                id="name_recipient"
                {...register("name_recipient", { required: true })}
                className={`border rounded w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                onChange={(e) => {
                  const selectedUser = userData.find(user => user.name_user === e.target.value);
                  if (selectedUser) {
                    reset({ email_recipient: selectedUser.email_user });
                  }
                }}
              >
                <option value="">Select Name</option>
                {userData.map((user) => (
                  <option key={user.email_user} value={user.name_user}>
                    {user.name_user}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Recipient */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="email_recipient">
                Email Recipient
              </label>
              <input
                type="text"
                id="email_recipient"
                {...register("email_recipient", { required: true })}
                className={`border rounded w-full px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                readOnly
              />
            </div>

            {/* SendEmail */}
            <div className="mb-6">
              <label className="block font-bold mb-2" htmlFor="description">
                Pesan
              </label>
              <ReactQuill
                theme="snow"
                value={SendEmailContent}
                onChange={setSendEmailContent}
                className={`h-60 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 mt-20 lg:mt-10 rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddSendEmail;
