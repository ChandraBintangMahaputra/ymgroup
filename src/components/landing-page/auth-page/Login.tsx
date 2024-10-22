import { useEffect, useState } from "react";
import SecondHeader from "../SecondHeader";
import { LoginForm } from "./LoginForm";
import { ToastContainer, toast } from "react-toastify";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { HiMail, HiCheckCircle } from "react-icons/hi";


const Login = () => {
  const [error, setError] = useState<Boolean | null>(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleError = (data: boolean) => {
    setError(data);
  };

  useEffect(() => {
    if (error === true) {
      toast.error("Invalid Login");
      setError(false);
    }
  }, [error]);

  const handleForgotPasswordSubmit = async () => {
    try {
      const checkEmailResponse = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/master/check-email/${forgotPasswordEmail}`
      );
      const emailCheckData = await checkEmailResponse.json();

      console.log("check email", emailCheckData.success)

      if (emailCheckData.success === true) {
        await fetch(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/forgot-password/${forgotPasswordEmail}`,
          { method: "POST" }
        );
  
        setIsSubmitted(true); 
      } else {
        setForgotPasswordError("Email tidak terdaftar.");
      }
    } catch (error) {
      setForgotPasswordError("Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <main className="bg-gradient-to-r from-purple-500 to-purple-800">
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      <div className="overflow-hidden">
        <SecondHeader />
        <div className="relative lg:flex justify-center items-center mt-10 lg:mt-20">
          <div className="w-full h-screen flex">
            <div className="hidden lg:w-full h-screen lg:flex justify-center items-center mt-10 lg:mt-10">
              <LoginForm errorCall={handleError} setShowForgotPassword={setShowForgotPassword} />
            </div>
            <div className="lg:hidden w-full h-screen flex justify-center items-center mt-10 lg:mt-10">
              <LoginForm errorCall={handleError} setShowForgotPassword={setShowForgotPassword} />
            </div>
          </div>
        </div>

        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg mr-10 ml-10  shadow-lg w-[600px] sm:w-[500px]">
              <h2 className="text-lg font-semibold mb-4">Lupa Kata Sandi</h2>

              {!isSubmitted ? (
                <>
                  <Label htmlFor="forgot-email">Masukkan email</Label>
                  <div className="relative mt-2">
                    <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" /> 
                    <Input
                      id="forgot-email"
                      placeholder="Masukkan email"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className={`pl-10 ${forgotPasswordError ? "border-2 border-red-400" : ""}`} 
                    />
                  </div>
                  {forgotPasswordError && (
                    <p className="text-red-500 text-sm">{forgotPasswordError}</p>
                  )}
                  <button
                    onClick={handleForgotPasswordSubmit}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Kirim
                  </button>
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="mt-2 text-gray-500 ml-2 bg-gray-200 px-4 py-2 rounded"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <HiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                  <p className="text-lg text-green-600">Periksa Emailmu untuk Memulihkan Kata Sandi</p>
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="mt-4 text-gray-500 ml-2 bg-gray-200 px-4 py-2 rounded"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Login;