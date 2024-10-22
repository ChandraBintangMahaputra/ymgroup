import { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaHeart,
  FaCommentAlt,
  FaFlag,
} from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import axios from "axios";
import Swal from "sweetalert2";
import Comment from "./Comment";
import { useDarkMode } from "../../../constants/DarkModeProvider";

interface Discuss {
  discuss_id: number;
}

interface DiscussData {
  discuss_id: number;
  category: string;
  creator_discuss: number;
  description: string;
  institution: string;
  faculty: string;
  prodi: string;
  name: string;
  time_difference: string;
  time_difference_edited: string | null;
  is_edited: number | null;
}

interface AllDiscussionProps {
  fetchDataDiscuss: () => void;
}

export const AllDiscussion: React.FC<AllDiscussionProps> = ({
  fetchDataDiscuss,
}) => {
  const { darkMode } = useDarkMode();
  const [data, setData] = useState<DiscussData[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState<string>("");
  const [newDescriptionReport, setNewDescriptionReport] = useState<string>("");
  const [likedDiscusses, setLikedDiscusses] = useState<number[]>([]);
  const [likesCount, setLikesCount] = useState<Record<number, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>(
    {}
  );
  const [activeDiscussId, setActiveDiscussId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [selectedData, setSelectedData] = useState<DiscussData | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchDataDiscuss();
  }, [fetchDataDiscuss]);

  useEffect(() => {
    if (Array.isArray(data)) {
      data.forEach((discuss: Discuss) => {
        checkUserLike(discuss.discuss_id);
        fetchLike(discuss.discuss_id);
        fetchComment(discuss.discuss_id);
      });
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/get-all-discuss`
      );
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setData(result.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
      setData([]); // In case of error, set data as an empty array
    }
  };

  const fetchLike = async (discussId: number) => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/count-like/${discussId}`
      );
      const result = await response.json();
      if (result.success) {
        setLikesCount((prev) => ({
          ...prev,
          [discussId]: result.data[0]?.total_like || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchComment = async (discussId: number) => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/count-comment/${discussId}`
      );
      const result = await response.json();
      if (result.success) {
        setCommentsCount((prev) => ({
          ...prev,
          [discussId]: result.data[0]?.total_comment || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const checkUserLike = async (discussId: number) => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/check-like/${userId}/${discussId}`
      );
      const result = await response.json();
      if (result.success) {
        setLikedDiscusses((prev) => [...prev, discussId]);
      } else {
        setLikedDiscusses((prev) => prev.filter((id) => id !== discussId));
      }
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const handleDelete = async (discussId: number) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/delete-discuss/${discussId}`
      );
      if (response.data.success) {
        Swal.fire("Deleted!", "Your discuss has been deleted.", "success");
        setData(data.filter((discuss) => discuss.discuss_id !== discussId));
      }
    } catch (error) {
      console.error("Error deleting discuss:", error);
    }
  };

  const handleEdit = async (discussId: number) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/edit-discuss/${discussId}`,
        { description: newDescription }
      );
      if (response.data.success) {
        setData(
          data.map((discuss) =>
            discuss.discuss_id === discussId
              ? { ...discuss, description: newDescription, is_edited: 1 }
              : discuss
          )
        );
        setIsEditing(null);
        fetchData();
        Swal.fire("Updated!", "Your discuss has been updated.", "success");
      }
    } catch (error) {
      console.error("Error editing discuss:", error);
    }
  };

  const handleStartEdit = (discuss: DiscussData) => {
    setIsEditing(discuss.discuss_id);
    setNewDescription(discuss.description);
    setIsDropdownOpen(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setNewDescription("");
  };

  const handleLikeClick = async (discussId: number) => {
    if (!userId) return;
    try {
      if (likedDiscusses.includes(discussId)) {
        const response = await axios.delete(
          `${
            import.meta.env.VITE_PREFIX_BACKEND
          }/api/discuss/delete-like/${userId}/${discussId}`
        );
        if (response.data.success) {
          setLikedDiscusses((prev) => prev.filter((id) => id !== discussId));
          fetchLike(discussId);
        }
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/add-like`,
          { user_id: userId, discuss_id: discussId }
        );
        if (response.data.success) {
          setLikedDiscusses((prev) => [...prev, discussId]);
          fetchLike(discussId);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentClick = (discussId: number) => {
    setActiveDiscussId(discussId); // Menampilkan modal comment
  };

  const handleCommentAdded = (discussId: number) => {
    fetchComment(discussId);
  };

  const handleAddReport = (item: any) => {
    setSelectedData(item);
    setIsModalOpen(true);
  };

  const handleSubmitReport = async () => {

    console.log("1", selectedData)
    console.log("2",userId)
    console.log("3",reportDescription)
    if (!selectedData || !userId || !newDescriptionReport) {
      Swal.fire("Error", "Please fill in the description.", "error");
      return;
    }

    try {
      const response = await axios.post(  `${import.meta.env.VITE_PREFIX_BACKEND}/api/security/add-report`, {
        suspect: selectedData.creator_discuss,
        reporter: userId,
        description: newDescriptionReport,
        category: "discuss",
        content: selectedData.description,
      });

      if (response.data.success) {
        Swal.fire("Report Sent", "Your report has been submitted.", "success");
        setIsModalOpen(false);
        setReportDescription("");
      } else {
        Swal.fire("Error", "Failed to submit the report.", "error");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      Swal.fire(
        "Error",
        "An error occurred while submitting the report.",
        "error"
      );
    }
  };

  return (
    <main className="p-4 mb-5">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((discuss) => (
          <div
            key={discuss.discuss_id}
            className="border border-gray-300 rounded-lg p-4 mb-4 relative shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{discuss.name}</h4>
                <h5
                  className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}
                >
                  {discuss.category}
                </h5>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {discuss.prodi || ""}, {discuss.faculty || ""},{" "}
                  {discuss.institution}
                </p>
              </div>

              {userId && (
                <div className="relative">
                  <FaEllipsisV
                    className="cursor-pointer"
                    onClick={() =>
                      setIsDropdownOpen(
                        isDropdownOpen === discuss.discuss_id
                          ? null
                          : discuss.discuss_id
                      )
                    }
                  />
                  {isDropdownOpen === discuss.discuss_id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
                      {discuss.creator_discuss === userId && (
                        <>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full"
                            onClick={() => handleStartEdit(discuss)}
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full"
                            onClick={() => handleDelete(discuss.discuss_id)}
                          >
                            <FaTrash className="mr-2" /> Delete
                          </button>
                        </>
                      )}

                      {discuss.creator_discuss !== userId && (
                        <>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full"
                            onClick={() => handleAddReport(discuss)}
                          >
                            <FaFlag className="mr-2" /> Report
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4">
              {isEditing === discuss.discuss_id ? (
                <>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="border p-2 w-full"
                  ></textarea>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleEdit(discuss.discuss_id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p>{discuss.description}</p>
              )}
              {discuss.is_edited !== 1 ? (
                <p
                  className={`text-xs mt-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {discuss.time_difference}
                </p>
              ) : (
                <p
                  className={`text-xs mt-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {discuss.time_difference_edited}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-4 items-center">
                <button onClick={() => handleLikeClick(discuss.discuss_id)}>
                  {likedDiscusses.includes(discuss.discuss_id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
                <span>{likesCount[discuss.discuss_id] || 0} likes</span>
                <button onClick={() => handleCommentClick(discuss.discuss_id)}>
                  <FaCommentAlt />
                </button>
                <span
                  className="text-xs sm:text-base cursor-pointer"
                  onClick={() => handleCommentClick(discuss.discuss_id)}
                >
                  {commentsCount[discuss.discuss_id] || 0} comments
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No discussions available</p>
      )}
      {activeDiscussId !== null && userId && (
        <Comment
          discussId={activeDiscussId}
          userId={userId}
          onClose={() => setActiveDiscussId(null)}
          onCommentAdded={() => handleCommentAdded(activeDiscussId)}
        />
      )}

      {isModalOpen && (
        <div className={`fixed inset-0 flex items-center justify-center z-50  bg-black bg-opacity-50`}>
          <div className={`rounded-lg shadow-lg p-6 w-4/5 max-w-3xl ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            {" "}
            {/* Perbesar width dengan w-4/5 atau max-w-3xl */}
            <h2 className="text-2xl font-semibold mb-4">Add Report</h2>
            <textarea
              value={newDescriptionReport}
              onChange={(e) => setNewDescriptionReport(e.target.value)}
              placeholder="Enter your report description"
              className={`border border-gray-300 rounded-lg p-3 w-full h-32 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmitReport}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
