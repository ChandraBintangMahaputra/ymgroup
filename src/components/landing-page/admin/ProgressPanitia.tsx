import React, { useState } from "react";
import CompanyData from "./CompanyData";
import Dashboard from "./Dashboard";
import Header from "../Header";

const ProgressPanitia: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <main>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />

        <div className="container mx-auto px-4 py-4">
          <div className="flex space-x-4 border-b-2 border-gray-300">
            <button
              className={`py-2 px-4 ${
                activeTab === "dashboard"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Progress Dana
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "companyData"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("companyData")}
            >
              Company Data
            </button>
          </div>

          <div className="mt-6">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "companyData" && <CompanyData />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProgressPanitia;
