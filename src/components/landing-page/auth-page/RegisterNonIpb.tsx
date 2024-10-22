import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  FaUser,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import ButtonGradient from "../../../assets/svg/ButtonGradient";
import SecondHeader from "../SecondHeader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Captcha from "../../ui/Captcha";
import Swal from "sweetalert2";
import { IoKey } from "react-icons/io5";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_in: Date;
  gender: string;
  position: string;
  faculty: string;
  prodi: string;
  institution: string;
  token: string;
  captcha: boolean;
}

const RegisterNonIpb = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
  });

  const navigate = useNavigate();
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

    // Criteria for validation
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const [captchaValid, setCaptchaValid] = useState<boolean>(false);

  const handleCaptchaVerification = (isValid: boolean) => {
    setCaptchaValid(isValid);
    if (isValid) {
      console.log("woii");
      clearErrors("captcha");
    } else {
      console.log("woii lahh");
      setError("captcha", { type: "manual", message: "Captcha is incorrect" });
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form Submitted");
    console.log("Captcha Valid on Submit:", captchaValid);
    if (!captchaValid) {
      toast.error("Please solve the captcha correctly.");
      return;
    }

    try {
      const emailCheckResponse = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/master/check-email/${
          data.email
        }`
      );
      const emailCheckResult = await emailCheckResponse.json();

      console.log(emailCheckResult);

      console.log("Required fields validation passed.");

      if (
        emailCheckResponse.status === 200 && emailCheckResult.message === "Record Found"
      ) {
        Swal.fire(
         "Error!", "Email is already registered. Please use a different email.", "error"
        );
        return;
      }

      if (
        emailCheckResponse.status === 200 &&
        emailCheckResult.error.message === "Record not found"
      ) {
        const formData = new FormData();
        console.log("Form Data:", data);

        if (!data.password) {
          throw new Error("Password is required");
        }

        if (data.token) {
          const checkToken = await fetch(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/check-token/${data.token}`
          );
  
          const checkTokenResult = await checkToken.json();
          if (checkTokenResult.status === 200 && checkTokenResult.message === "Record Found") {
            formData.append("adminTrue", "benar");
          } else {
            Swal.fire("Error!", "Token tidak valid, harap masukkan token yang benar atau kosongkan field", "error");
            return;
          }
        }

        // Append only filled fields
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.password) formData.append("password", data.password);
        if (data.gender) formData.append("gender", data.gender);
        if (data.position) formData.append("position", data.position);
        if (data.institution) formData.append("institution", data.institution);

        const response = await axios.post(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/register-non-ipb`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.message === "User registered successfully") {
          toast.success("Data has been successfully saved.");
          setTimeout(() => {
            navigate("/verify-email");
          }, 1000);
        } else {
          toast.error("Failed to save Data.");
        }

        console.log(response.data);
      }
    } catch (error) {
      toast.error("Failed to submit the form");
      // console.error("Error submitting form:", error);
    }
  };

  return (
    <main className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden mt-10">
      <SecondHeader />
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      <div
        className="max-w-4xl mx-auto p-4 mt-9 mb-5 md:p-8 rounded-lg shadow-lg bg-white"
        style={{
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Pendaftaran Non IPB</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                Nama Lengkap<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaUser className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Nama Lengkap Wajib diisi" }}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Masukkan Nama Lengkap"
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                Email<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaEnvelope className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email Wajib Diisi",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Format email tidak valid",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      type="email"
                      placeholder="Masukkan Email"
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

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
                      required: "Kata Sandi Wajib Diisi",
                      minLength: {
                        value: 8,
                        message: "Kata Sandi harus terdiri minimal 8 karakter",
                      },
                      validate: (value) => {
                        const hasUppercase = /[A-Z]/.test(value);
                        const hasLowercase = /[a-z]/.test(value);
                        if (!hasUppercase || !hasLowercase) {
                          return "Kata sandi harus mengandung huruf kecil dan huruf besar";
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
                Konfirmasi Kata Sandi
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mb-0 relative flex items-center border border-gray-300 rounded-md">
                <RiLockPasswordFill className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{
                    required: "Konfirmasi Kata Sandi Wajib Diisi",
                    validate: (value) =>
                      value === password || "Kata Sandi Tidak Sama",
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

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                Institusi <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border rounded-md">
                <FaBuilding className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="institution"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="w-full p-2 border bg-white text-gray-700"
                    />
                  )}
                />
              </div>
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                Posisi <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaHandHoldingHeart className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="position"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      placeholder="Pilih Posisi"
                      options={[
                        { value: "Mahasiswa", label: "Mahasiswa" },
                        { value: "Dosen", label: "Dosen" },
                        { value: "Staff", label: "Staff" },
                        { value: "Junior Staff", label: "Junior Staff" },
                        { value: "Senior Staff", label: "Senior Staff" },
                        { value: "Supervisor", label: "Supervisor" },
                        { value: "Ast. Manager", label: "Ast. Manager" },
                        { value: "Manager", label: "Manager" },
                        { value: "Senior Manager", label: "Senior Manager" },
                        { value: "Contract", label: "Contract" },
                        { value: "Internship", label: "Internship" },
                        { value: "Founder", label: "Founder" },
                        { value: "CO-Founder", label: "CO-Founder" },
                        { value: "Member", label: "Member" }

                      ]}
                      onChange={(option) => field.onChange(option?.value)}
                      value={
                        field.value
                          ? {
                              value: field.value,
                              label:
                                field.value.charAt(0).toUpperCase() +
                                field.value.slice(1),
                            }
                          : null
                      }
                      className="w-full"
                    />
                  )}
                />
              </div>
              {errors.position && (
                <p className="text-red-500 text-xs mt-1">Posisi Wajib Diisi</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Jenis Kelamin<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center rounded-md">
              <Controller
                name="gender"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <div className="flex space-x-4">
                      <label>
                        <input
                          type="radio"
                          value="laki-laki"
                          checked={field.value === "laki-laki"}
                          onChange={() => field.onChange("laki-laki")}
                          onBlur={field.onBlur}
                        />
                        <span className="ml-1">Laki-laki</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="perempuan"
                          checked={field.value === "perempuan"}
                          onChange={() => field.onChange("perempuan")}
                          onBlur={field.onBlur}
                        />
                        <span className="ml-1">Perempuan</span>
                      </label>
                    </div>
                    {error && (
                      <p className="text-red-500 text-xs ml-2">
                        Jenis Kelamin Wajib Diisi
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2 mt-4">
                Token (opsional)
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <IoKey className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="token"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Masukkan token jika punya"
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

          </div>

          <div className="flex flex-col items-start rounded-md mb-4">
            <h1 className="text-lg font-bold mb-4">
              Captcha<span className="text-red-500 ml-1">*</span>
            </h1>
            <Controller
              name="captcha"
              control={control}
              render={({ field }) => (
                <Captcha
                  onVerify={(isValid) => {
                    handleCaptchaVerification(isValid);
                    field.onChange(isValid);
                  }}
                />
              )}
            />
            {errors.captcha && (
              <p className="text-red-500 mt-2">{errors.captcha.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-gray-300 text-white py-2 px-4 rounded-md"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md shadow-md flex items-center"
            >
              <ButtonGradient />
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegisterNonIpb;
