import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [error, setError] = useState<Boolean | null>(false);

  const handleError = (data: boolean) => {
    setError(data);
  };

  useEffect(() => {
    if (error === true) {
      toast.error("Invalid Login");
      setError(false);
    }
  }, [error]);

  return (
    <main className="bg-gradient-to-r from-[#3C4563] from-62% to-[#7A8DC9] to-100%">
      <ToastContainer autoClose={3000} position="bottom-center" closeOnClick />
      <div className="overflow-hidden">
        <div className="relative">
          <div className="w-full h-screen flex justify-center">
            <div className="hidden lg:w-1/2 h-screen lg:flex justify-center items-center mt-10 lg:mt-10">
              <LoginForm errorCall={handleError} />
            </div>
            <div className="lg:hidden w-full h-screen flex justify-center items-center mt-10 lg:mt-10">
              <LoginForm errorCall={handleError} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login