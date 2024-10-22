import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import ButtonGradient from "../../../assets/svg/ButtonGradient";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";


interface FormData {
  password: string;
  confirm_password: string;
 
}

const ResetPassword = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {

    },
  });

  const navigate = useNavigate();
  const { id: id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");

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

        if (!data.password) {
          throw new Error("Password is required");

          
        }

        if (data.password) formData.append("password", data.password);

        const response = await axios.put(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/reset-password/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (
          response.status === 200 &&
          response.data.message ===
            "New password has been successfully saved."
        ) {
          toast.success("New password has been successfully saved.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          toast.error("Failed to save new password.");
        }

        console.log(response.data);



    } catch (error) {
      toast.error("Failed to submit the form");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <main className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      <div
        className="max-w-4xl mx-auto p-4 mt-9 mb-5 md:p-8 rounded-lg shadow-lg bg-white"
        style={{
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Atur Ulang Kata Sandi</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                Kata Sandi<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative flex flex-col items-start border border-gray-300 rounded-md">
                <div className="w-full flex items-center">
                  <RiLockPasswordFill className="ml-3 mr-3 text-gray-500" />
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "kata sandi wajib di isi",
                      minLength: {
                        value: 8,
                        message: "kata sandi setidaknya terdiri dari 8 karakter",
                      },
                      validate: (value) => {
                        const hasUppercase = /[A-Z]/.test(value);
                        const hasLowercase = /[a-z]/.test(value);
                        if (!hasUppercase || !hasLowercase) {
                          return "kata sandi harus mengandung huruf besar dan huruf kecil";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan kata sandi"
                        className="w-full py-2 px-3 border-none outline-none"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-500"
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
              <p className="text-xs text-gray-500 mb-1 mt-2">
                <span className="text-red-500 ml-1">*</span>Password minimal 8
                karakter (kombinasi angka, huruf besar, huruf kecil, dan spesial
                karakter #$^+=!*()@%&)
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
                  ></div>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                Konfirmasi Kata Sandi<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mb-0 relative flex items-center border border-gray-300 rounded-md">
                <RiLockPasswordFill className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{
                    required: "Konfirmasi Kata Sandi Wajib di Isi",
                    validate: (value) =>
                      value === password || "Kata Sandi tidak sama",
                  }}
                  render={({ field }) => (
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi Kata Sandi"
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>


          </div>


          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md shadow-md flex items-center"
            >
              <ButtonGradient />
              Kirim
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
