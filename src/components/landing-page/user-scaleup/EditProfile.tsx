import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaCity,
  FaBuilding,
  FaHandHoldingHeart,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import ButtonGradient from "../../../assets/svg/ButtonGradient";
import { FaLandmark } from "react-icons/fa6";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDarkMode } from "../../../constants/DarkModeProvider";

interface FormData {
  name: string;
  email: string;
  date_in: Date;
  gender: string;
  position: string;
  faculty: string;
  prodi: string;
  institution: string;
  [key: string]: string | Date;
}

const EditProfile = () => {
  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {},
  });

  const [faculties, setFaculties] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isProdiDisabled, setIsProdiDisabled] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isIPB, setIsIPB] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const {darkMode} = useDarkMode()

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
      setIsIPB(parsedUserData.isIPB);
    }
  }, []);

  useEffect(() => {
    if (userId) {
    }
  }, [userId]);

  useEffect(() => {
    if (isIPB) {
    }
  }, [isIPB]);


const fetchProfile = async (userId:any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/profile/${userId}`);
      const data = await response.json();
  
      if (data.success) {
        const profile = data.data[0];
  
        // Populate form fields
        setValue("name", profile.name.trim());
        setValue("email", profile.email);
        setValue("institution", profile.institution.trim());
        setValue("faculty", profile.faculty); // Ensure correct mapping
        setValue("prodi", profile.prodi); // Ensure correct mapping
        setValue("position", profile.position);
        setValue("date_in", new Date(profile.date_in));
        setValue("gender", profile.gender); // Correctly set gender based on API response
  
        setInitialData({
          name: profile.name.trim(),
          email: profile.email,
          institution: profile.institution.trim(),
          faculty: profile.faculty,
          prodi: profile.prodi,
          position: profile.position,
          date_in: new Date(profile.date_in),
          gender: profile.gender,
        });
  
        const selectedFacultyOption = faculties.find(
          (faculty) => faculty.label === profile.faculty
        );
        if (selectedFacultyOption) {
          setValue("faculty", selectedFacultyOption.value); // Set faculty to its value (id)
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchProfile(userId); // Call the fetchProfile function with userId
    }
  }, [userId, faculties, setValue]);
  

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/master/get-faculty`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          const facultyOptions = data.data.map(
            (faculty: { id: number; description: string }) => ({
              value: faculty.id, // Ensure value is the id
              label: faculty.description,
            })
          );
          setFaculties(facultyOptions);
        } else {
          console.error("Expected array but got:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  const selectedFacultyId = watch("faculty");

  useEffect(() => {
    if (selectedFacultyId) {
      setIsProdiDisabled(false);
      fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/master/get-study-program/${selectedFacultyId}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.data)) {
            const prodiOptions = data.data.map(
              (prodi: { description: string }) => ({
                value: prodi.description,
                label: prodi.description,
              })
            );
            setCities(prodiOptions);
          } else {
            console.error("Expected array but got:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    } else {
      setIsProdiDisabled(true);
    }
  }, [selectedFacultyId]);

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

  const onSubmit = async (data: FormData) => {
    console.log("Form Submitted");

    try {
      // First, check if isIPB is 1
      if (isIPB === 1) {
        const emailDomain = "@apps.ipb.ac.id";
        // Check if the email ends with the specified domain
        if (!data.email.endsWith(emailDomain)) {
          Swal.fire("Error!", "Gunakan email IPB", "error");
          return;
        }
      }

      // Check for changes in form data
      const changedData: Partial<FormData> = {};
      for (const key in data) {
        if (
          data[key as keyof FormData] !== initialData?.[key as keyof FormData]
        ) {
          changedData[key as keyof FormData] = data[key as keyof FormData];
        }
      }

      // If no changes are detected, show a toast notification
      if (Object.keys(changedData).length === 0) {
        toast.info("Tidak ada perubahan.");
        return;
      }

      // Prepare form data for API request
      const formData = new FormData();
      for (const key in changedData) {
        const value = changedData[key as keyof FormData];
        if (value !== undefined) {
          formData.append(
            key,
            value instanceof Date ? value.toISOString() : value
          );
        }
      }

      // If the email has changed, check the email
      if (changedData.email) {
        const emailCheckResponse = await fetch(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/master/check-email/${
            data.email
          }`
        );
        const emailCheckResult = await emailCheckResponse.json();

        console.log("respon", emailCheckResult);

        // Error handling for email check
        if (emailCheckResult.status === 200) {
          if (emailCheckResult.message === "Record Found") {
            Swal.fire(
              "Error!",
              "Email is already registered. Please use a different email.",
              "error"
            );
            return;
          }

          if (emailCheckResult.error.message === "Record not found") {
            // Proceed to update user data if email is valid
            console.log(formData)
            const response = await axios.put(
              `${
                import.meta.env.VITE_PREFIX_BACKEND
              }/api/auth/user-data/${userId}`,
              formData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.data.success) {
              toast.success("Data has been successfully saved.");
              fetchProfile(userId)
            } else {
              toast.error("Failed to save data.");
            }

            console.log(response.data);
          }
        }
      } else {
        // If the email hasn't changed, proceed directly to the API call
        const response = await axios.put(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/user-data/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          toast.success("Data has been successfully saved.");
        } else {
          toast.error("Failed to save data.");
        }

        console.log(response.data);
      }
    } catch (error) {
      toast.error("Failed to submit the form");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <main className=" overflow-hidden">
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      <div
        className={`max-w-4xl mx-auto p-4 mt-9 mb-5 md:p-8 rounded-lg shadow-lg ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} `}
        style={{
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="mb-1">
              <label className="block font-medium mb-2">
                Nama Lengkap<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border rounded-md">
                <FaUser className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Masukkan Nama Lengkap"
                      className={`w-full py-2 px-3 border-none outline-none ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className="mb-1">
              <label className="block font-medium mb-2">
                {isIPB === 1 ? "Email IPB" : "Email"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaEnvelope className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Format email tidak valid",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      type="email"
                      placeholder="Masukkan Email IPB"
                      className={`w-full py-2 px-3 border-none outline-none ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            {isIPB === 1 && (
              <div className="mb-1">
                <label className="block font-medium mb-2">
                  Tanggal Masuk<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <FaCalendarAlt className="ml-3 text-gray-500 mr-2" />
                  <Controller
                    name="date_in"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <DatePicker
                        placeholderText="dd/mm/yyyy"
                        dateFormat="dd/MM/yyyy"
                        selected={value ? new Date(value) : null}
                        onChange={(date: Date | null) => onChange(date)}
                        onBlur={onBlur}
                        className={`w-full py-2 px-3 border-none outline-none ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                        ref={ref}
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                      />
                    )}
                  />
                </div>
              </div>
            )}

            <div className="mb-1">
              <label className="block font-medium mb-2">
                Jenis Kelamin<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center rounded-md">
                <Controller
                  name="gender"
                  control={control}
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
            </div>

            <div className="mb-1">
              <label className="block font-medium mb-2">
                Institusi <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center rounded-md border">
                <FaBuilding className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="institution"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full p-2 bg-gray-100 text-gray-700 border ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                    />
                  )}
                />
              </div>
            </div>

            <div className="mb-1">
              <label className="block font-medium mb-2">
                Posisi <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaHandHoldingHeart className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Select
                      placeholder="Pilih Posisi"
                      options={
                        isIPB === 1
                          ? [
                              { value: "Mahasiswa", label: "Mahasiswa" },
                              { value: "Dosen", label: "Dosen" },
                              { value: "Lainnya", label: "Lainnya" },
                            ]
                          : [
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
                              { value: "Member", label: "Member" },
                            ]
                      }
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
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: darkMode ? 'gray-700' : 'white',
                          borderColor: darkMode ? 'gray' : 'lightgray',
                        }),
                        singleValue: (baseStyles) => ({
                          ...baseStyles,
                          color: darkMode ? 'white' : 'black',
                        }),
                        placeholder: (baseStyles) => ({
                          ...baseStyles,
                          color: darkMode ? 'lightgray' : 'gray',
                        }),
                        dropdownIndicator: (baseStyles) => ({
                          ...baseStyles,
                          color: darkMode ? 'white' : 'black',
                        }),
                        menu: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: darkMode ? 'gray' : 'white',
                        }),
                        option: (baseStyles, { isFocused }) => ({
                          ...baseStyles,
                          backgroundColor: isFocused
                            ? darkMode
                              ? 'darkgray'
                              : 'lightgray'
                            : darkMode
                            ? 'gray'
                            : 'white',
                          color: darkMode ? 'white' : 'black',
                        }),
                      }}
                      className={`w-full ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                    />
                  )}
                />
              </div>
            </div>

            {isIPB === 1 && (
              <div className="mb-1">
                <label className="block font-medium mb-2">
                  Fakultas <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <FaLandmark className="ml-3 mr-3 text-gray-500" />
                  <Controller
                    name="faculty"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Pilih Fakultas"
                        options={faculties}
                        onChange={(option) => {
                          setValue("faculty", option?.value);
                          field.onChange(option?.value);
                        }}
                        value={faculties.find(
                          (faculty) => faculty.value === field.value
                        )}
                        styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              backgroundColor: darkMode ? 'gray-700' : 'white',
                              borderColor: darkMode ? 'gray' : 'lightgray',
                            }),
                            singleValue: (baseStyles) => ({
                              ...baseStyles,
                              color: darkMode ? 'white' : 'black',
                            }),
                            placeholder: (baseStyles) => ({
                              ...baseStyles,
                              color: darkMode ? 'lightgray' : 'gray',
                            }),
                            dropdownIndicator: (baseStyles) => ({
                              ...baseStyles,
                              color: darkMode ? 'white' : 'black',
                            }),
                            menu: (baseStyles) => ({
                              ...baseStyles,
                              backgroundColor: darkMode ? 'gray' : 'white',
                            }),
                            option: (baseStyles, { isFocused }) => ({
                              ...baseStyles,
                              backgroundColor: isFocused
                                ? darkMode
                                  ? 'darkgray'
                                  : 'lightgray'
                                : darkMode
                                ? 'gray'
                                : 'white',
                              color: darkMode ? 'white' : 'black',
                            }),
                          }}
                        className={`w-full ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {isIPB === 1 && (
              <div className="mb-1">
                <label className="block font-medium mb-2">
                  Program Studi <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <FaCity className="ml-3 mr-3 text-gray-500" />
                  <Controller
                    name="prodi"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Pilih Program Studi"
                        options={cities}
                        onChange={(option) => field.onChange(option?.value)}
                        value={cities.find(
                          (prodi) => prodi.value === field.value
                        )}
                        styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              backgroundColor: darkMode ? 'gray-700' : 'white',
                              borderColor: darkMode ? 'gray' : 'lightgray',
                            }),
                            singleValue: (baseStyles) => ({
                              ...baseStyles,
                              color: darkMode ? 'white' : 'black',
                            }),
                            placeholder: (baseStyles) => ({
                              ...baseStyles,
                              color: darkMode ? 'lightgray' : 'gray',
                            }),
                            dropdownIndicator: (baseStyles) => ({
                              ...baseStyles,
                              color: darkMode ? 'white' : 'black',
                            }),
                            menu: (baseStyles) => ({
                              ...baseStyles,
                              backgroundColor: darkMode ? 'gray' : 'white',
                            }),
                            option: (baseStyles, { isFocused }) => ({
                              ...baseStyles,
                              backgroundColor: isFocused
                                ? darkMode
                                  ? 'darkgray'
                                  : 'lightgray'
                                : darkMode
                                ? 'gray'
                                : 'white',
                              color: darkMode ? 'white' : 'black',
                            }),
                          }}
                        className={`w-full ${darkMode ? "bg-gray-600 text-white border" : "bg-white text-black"}`}
                        isDisabled={isProdiDisabled}
                      />
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md shadow-md flex items-center"
            >
              <ButtonGradient />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfile;
