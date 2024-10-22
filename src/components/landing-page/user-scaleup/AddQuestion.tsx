import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import HeaderAfterLogin from "../HeaderAfterLogin";
import SidebarAfterLogin from "../SidebarAfterLogin";
import { useDarkMode } from "../../../constants/DarkModeProvider";

const AddQuestion = () => {
  const { id } = useParams();
  const { darkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { register, handleSubmit, reset} = useForm();
  const [optionCount, setOptionCount] = useState(2); // Default 2 options

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        quiz_id: id
      };

      await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/add-question`,
        payload
      );

      Swal.fire("Success", "Your question has been submitted", "success");
      reset();
    } catch (error) {
      console.error("Error submitting question:", error);
      Swal.fire("Error", "Failed to submit the question", "error");
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
          <h2 className="text-2xl font-bold mb-4">Add Question</h2>
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
                onChange={(e) => setOptionCount(Number(e.target.value))}
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
            {optionCount >= 3 && (
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
            {optionCount === 4 && (
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
                {optionCount >= 3 && <option value="C">C</option>}
                {optionCount === 4 && <option value="D">D</option>}
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
              Submit
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddQuestion;
