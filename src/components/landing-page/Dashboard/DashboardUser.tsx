import React from "react";
import UserDiscussionCountCard from "./CountUserDiscussion";
import UserEnrollCountCard from "./CountUserEnroll";
import { useDarkMode } from "../../../constants/DarkModeProvider";


const DashboardUser: React.FC = () => {
const {darkMode} = useDarkMode()
  return (
    <div
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
        borderRadius: '12px',
        padding: '20px',
      }}
      className={`w-full mx-auto mt-10 mb-10 ${darkMode ? "bg-gray-600" : "bg-white"} `}
    >
      {/* Baris pertama: 4 kolom untuk komponen count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <UserDiscussionCountCard />
        <UserEnrollCountCard />
      </div>


    </div>
  );
};

export default DashboardUser;
