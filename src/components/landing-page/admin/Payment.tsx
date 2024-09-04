import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../ui/Sidebar";
import Navbar from "../../ui/Navbar";
import { useSidebar } from "../../../contexts/SidebarContext";
import AddPayment from "./AddPayment";
import EditPayment from "./EditPayment";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const [payments, setPayments] = useState<any[]>([]);
  const [view, setView] = useState<"table" | "add" | "edit" | "view">("table");
  const [editData, setEditData] = useState<any | null>(null);
  const [viewData, setViewData] = useState<any | null>(null);

  // New States for Pagination and Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);



  const fetchPayments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/payment`
      );
      setPayments(response.data.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);
  

  const handleEdit = (payment: any) => {
    setEditData(payment);
    setView("edit");
  };

  const handleView = (payment: any) => {
    setViewData(payment);
    setView("view");
  };

  const handleDelete = (id: number) => {
    console.log("hello")
    const confirmToast = toast(
        <div>
            <p className="mb-5">
                Are you sure you want to delete this payment entry?
            </p>
            <button
                onClick={async () => {
                    try {
                        console.log("try")
                        await axios.delete(
                            `${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/delete-payment/${id}`
                        );
                        toast.dismiss(confirmToast); 
                        toast.success("Payment entry deleted successfully.");

                       
                        setPayments((prevPayments) =>
                            prevPayments.filter((payment) => payment.id !== id)
                        );
                    } catch (error) {
                        toast.dismiss(confirmToast);
                        toast.error("Failed to delete payment entry.");
                        console.error("Error deleting payment:", error);
                    }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
            >
                Yes
            </button>
            <button
                onClick={() => toast.dismiss(confirmToast)}
                className="bg-gray-600 text-white px-4 py-2 rounded ml-2"
            >
                No
            </button>
        </div>,
        {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        }
    );
};

  

  const handleClose = () => {
    fetchPayments();
    setView("table");
  };

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredPayments = (payments || []).filter((payment) =>
    Object.values(payment).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Generate Page Numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex">
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      <Sidebar />
      <div
        className={`flex-1 p-6 pt-20 transition-all duration-300`}
        style={{
          paddingLeft: isSidebarOpen ? "18rem" : "6rem",
        }}
      >
        <Navbar />
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Payment Page</h2>
            {(view === "add" || view === "edit" || view === "view") && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleClose}
              >
                Close
              </button>
            )}
          </div>

          {view === "table" && (
            <>
              <div className="flex justify-between mb-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => setView("add")}
                >
                  <FaPlus className="mr-2" /> Add Payment
                </button>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border rounded px-3 py-2 w-1/3"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2">No</th>
                      <th className="px-6 py-3 border-b-2">Payer Name</th>
                      <th className="px-6 py-3 border-b-2">Amount</th>
                      <th className="px-6 py-3 border-b-2">Payment Date</th>
                      <th className="px-6 py-3 border-b-2">Payment Evidence</th>
                      <th className="px-6 py-3 border-b-2">Status</th>
                      <th className="px-6 py-3 border-b-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPayments.length > 0 ? (
                      currentPayments.map((payment, index) => (
                        <tr
                          key={payment.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          }
                        >
                          <td className="px-6 py-4 border-b text-center">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-6 py-4 border-b text-center">
                            {payment.payer_name}
                          </td>
                          <td className="px-6 py-4 border-b text-center">
                            {payment.amount}
                          </td>
                          <td className="px-6 py-4 border-b text-center">
                            {new Date(
                              payment.payment_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 border-b flex items-center justify-center">
                            <a
                              href={`${import.meta.env.VITE_PHOTO_PREFIX}/${
                                payment.payment_evidence
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`${import.meta.env.VITE_PHOTO_PREFIX}/${
                                  payment.payment_evidence
                                }`}
                                alt="Payment Evidence"
                                className="w-16 h-16 object-cover"
                              />
                            </a>
                          </td>
                          <td className="px-6 py-4 border-b text-center">
                            {payment.status}
                          </td>
                          <td className="px-6 py-4 border-b text-center">
                            <button
                              className="mr-2 text-blue-500 h-16"
                              onClick={() => handleView(payment)}
                            >
                              <FaEye />
                            </button>
                            <button
                              className="mr-2 text-blue-500 h-16"
                              onClick={() => handleEdit(payment)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-500 h-16"
                              onClick={() => handleDelete(payment.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          Data not found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                {/* Items Per Page Selector */}
                <div>
                  <label htmlFor="itemsPerPage" className="mr-2">
                    Items per page:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when items per page changes
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Page Numbers */}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    Previous
                  </button>
                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-1 rounded ${
                        currentPage === number
                          ? "bg-blue-700 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {view === "add" && <AddPayment />}
          {view === "edit" && <EditPayment paymentId={editData?.id} />}
          {view === "view" && viewData && (
            <div>
              <h3 className="text-xl font-bold mb-4">View Payment</h3>
              <table className="table-auto border-collapse w-full">
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">
                      Payer Name
                    </td>
                    <td className="border px-4 py-2">{viewData.payer_name}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Amount</td>
                    <td className="border px-4 py-2">{viewData.amount}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">
                      Payment Date
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(viewData.payment_date).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">
                      Created By
                    </td>
                    <td className="border px-4 py-2">{viewData.created_by}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Status</td>
                    <td className="border px-4 py-2">{viewData.status}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">
                      Date Created
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(viewData.date_created).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">
                      Payment Evidence
                    </td>
                    <td className="border px-4 py-2">
                      <img
                        src={`${import.meta.env.VITE_PHOTO_PREFIX}/${
                          viewData.payment_evidence
                        }`}
                        alt="Payment Evidence"
                        className="mt-4 w-88 h-88 object-cover"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
