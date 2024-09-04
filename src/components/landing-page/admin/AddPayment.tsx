import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPayment: React.FC = () => {
  const [payerOptions, setPayerOptions] = useState<{ value: string; label: string }[]>([]);
  const [payer, setPayer] = useState<{ name: string; nim: string } | null>(null);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentEvidence, setPaymentEvidence] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    const fetchPayers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/filter-student`);
        const options = response.data.data.map((student: { nim: string; name: string }) => ({
          value: student.nim,
          label: student.name,
        }));
        setPayerOptions(options);
      } catch (error) {
        console.error("Error fetching payer data", error);
      }
    };
    fetchPayers();
  }, []);

  const handlePayerChange = (selectedOption: any) => {
    setPayer({ name: selectedOption.label, nim: selectedOption.value });
  };

  const generateUniqueFileName = (originalName: string) => {
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    const timestamp = new Date().getTime();
    const extension = originalName.split(".").pop();
    return `Payment${uniqueNumber}${timestamp}.${extension}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const adminName = userData.name || "Admin";
  
    const formData = new FormData();
    if (payer) {
      formData.append("payer_name", payer.name);
      formData.append("payer_nim", payer.nim); // Append the nim
    }
    formData.append("amount", amount?.toString() || "");
    formData.append("payment_date", paymentDate);
    formData.append("status", status || "");
    formData.append("created_by", adminName);
  
    if (paymentEvidence) {
      const modifiedFileName = generateUniqueFileName(paymentEvidence.name);
      const modifiedFile = new File([paymentEvidence], modifiedFileName, {
        type: paymentEvidence.type,
      });
      formData.append("payment_evidence", modifiedFile);
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/add-payment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Add Data Payment successful!");
      console.log("Payment added successfully", response.data);
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
      
      setPayer(null);
      setAmount(undefined);
      setPaymentDate("");
      setPaymentEvidence(null);
      setImagePreview(null);
      setStatus("");
    } catch (error) {
      console.error("Error adding payment", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setPaymentEvidence(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    const isValid =
      payer !== null &&
      amount !== undefined &&
      paymentDate.trim() !== "" &&
      status.trim() !== "" &&
      paymentEvidence !== null;
    setIsFormValid(isValid);
  }, [payer, amount, paymentDate, status, paymentEvidence]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="space-y-2">
          <label htmlFor="payerName" className="block font-medium ">
            Payer Name
          </label>
          <Select
            id="payerName"
            options={payerOptions}
            onChange={handlePayerChange}
            placeholder="Search Payer Name"
            className="p-2 border border-gray-300 rounded w-full"
            isClearable
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="block font-medium">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Select status</option>
            <option value="Cicilan pertama">Cicilan pertama</option>
            <option value="Cicilan kedua">Cicilan kedua</option>
            <option value="Lunas">Lunas</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="paymentDate" className="block font-medium">
            Payment Date
          </label>
          <input
            id="paymentDate"
            type="datetime-local"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            placeholder="Payment Date"
            className="p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="block font-medium">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount !== undefined ? amount.toString() : ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount"
            className="p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="paymentEvidence" className="block font-medium">
          Payment Evidence
        </label>
        <input
          id="paymentEvidence"
          type="file"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded w-full"
          accept="image/*"
          required
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Selected Payment Evidence"
              className="max-h-40 object-cover rounded"
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
          isFormValid ? "" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!isFormValid}
      >
        Add Payment
      </button>
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
    </form>
  );
};

export default AddPayment;
