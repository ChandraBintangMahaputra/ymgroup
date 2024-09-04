import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AddPayment: React.FC = () => {
  const [payerName, setPayerName] = useState<string>("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentEvidence, setPaymentEvidence] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

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
    formData.append("payer_name", payerName);
    formData.append("amount", amount?.toString() || "");
    formData.append("payment_date", paymentDate);
    formData.append("status", status || ""); // Handle empty status
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
        window.location.reload(); // Reload halaman setelah 1 detik
      }, 1000);
      
      // Reset the form
      setPayerName("");
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
    // Check if all fields are filled
    const isValid =
      payerName.trim() !== "" &&
      amount !== undefined &&
      paymentDate.trim() !== "" &&
      status.trim() !== "" &&
      paymentEvidence !== null;
    setIsFormValid(isValid);
  }, [payerName, amount, paymentDate, status, paymentEvidence]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="payerName" className="block font-medium">
            Payer Name
          </label>
          <input
            id="payerName"
            type="text"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            placeholder="Payer Name"
            className="p-2 border border-gray-300 rounded w-full"
            required
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
