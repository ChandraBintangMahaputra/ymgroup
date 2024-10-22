import Header from "../Header";
import { MdEmail } from "react-icons/md"; 

export const VerifyEmail = () => {
  return (
    <main className="bg-black h-screen flex items-center justify-center">
      <div className="overflow-hidden w-full h-full">
        <Header />

        <div className="flex justify-center items-center h-full">
          <div className="bg-white shadow-lg p-6 m-6 rounded-lg flex flex-col items-center">
            <MdEmail className="text-5xl text-blue-500 mb-4" /> {/* Email icon */}
            <p className="text-center text-lg font-semibold text-black">
              Please check your email and activate your account
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
