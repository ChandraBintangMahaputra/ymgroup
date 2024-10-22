import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import EditProfile from "./EditProfile";

// Define the interface for profile data
interface profileData {
  name: string;
  email: string;
  faculty: string;
  prodi: string;
  institution: string;
  position: string;
  date_in: string;
  isAlumniIPB: number;
}

const Profile = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileData, setprofileData] = useState<profileData | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isIPB, setIsIpb] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState(false); // State untuk mode edit

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
      setIsIpb(parsedUserData.isIPB);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // Fetch profile data here
    }
  }, [userId]);

  useEffect(() => {
    if (isIPB) {
      // Additional logic for IPB
    }
  }, [isIPB]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

 
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/profile/${userId}`
      );
      if (response.data.success) {
        setprofileData(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // Format date to desired format (e.g., 10 Oktober 2024)
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const handleEditClick = () => {
    setIsEdit(!isEdit); // Toggle antara mode edit dan mode tampilan
    fetchProfile()
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
        <main className={`p-4 w-full lg:w-full h-full overflow-y-auto`}>
          <div className="flex justify-between items-center">
            <h2 className="text-center mb-2 mt-3 text-4xl">{isEdit ? "Edit Profil" : "Profil"}</h2>
            {/* Edit / Cancel button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleEditClick}
            >
              {isEdit ? "Kembali" : "Edit Profil"}
            </button>
          </div>

          {profileData ? (
            <div
              className={`profile-card shadow-lg rounded-lg p-4 w-full lg:w-full mx-auto ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
              }`}
            >
              <div className="profile-view overflow-x-auto">
                {isEdit ? (
                  // If isEdit is true, show the EditProfile component
                  <EditProfile />
                ) : (
                  // If isEdit is false, show the profile data
                  <>
                    <h5 className="text-center text-2xl lg:text-1xl font-bold mb-2 mt-5">
                      {profileData.name}
                    </h5>
                    <p className="text-xs text-center">{profileData.email}</p>

                    <div className="flex justify-center">
                      <hr
                        className={`w-1/2 border-t-2 mb-5 mt-5 ${
                          darkMode ? "border-white" : "border-black"
                        }`}
                      />
                    </div>

                    {/* Horizontal details section */}
                    <div className="flex justify-center mb-6">
                      <div className="text-left">
                        <div className="grid grid-cols-2 gap-x-4 pr-2">
                          <p className="text-right">
                            <strong>Institusi</strong>
                          </p>
                          <p className="text-left">{profileData.institution}</p>

                          {isIPB === 1 && (
                            <>
                              <p className="text-right">
                                <strong>Fakultas</strong>
                              </p>
                              <p className="text-left">{profileData.faculty}</p>

                              <p className="text-right">
                                <strong>Prodi</strong>
                              </p>
                              <p className="text-left">{profileData.prodi}</p>
                            </>
                          )}

                          <p className="text-right">
                            <strong>Position</strong>
                          </p>
                          <p className="text-left">{profileData.position}</p>

                          {isIPB === 1 && (
                            <>
                              <p className="text-right">
                                <strong>Tanggal Masuk</strong>
                              </p>
                              <p className="text-left">
                                {formatDate(profileData.date_in)}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
