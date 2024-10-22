import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; 
import Header from "../Header";
import { GrValidate } from "react-icons/gr";

export const EmailConfirmed = () => {
  const { id: id } = useParams();
  const navigate = useNavigate();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const hasCalledAPI = useRef(false); 

  useEffect(() => {
    if (!id || verificationComplete || hasCalledAPI.current) return; 

    const verifyEmail = async () => {
      try {
        const response = await axios.put(`${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/verify-email/${id}`);
        if (response.status === 200) {
          console.log(response);
          toast.success("Email verification successful!");
          setVerificationComplete(true); 
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        toast.error("Email verification failed. Please try again.");
        setVerificationComplete(true); 
      }
    };

    verifyEmail();
    hasCalledAPI.current = true; 

  }, [id, verificationComplete, navigate]);

  return (
    <main className="bg-black h-screen flex items-center justify-center">
      <div className="overflow-hidden w-full h-full">
        <ToastContainer autoClose={3000} position="top-right" closeOnClick />
        <Header />

        <div className="flex justify-center items-center h-full">
          <div className="bg-white shadow-lg p-6 m-6 rounded-lg flex flex-col items-center">
            <GrValidate className="text-5xl text-green-500 mb-4" /> {/* Success icon */}
            <p className="text-center text-lg font-semibold text-black">
              Thanks, Your Account is Active. Please login.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
