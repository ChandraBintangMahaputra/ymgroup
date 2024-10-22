import React from "react";
import UserCountCard from "./CountUser";
import ArticleCountCard from "./CountArticle";
import CourseCountCard from "./CountCourse";
import VisitorCountCard from "./CountVisitor";
import MostCreatorArticleMonth from "./MostCreatorArticleMonth";
import MostCreatorCourseMonth from "./MostCreatorCourseMonth";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import MostCreatorArticle from "./MostCreatorArticle";
import MostCreatorCourse from "./MostCreatorCourse";
import MostArticle from "./MostArticleRead";
import MostCourse from "./MostCourseEnroll";

const DashboardSuperAdmin: React.FC = () => {
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <UserCountCard />
        <ArticleCountCard />
        <CourseCountCard />
        <VisitorCountCard />
      </div>

      {/* Baris kedua: 2 kolom untuk komponen most */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <MostCreatorArticleMonth />
        <MostCreatorCourseMonth />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <MostCreatorArticle />
        <MostCreatorCourse />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <MostArticle />
        <MostCourse />
      </div>
    </div>
  );
};

export default DashboardSuperAdmin;
