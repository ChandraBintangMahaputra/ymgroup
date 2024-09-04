import React, { useState, useEffect } from "react";
import Sidebar from "../../ui/Sidebar";
import Navbar from "../../ui/Navbar";
import { useSidebar } from "../../../contexts/SidebarContext";
import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Student: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const [students, setStudents] = useState<any[]>([]);
  const [view, setView] = useState<'table' | 'add' | 'edit'>('table');
  const [editData, setEditData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/get-student`);
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student: any) => {
    setEditData(student);
    setView('edit');
  };

  const handleDelete = (id: number) => {
    const confirmToast = toast(
        <div>
            <p className="mb-5">
                Are you sure you want to delete this student entry?
            </p>
            <button
                onClick={async () => {
                    try {
                        await axios.delete(
                            `${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/delete-student/${id}`
                        );

                        toast.dismiss(confirmToast); 
                        fetchStudents(); 
                        toast.success("Student entry deleted successfully.");
                        
                    } catch (error) {
                        toast.dismiss(confirmToast);
                        toast.error("Failed to delete student entry.");
                        console.error("Error deleting student:", error);
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
    fetchStudents(); 
    setView('table');
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nim.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h2 className="text-2xl font-bold">Students</h2>
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
              <div className="flex justify-between mb-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => setView('add')}
                >
                  <FaPlus className="mr-2" />
                  Add Student
                </button>
                <input
                  type="text"
                  placeholder="Search by name or NIM"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded p-2"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2">No</th>
                      <th className="px-6 py-3 border-b-2">Nim</th>
                      <th className="px-6 py-3 border-b-2">Name</th>
                      <th className="px-6 py-3 border-b-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 border-b text-center">{index + 1}</td>
                          <td className="px-6 py-4 border-b text-center">{student.nim}</td>
                          <td className="px-6 py-4 border-b text-center">{student.name}</td>
                          <td className="px-6 py-4 border-b text-center flex justify-center">
                            <button
                              className="mr-2 text-blue-500"
                              onClick={() => handleEdit(student)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-500"
                              onClick={() => handleDelete(student.id)}
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
              <h2 className="text-2xl font-semibold mb-4">Add Student</h2>
              <AddStudent />
            </div>
          )}
          {view === 'edit' && editData && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Edit Student</h2>
              <EditStudent studentId={editData?.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;
