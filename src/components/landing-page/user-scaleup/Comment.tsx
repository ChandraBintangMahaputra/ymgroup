import { useState, useEffect } from "react";
import axios from "axios";
import { FaEllipsisV, FaTrash, FaFlag } from "react-icons/fa";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import Swal from "sweetalert2";

interface CommentProps {
  discussId: number;
  userId: number;
  onClose: () => void;
  onCommentAdded: () => void;
}

interface Comment {
  commentator_id: number;
  commentator_name: string;
  comment_id: number;
  comment_description: string;
}

interface Reply {
  replayer_id: number;
  replyer_name: string;
  reply_comment_id: number;
  reply_comment_description: string;
}

const Comment = ({
  discussId,
  userId,
  onClose,
  onCommentAdded,
}: CommentProps) => {
  const { darkMode } = useDarkMode();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<{ [key: number]: Reply[] }>({});
  const [commentInput, setCommentInput] = useState("");
  const [isReplyingTo, setIsReplyingTo] = useState<{
    commentId: number;
    username: string;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);
  const [replyCount, setReplyCount] = useState<Record<number, number>>({});
  const [isModalCommentReportOpen, setIsModalCommentReportOpen] =
    useState(false);
  const [reportCommentDescription, setReportCommentDescription] = useState("");
  const [selectedCommentData, setSelectedCommentData] =
    useState<Comment | null>(null);
  const [isModalReplyCommentReportOpen, setIsModalReplyCommentReportOpen] =
    useState(false);
  const [reportReplyCommentDescription, setReportReplyCommentDescription] =
    useState("");
  const [selectedReplyCommentData, setSelectedReplyCommentData] =
    useState<Reply | null>(null);

  useEffect(() => {
    comments.forEach((comment: Comment) => {
      fetchReplyComment(comment.comment_id);
    });
  }, [comments]);

  const fetchReplyComment = async (commentId: number) => {
    if (!userId) return;
    const response = await fetch(
      `${
        import.meta.env.VITE_PREFIX_BACKEND
      }/api/discuss/count-reply-comment/${commentId}`
    );
    const result = await response.json();
    if (result.success) {
      setReplyCount((prev) => ({
        ...prev,
        [commentId]: result.data[0]?.total_reply_comment || 0,
      }));
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_PREFIX_BACKEND
          }/api/discuss/comment-by-id/${discussId}`
        );
        if (response.data.success) {
          setComments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [discussId]);

  const fetchReplies = async (commentId: number) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/reply-comment-by-id/${commentId}`
      );
      if (response.data.success) {
        setReplies((prev) => ({
          ...prev,
          [commentId]: response.data.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleSubmit = async () => {
    if (isReplyingTo) {
      await handleAddReply(isReplyingTo.commentId, isReplyingTo.username);
    } else {
      await handleAddComment();
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/add-comment`,
        { user_id: userId, discuss_id: discussId, description: commentInput }
      );
      if (response.data.success) {
        setComments([
          ...comments,
          {
            commentator_id: userId,
            commentator_name: "You",
            comment_id: Date.now(),
            comment_description: commentInput,
          },
        ]);
        setCommentInput("");
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId: number, username: string) => {
    const replyContent = commentInput;
    if (!replyContent.startsWith(`@${username}`)) return; // Ensure reply starts with the correct @username
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/discuss/add-reply-comment`,
        { user_id: userId, comment_id: commentId, description: replyContent }
      );
      if (response.data.success) {
        fetchReplies(commentId);
        setCommentInput("");
        setIsReplyingTo(null);
        fetchReplyComment(commentId);
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleReplyClick = (commentId: number, username: string) => {
    setIsReplyingTo({ commentId, username });
    setCommentInput(`@${username} `); // Pre-fill the input with @username
    fetchReplies(commentId);
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/delete-comment/${commentId}`
      );
      if (response.data.success) {
        setComments(
          comments.filter((comment) => comment.comment_id !== commentId)
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // New function to delete reply comment
  const handleDeleteReply = async (
    replyCommentId: number,
    commentId: number
  ) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/discuss/delete-reply-comment/${replyCommentId}`
      );
      if (response.data.success) {
        setReplies((prevReplies) => ({
          ...prevReplies,
          [commentId]: prevReplies[commentId].filter(
            (reply) => reply.reply_comment_id !== replyCommentId
          ),
        }));
        fetchReplyComment(commentId);
      }
    } catch (error) {
      console.error("Error deleting reply comment:", error);
    }
  };

  const handleAddCommentReport = (item: any) => {
    setSelectedCommentData(item);
    setIsModalCommentReportOpen(true);
  };

  const handleAddReplyCommentReport = (item: any) => {
    setSelectedReplyCommentData(item);
    setIsModalReplyCommentReportOpen(true);
  };

  const handleSubmitCommentReport = async () => {
    console.log("1", selectedCommentData);
    console.log("2", userId);
    console.log("3", reportCommentDescription);
    if (!selectedCommentData || !userId || !reportCommentDescription) {
      Swal.fire("Error", "Please fill in the description.", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/security/add-report`,
        {
          suspect: selectedCommentData.commentator_id,
          reporter: userId,
          description: reportCommentDescription,
          category: "comment",
          content: selectedCommentData.comment_description,
        }
      );

      if (response.data.success) {
        Swal.fire("Report Sent", "Your report has been submitted.", "success");
        setIsModalCommentReportOpen(false);
        setReportCommentDescription("");
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

  const handleSubmitReplyCommentReport = async () => {
    console.log("1", selectedReplyCommentData);
    console.log("2", userId);
    console.log("3", reportReplyCommentDescription);
    if (
      !selectedReplyCommentData ||
      !userId ||
      !reportReplyCommentDescription
    ) {
      Swal.fire("Error", "Please fill in the description.", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/security/add-report`,
        {
          suspect: selectedReplyCommentData.replayer_id,
          reporter: userId,
          description: reportReplyCommentDescription,
          category: "reply comment",
          content: selectedReplyCommentData.reply_comment_description,
        }
      );

      if (response.data.success) {
        Swal.fire("Report Sent", "Your report has been submitted.", "success");
        setIsModalReplyCommentReportOpen(false);
        setReportReplyCommentDescription("");
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-4 sm:p-6 rounded-lg w-11/12 sm:w-2/3 lg:w-1/3 ${
          darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <div className="overflow-y-auto max-h-60 mb-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.comment_id} className="border-b py-2 relative">
                <p className="font-semibold">{comment.commentator_name}</p>
                <p>{comment.comment_description}</p>
                <button
                  className="text-blue-500 text-sm"
                  onClick={() =>
                    handleReplyClick(
                      comment.comment_id,
                      comment.commentator_name
                    )
                  }
                >
                  {replyCount[comment.comment_id] || ""} Balasan
                </button>

                {replies[comment.comment_id] &&
                  replies[comment.comment_id].map((reply) => (
                    <div
                      key={reply.reply_comment_id}
                      className="ml-4 mt-2 border-l pl-2 relative"
                    >
                      <p className="font-semibold">{reply.replyer_name}</p>
                      <p>{reply.reply_comment_description}</p>
                      <button
                        className="text-blue-500 text-sm"
                        onClick={() =>
                          handleReplyClick(
                            comment.comment_id,
                            reply.replyer_name
                          )
                        }
                      >
                        Reply
                      </button>
                      {userId && (
                        <div className="absolute right-0 top-0">
                          <FaEllipsisV
                            className="cursor-pointer"
                            onClick={() =>
                              setIsDropdownOpen(
                                isDropdownOpen === reply.reply_comment_id
                                  ? null
                                  : reply.reply_comment_id
                              )
                            }
                          />
                          {isDropdownOpen === reply.reply_comment_id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
                              {reply.replayer_id === userId && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleDeleteReply(
                                        reply.reply_comment_id,
                                        comment.comment_id
                                      )
                                    }
                                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full"
                                  >
                                    <FaTrash className="mr-2" /> Delete
                                  </button>
                                </>
                              )}
                              {reply.replayer_id !== userId && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAddReplyCommentReport(reply)
                                    }
                                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full"
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
                  ))}

                {userId && (
                  <div className="absolute right-0 top-0">
                    <FaEllipsisV
                      className="cursor-pointer"
                      onClick={() =>
                        setIsDropdownOpen(
                          isDropdownOpen === comment.comment_id
                            ? null
                            : comment.comment_id
                        )
                      }
                    />
                    {isDropdownOpen === comment.comment_id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
                        {comment.commentator_id === userId && (
                          <>
                            <button
                              onClick={() =>
                                handleDeleteComment(comment.comment_id)
                              }
                              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full"
                            >
                              <FaTrash className="mr-2" /> Delete
                            </button>
                          </>
                        )}
                        {comment.commentator_id !== userId && (
                          <>
                            <button
                              onClick={() => handleAddCommentReport(comment)}
                              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full"
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
            ))
          ) : (
            <p>No comments available.</p>
          )}
        </div>
        <textarea
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder={
            isReplyingTo
              ? `Replying to @${isReplyingTo.username}`
              : "Add a comment"
          }
          className={`w-full p-2 border rounded mb-2 ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            {isReplyingTo ? "Reply" : "Comment"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>

      {isModalCommentReportOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50  bg-black bg-opacity-50`}
        >
          <div
            className={`rounded-lg shadow-lg p-6 w-4/5 max-w-3xl ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            {" "}
            {/* Perbesar width dengan w-4/5 atau max-w-3xl */}
            <h2 className="text-2xl font-semibold mb-4">Add Report</h2>
            <textarea
              value={reportCommentDescription}
              onChange={(e) => setReportCommentDescription(e.target.value)}
              placeholder="Enter your report description"
              className={`border border-gray-300 rounded-lg p-3 w-full h-32 ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
              }`}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsModalCommentReportOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmitCommentReport}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalReplyCommentReportOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50  bg-black bg-opacity-50`}
        >
          <div
            className={`rounded-lg shadow-lg p-6 w-4/5 max-w-3xl ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            {" "}
            {/* Perbesar width dengan w-4/5 atau max-w-3xl */}
            <h2 className="text-2xl font-semibold mb-4">Add Report</h2>
            <textarea
              value={reportReplyCommentDescription}
              onChange={(e) => setReportReplyCommentDescription(e.target.value)}
              placeholder="Enter your report description"
              className={`border border-gray-300 rounded-lg p-3 w-full h-32 ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
              }`}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsModalReplyCommentReportOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmitReplyCommentReport}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
