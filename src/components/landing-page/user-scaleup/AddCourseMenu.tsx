import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface MenuCourse {
  id: number;
  description: string;
}

const reorder = (
  list: MenuCourse[],
  startIndex: number,
  endIndex: number
): MenuCourse[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const AddCourseMenu = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState<MenuCourse[]>([]);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [editedCourse, setEditedCourse] = useState<MenuCourse | null>(null); // Holds the course being edited

  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/add-menu-course`,
        { description: newCourseDescription, course_id: courseId }
      );

      if (response.data.success) {
        Swal.fire("Success", "Course added successfully", "success").then(
          () => {
            window.location.reload();
          }
        );
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add Course", "error");
    }
  };

  const handleEditCourse = async (id: number, description: string) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/course/edit-menu-course/${id}`,
        { description }
      );
      if (response.data.success) {
        Swal.fire("Success", "Course renamed successfully", "success").then(
          () => {
            window.location.reload();
          }
        );
      }
    } catch (error) {
      Swal.fire("Error", "Failed to rename Course", "error");
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/course/delete-menu-course/${id}`
      );
      if (response.data.success) {
        Swal.fire("Deleted", "Course deleted successfully", "success").then(
          () => {
            window.location.reload();
          }
        );
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete Course", "error");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/course/list-menu-course/${courseId}`
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleDropdown = (id: number) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const openEditModal = (course: MenuCourse) => {
    setEditedCourse(course); // Set the current course being edited
    setNewCourseDescription(course.description); // Pre-fill the modal input with the course description
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) {
      return;
    }

    const updatedCourses = reorder(courses, source.index, destination.index);
    setCourses(updatedCourses);

    // Buat array yang akan dikirim ke backend untuk update nomor urut
    const updatePayload = updatedCourses.map((course, index) => ({
      id: course.id,
      nomor_urut: index + 1, // Urut dari 1
    }));

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/course/update-menu-course-order`,
        updatePayload
      );
      if (response.data.success) {
        // Swal.fire("Success", "Order updated successfully", "success");
      } else {
        // Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      // Swal.fire("Error", "Failed to update order", "error");
    }
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <SidebarAfterLogin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-grow">
        <HeaderAfterLogin
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4">Add Menu Course</h1>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
            onClick={() => setIsAddCourseModalOpen(true)}
          >
            Add Menu
          </button>

          {/* Drag and Drop Context */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="courses">
              {(provided) => (
                <div
                  className="grid grid-cols-1 sm:grid-cols-1 gap-4 px-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {courses.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                      Data tidak ada
                    </div>
                  ) : (
                    courses.map((course, index) => (
                      <Draggable
                        key={course.id}
                        draggableId={`${course.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-6 border rounded shadow-md relative transition-transform transform hover:scale-102 hover:border-blue-500 transition duration-300"
                            onClick={() =>
                              navigate(`/sub-menu-course/${course.id}`)
                            }
                          >
                            <h2 className="text-xl font-semibold">
                              {course.description}
                            </h2>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(course.id);
                              }}
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            >
                              <FaEllipsisV />
                            </button>

                            {dropdownOpen === course.id && (
                              <div
                                className={`absolute top-10 right-2 shadow-lg rounded p-2 z-10 ${
                                  darkMode
                                    ? "bg-gray-500 text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                <button
                                  className={`flex items-center px-2 py-1 w-full ${
                                    darkMode
                                      ? "hover:bg-gray-900"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(course);
                                    toggleDropdown(course.id);
                                  }}
                                >
                                  <FaEdit className="mr-2" />
                                  Rename
                                </button>
                                <button
                                  className={`flex items-center px-2 py-1 w-full ${
                                    darkMode
                                      ? "hover:bg-gray-900"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCourse(course.id);
                                  }}
                                >
                                  <FaTrash className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </main>
      </div>

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`rounded-lg m-6 p-4 max-w-lg w-full ${
              darkMode ? "bg-gray-600" : "bg-white"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Add Menu</h2>
            <form onSubmit={handleAddCourseSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Menu</label>
                <input
                  type="text"
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  className={`border rounded w-full p-2 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`rounded-lg m-6 p-4 max-w-lg w-full ${
              darkMode ? "bg-gray-600" : "bg-white"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Rename Menu</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditCourse(editedCourse.id, newCourseDescription);
                setEditedCourse(null);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium">New Name</label>
                <input
                  type="text"
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  className={`border rounded w-full p-2 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setEditedCourse(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourseMenu;
