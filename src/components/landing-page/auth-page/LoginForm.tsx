import React from 'react'; 
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';


interface LoginFormValues {
  nik: string;  
  password: string;
}

function LoginForm({ errorCall }: { errorCall: (data: boolean) => void }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false); // State to handle password visibility

  const handleLogin = async (values: LoginFormValues, actions: any) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/login`, values);
      const responseData = response.data;
      
      if (responseData.message === "Record not found") {
        errorCall(true);
      } else {
        // Set token and user name in local storage
        toast.success('Login successful!'); 
        console.log("data yaa", responseData);
        localStorage.setItem("token", responseData.data.token);
        localStorage.setItem("userData", JSON.stringify({
          name: responseData.data.name,
        }));
        
        actions.resetForm();// Show success toast
        setTimeout(() => {
            navigate("/admin/beranda");
          }, 1000);
      }
    } catch (error) {
      console.error("Login failed: ", error);
      errorCall(true);
      toast.error('Login failed. Please try again.'); // Show error toast
    }
  };
  
  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useFormik<LoginFormValues>({
      initialValues: {
        nik: "",  
        password: "",
      },
      onSubmit: handleLogin,
    });

  return (
    <div className="max-w-sm sm:max-w-md w-full mx-4 sm:mx-auto rounded-2xl p-4 md:p-8 shadow-lg bg-white backdrop-blur-3xl dark:bg-black">
      <h2 className="font-bold sm:text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to
      </h2>
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      <h2 className="font-bold md:text-xl text-neutral-800 dark:text-neutral-200">
        Fieldtrip Admin Website
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Please sign-in to your account
      </p>

      <form className="my-4 sm:my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2 w-full mb-4">
          <label htmlFor="nik" className="font-medium text-neutral-700 dark:text-neutral-300">
            NIK
          </label>
          <input
            id="nik"
            placeholder="Enter your NIK"
            type="text"
            value={values.nik}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.nik && touched.nik
                ? "border-2 border-red-400 focus-visible:ring-red-400 p-2 rounded-md"
                : "border-none p-2 rounded-md"
            }
          />
          {touched.nik && <p className="ml-2 text-red-400 text-sm max-w-sm">
            {errors.nik}
          </p>}
        </div>

        <div className="flex flex-col space-y-2 w-full mb-4">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"} // Toggle password visibility
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.password && touched.password
                ? "border-2 border-red-400 focus-visible:ring-red-400 p-2 rounded-md"
                : "border-none p-2 rounded-md"
            }
          />
          {touched.password && <p className="ml-2 text-red-400 text-sm max-w-sm">
            {errors.password}
          </p>}
        </div>

        <div className="flex flex-col justify-center items-center gap-y-4">
          <button disabled={isSubmitting}
            className={`${isSubmitting ? "opacity-[0.35]" : ""} bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
            type="submit"
          >
            Sign In
            <BottomGradient />
          </button>
        </div>
      </form>

    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default LoginForm;
