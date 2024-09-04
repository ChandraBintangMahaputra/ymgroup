import React from "react";
import StudentCountCard from "./CountStudent";
import FirstPaymentCountCard from "./FirstPayment";
import SecondPaymentCountCard from "./SecondPayment";
import DonePaymentCountCard from "./DonePayment";
import ProgressDana from "./ProgressDana";
import DanaMonth from "./DanaMonth";


const Dashboard: React.FC = () => {
  return (
    <div
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: '#ffffff',
      }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mx-auto mt-10"
    >
      <StudentCountCard />
      <FirstPaymentCountCard />
      <SecondPaymentCountCard />
      <DonePaymentCountCard />
      <ProgressDana />
      <DanaMonth />

    </div>
  );
};

export default Dashboard;
