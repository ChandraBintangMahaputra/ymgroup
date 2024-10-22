import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useDarkMode } from "../../../constants/DarkModeProvider";
import { useParams } from "react-router-dom"; // To get the ID from the route

interface Question {
  question_id: number;
  quiz_id: number;
  question_description: string;
  question_option_a: string;
  question_option_b: string;
  question_option_c: string;
  question_option_d: string;
  question_true_option: string;
  question_date_created: string;
  question_poin: number;
  question_option_count: number;
}

const EditQuestion = () => {
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { register, handleSubmit, setValue } = useForm();
  const [optionCount, setOptionCount] = useState<number>(); // Default 2 options
  const { id } = useParams(); // Get quiz id from route params

  // Function to fetch and populate question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/populate-quiz/${id}`
        );
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const question: Question = result.data[0];
          setValue("question", question.question_description);
          setValue("option_a", question.question_option_a);
          setValue("option_b", question.question_option_b);
          setValue("option_c", question.question_option_c);
          setValue("option_d", question.question_option_d);
          setValue("true_answer", question.question_true_option);
          setValue("poin", question.question_poin);
          setOptionCount(question.question_option_count);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchQuestion();
  }, [id, setValue]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOptionCountChange = (newCount: number) => {
    setOptionCount(newCount);

    // Set unused options to null
    if (newCount < 3) {
      setValue("option_c", null); // Set option_c to null
    }
    if (newCount < 4) {
      setValue("option_d", null); // Set option_d to null
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      // Send the PUT request to update the question
      await axios.put(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/edit-question/${id}`,
        payload
      );

      Swal.fire("Success", "Your question has been updated", "success");
    } catch (error) {
      console.error("Error updating question:", error);
      Swal.fire("Error", "Failed to update the question", "error");
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
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-grow flex flex-col">
        <HeaderAfterLogin toggleSidebar={toggleSidebar} />
        <main className="flex-grow overflow-y-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Edit Question</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Question Description */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="question">
                Question Description
              </label>
              <textarea
                id="question"
                {...register("question", { required: true })}
                className={`border rounded w-full px-4 py-2 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                placeholder="Enter question description"
              />
            </div>

            {/* Option Count */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="optionCount">
                Number of Options
              </label>
              <select
                id="optionCount"
                {...register("optionCount", { required: true })}
                value={optionCount}
                onChange={(e) =>
                  handleOptionCountChange(Number(e.target.value))
                }
                className={`border rounded w-full px-4 py-2 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            {/* Option A */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="optionA">
                A | Option A
              </label>
              <textarea
                id="optionA"
                {...register("option_a", { required: true })}
                className={`border rounded w-full px-4 py-2 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>

            {/* Option B */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="optionB">
                B | Option B
              </label>
              <textarea
                id="optionB"
                {...register("option_b", { required: true })}
                className={`border rounded w-full px-4 py-2 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>

            {/* Option C - Only if optionCount >= 3 */}
            {optionCount! >= 3 && (
              <div className="mb-4">
                <label className="block font-bold mb-2" htmlFor="optionC">
                  C | Option C
                </label>
                <textarea
                  id="optionC"
                  {...register("option_c")}
                  className={`border rounded w-full px-4 py-2 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                />
              </div>
            )}

            {/* Option D - Only if optionCount == 4 */}
            {optionCount! === 4 && (
              <div className="mb-4">
                <label className="block font-bold mb-2" htmlFor="optionD">
                  D | Option D
                </label>
                <textarea
                  id="optionD"
                  {...register("option_d")}
                  className={`border rounded w-full px-4 py-2 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                />
              </div>
            )}

            {/* True Answer */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="true_answer">
                True Answer
              </label>
              <select
                id="true_answer"
                {...register("true_answer", { required: true })}
                className={`border rounded w-full px-4 py-2 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                {optionCount! >= 3 && <option value="C">C</option>}
                {optionCount! === 4 && <option value="D">D</option>}
              </select>
            </div>

            {/* Poin */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="poin">
                Poin
              </label>
              <select
                id="poin"
                {...register("poin", { required: true })}
                className={`border rounded w-full px-4 py-2 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                {[...Array(20).keys()].map((_, i) => (
                  <option key={i} value={(i + 1) * 5}>
                    {(i + 1) * 5}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditQuestion;
