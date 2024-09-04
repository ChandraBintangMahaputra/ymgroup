import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  company_name: string;
  status: string;
}

interface EditCompanyVisitProps {
  companyId: number;
}

const EditCompanyVisit: React.FC<EditCompanyVisitProps> = ({ companyId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const fetchCompanyData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/company/${companyId}`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const company = result.data[0];
          // Populate the form with the fetched data
          reset({
            company_name: company.company_name,
            status: company.status,
          });
        } else {
          toast.error("Company data not found!");
        }
      } else {
        console.error("Failed to fetch company data:", await response.text());
        toast.error("Failed to fetch company data!");
      }
    } catch (error) {
      console.error("Error occurred while fetching company data:", error);
      toast.error("An error occurred while fetching company data.");
    }
  };
  
    useEffect(() => {
      fetchCompanyData();
    }, [companyId, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/edit-company/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
        fetchCompanyData()
        toast.success("Edit data successful!");
        setTimeout(() => {
          window.location.reload(); // Reload halaman setelah 1 detik
        }, 1000);
      } else {
        console.error("Failed to submit form:", await response.text());
        toast.error("Edit data failed!");
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
          htmlFor="company_name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Company Name
        </label>
        <input
          id="company_name"
          type="text"
          {...register("company_name", {
            required: "Company name is required",
          })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.company_name && (
          <p className="text-red-500 text-xs italic">
            {errors.company_name.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="status"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Status
        </label>
        <select
          id="status"
          {...register("status", { required: "Status is required" })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Status</option>
          <option value="belum diproses">Belum Diproses</option>
          <option value="menunggu jawaban">Menunggu Jawaban</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-xs italic">{errors.status.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
        <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      </div>
    </form>
  );
};

export default EditCompanyVisit;
