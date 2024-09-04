import React, { useState, useEffect } from "react";
import Sidebar from "../../ui/Sidebar";
import Navbar from "../../ui/Navbar";
import { useSidebar } from "../../../contexts/SidebarContext";
import AddCompanyVisit from "./AddCompanyVisit";
import EditCompanyVisit from "./EditCompanyVisit";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Data: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const [companyVisits, setCompanyVisits] = useState<any[]>([]);
  const [view, setView] = useState<'table' | 'add' | 'edit'>('table');
  const [editData, setEditData] = useState<any>(null);

  const fetchCompanyVisits = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/get-company`);
      setCompanyVisits(response.data.data);
    } catch (error) {
      console.error("Error fetching company visits:", error);
    }
  };

  useEffect(() => {
    fetchCompanyVisits();
  }, []);

  const handleEdit = (companyVisit: any) => {
    setEditData(companyVisit);
    setView('edit');
  };

  const handleDelete = (id: number) => {
    const confirmToast = toast(
        <div>
            <p className="mb-5">
                Are you sure you want to delete this company visit entry?
            </p>
            <button
                onClick={async () => {
                    try {
                        await axios.delete(
                            `${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/delete-company/${id}`
                        );

                        toast.dismiss(confirmToast); 
                        fetchCompanyVisits(); // Refresh data after deletion
                        toast.success("Company visit entry deleted successfully.");
                        
                    } catch (error) {
                        toast.dismiss(confirmToast);
                        toast.error("Failed to delete company visit entry.");
                        console.error("Error deleting company visit:", error);
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
    fetchCompanyVisits(); 
    setView('table');
  };

  return (
    <div className="flex">
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />
      <Sidebar />
      <div
        className={`flex-1 p-6 pt-20 transition-all duration-300`}
        style={{
          paddingLeft: isSidebarOpen ? '18rem' : '6rem',
        }}
      >
        <Navbar />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Company Visit</h2>
          {view !== 'table' && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
              onClick={handleClose}
            >
              <FaPlus className="mr-2" />
              Close
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          {view === 'table' && (
            <>
              <button
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                onClick={() => setView('add')}
              >
                <FaPlus className="mr-2" />
                Add Company Visit
              </button>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2">No</th>
                      <th className="px-6 py-3 border-b-2">Company Name</th>
                      <th className="px-6 py-3 border-b-2">Status</th>
                      <th className="px-6 py-3 border-b-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyVisits?.length > 0 ? (
                      companyVisits.map((companyVisit, index) => (
                        <tr key={companyVisit.id}>
                          <td className="px-6 py-4 border-b text-center">{index + 1}</td>
                          <td className="px-6 py-4 border-b text-center">{companyVisit.company_name}</td>
                          <td className="px-6 py-4 border-b text-center">{companyVisit.status}</td>
                          <td className="px-6 py-4 border-b text-center flex justify-center">
                            <button
                              className="mr-2 text-blue-500"
                              onClick={() => handleEdit(companyVisit)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-500"
                              onClick={() => handleDelete(companyVisit.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          Data not found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {view === 'add' && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Add Company Visit</h2>
              <AddCompanyVisit />
            </div>
          )}
          {view === 'edit' && editData && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Edit Company Visit</h2>
              <EditCompanyVisit companyId={editData?.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Data;
