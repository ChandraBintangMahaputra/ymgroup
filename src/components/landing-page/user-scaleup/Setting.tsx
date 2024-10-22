import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import ButtonGradient from "../../../assets/svg/ButtonGradient";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useDarkMode } from "../../../constants/DarkModeProvider";

interface FormData {
  current_password: string;
  password: string;
  confirm_password: string;
}

const Setting = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({});
  const navigate = useNavigate();
  const {darkMode} = useDarkMode();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const password = watch("password");
  const [userId, setUserId] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
    }
  }, [userId]);

  const [passwordStrength, setPasswordStrength] = useState({
    strength: "",
    percentage: 0,
    color: "red",
  });

  const validatePasswordStrength = (password: string) => {
    let strength = "";
    let percentage = 0;
    let color = "red";

    const lengthCriteria = password.length >= 8;
    const numberCriteria = /\d/.test(password);
    const upperCriteria = /[A-Z]/.test(password);
    const lowerCriteria = /[a-z]/.test(password);
    const specialCriteria = /[#\$^+=!*()@%&]/.test(password);

    const fulfilledCriteria =
      +numberCriteria + +upperCriteria + +lowerCriteria + +specialCriteria;

    if (!lengthCriteria) {
      strength = "Terlalu Pendek";
      percentage = 0;
      color = "red";
    } else if (fulfilledCriteria === 1) {
      strength = "Lemah";
      percentage = 25;
      color = "red";
    } else if (fulfilledCriteria === 2) {
      strength = "Sedang";
      percentage = 50;
      color = "yellow";
    } else if (fulfilledCriteria === 3) {
      strength = "Kuat";
      percentage = 75;
      color = "lightgreen";
    } else if (fulfilledCriteria === 4) {
      strength = "Sangat Kuat";
      percentage = 100;
      color = "green";
    }

    setPasswordStrength({ strength, percentage, color });
  };

  useEffect(() => {
    if (password) validatePasswordStrength(password);
  }, [password]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      console.log("Form Data:", data);

      formData.append("current_password", data.current_password);

      console.log("Form Data:", data);

      const currentPasswordResponse = await axios.post(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/auth/check-current-password/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const checkingPassword = currentPasswordResponse.data;

      console.log("checking", checkingPassword);

      if (checkingPassword.message === "Password is correct") {
        if (!data.password) {
          throw new Error("Password is required");
        }

        if (data.password) formData.append("password", data.password);

        const response = await axios.put(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/reset-password/${userId}`,
          formData,
          {
            headers: {
                "Content-Type": "application/json",
              },
          }
        );

        if (
          response.status === 200 &&
          response.data.message === "New password has been successfully saved."
        ) {
          Swal.fire(
            "Success",
            "Your password has been change, please login again",
            "success"
          );
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          Swal.fire("Error", "There was a problem submitting", "error");
        }

        console.log(response.data);
      } else {
        Swal.fire("Error", "Current Password Wrong", "error");
      }
    } catch (error) {
      toast.error("Failed to submit the form");
      console.error("Error submitting form:", error);
    }
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
          <div className={`profile-card shadow-lg rounded-lg px-8 py-8 w-full lg:w-full mx-auto ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
              }`}>
            <form onSubmit={handleSubmit(onSubmit)} className="m-5 lg:m-0">
              <div className="text-center">
                <h2 className="font-bold mb-5">Change Password</h2>
              </div>
              <div className="mb-1">
                <label className="block font-medium mb-2">
                  Current Password<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative flex flex-col items-start border border-gray-300 rounded-md">
                  <div className="w-full flex items-center">
                    <RiLockPasswordFill className="ml-3 mr-3 text-gray-500" />
                    <Controller
                      name="current_password"
                      control={control}
                      rules={{
                        required: "Current password is required",
                      }}
                      render={({ field }) => (
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className={`w-full py-2 px-3 border-none outline-none ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
                {errors.current_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.current_password.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="mb-1">
                  <label className="block font-medium mb-2">
                    Password<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative flex flex-col items-start border border-gray-300 rounded-md">
                    <div className="w-full flex items-center">
                      <RiLockPasswordFill className="ml-3 mr-3 text-gray-500" />
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: "Password is Required",
                          minLength: {
                            value: 8,
                            message:
                              "Password must be at least 8 characters long",
                          },
                          validate: (value) => {
                            const hasUppercase = /[A-Z]/.test(value);
                            const hasLowercase = /[a-z]/.test(value);
                            if (!hasUppercase || !hasLowercase) {
                              return "Password must contain both uppercase and lowercase letters";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className={`w-full py-2 px-3 border-none outline-none ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                            {...field}
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 ${darkMode ? "text-white" : "text-gray-600"}`}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-xs mb-1 mt-2">
                    <span className="text-red-500 ml-1">*</span>Password minimal
                    8 karakter (kombinasi angka, huruf besar, huruf kecil, dan
                    spesial karakter #$^+=!*()@%&)
                  </p>
                  {/* Password Strength Indicator */}
                  <div className="mt-2 w-full">
                    <p className={`text-${passwordStrength.color}-500 text-xs`}>
                      {passwordStrength.strength}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${passwordStrength.percentage}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-1">
                  <label className="block font-medium mb-2">
                    Confirm Password<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative flex flex-col items-start border border-gray-300 rounded-md">
                    <div className="w-full flex items-center">
                      <RiLockPasswordFill className="ml-3 mr-3 text-gray-500" />
                      <Controller
                        name="confirm_password"
                        control={control}
                        rules={{
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        }}
                        render={({ field }) => (
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className={`w-full py-2 px-3 border-none outline-none ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                            {...field}
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={`absolute right-3 ${darkMode ? "text-white" : "text-gray-600"}`}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md shadow-md flex items-center"
              >
                <ButtonGradient />
                Submit
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Setting;
