import React from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  nim: string;
  name: string;
}

const AddStudent: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/add-student`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
        toast.success("Add data successful!");
        setTimeout(() => {
            window.location.reload(); // Reload halaman setelah 1 detik
          }, 1000);
        reset(); // Reset the form fields on successful submission
      } else {
        console.error("Failed to submit form:", await response.text());
        toast.error("Add data failed!");
      }
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="mb-4">
        <label
          htmlFor="nim"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nim
        </label>
        <input
          id="nim"
          type="text"
          {...register("nim", {
            required: "Nim is required",
          })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.nim && (
          <p className="text-red-500 text-xs italic">
            {errors.nim.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "Name is required",
          })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
        <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      </div>
    </form>
  );
};

export default AddStudent;
