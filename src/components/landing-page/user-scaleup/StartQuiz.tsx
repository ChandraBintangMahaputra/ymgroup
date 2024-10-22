import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface QuizQuestion {
  id: number;
  question: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  true_answer: string;
  poin: number;
}




const StartQuiz: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string | null }>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

  
    const storeUserdata = (): Promise<void> => {
      return new Promise((resolve) => {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          if (parsedUserData?.id) {
            setUserId(parsedUserData.id);
          } else {
            console.error("User ID not found in stored data");
          }
        } else {
          console.error("No userData found in localStorage");
        }
        resolve();
      });
    };
  
    useEffect(() => {
      storeUserdata();
    }, []);
  
    useEffect(() => {
      axios
        .get(`${import.meta.env.VITE_PREFIX_BACKEND}/api/course/quiz-question/${id}`)
        .then((response) => {
          if (response.data.success) {
            setQuestions(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch quiz questions", error);
        });
  
      axios
        .get(`${import.meta.env.VITE_PREFIX_BACKEND}/api/course/get-quiz-duration/${id}`)
        .then((response) => {
          if (response.data.success) {
            const timeStopwatch = response.data.data[0].time_stopwatch;
            const [minutes, seconds] = timeStopwatch.split(":").slice(1).map(Number);
            const totalSeconds = minutes * 60 + seconds;
  
            const storedTime = localStorage.getItem(`quiz-timer-${id}`);
            if (storedTime) {
              setTimeLeft(parseInt(storedTime, 10));
            } else {
              setTimeLeft(totalSeconds);
              localStorage.setItem(`quiz-timer-${id}`, totalSeconds.toString());
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch quiz duration", error);
        });
    }, [id]);
  
    useEffect(() => {
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            if (prevTimeLeft <= 1) {
              clearInterval(timer);
              handleTimeExpired();
              return 0;
            }
            const newTime = prevTimeLeft - 1;
            localStorage.setItem(`quiz-timer-${id}`, newTime.toString());
            return newTime;
          });
        }, 1000);
  
        return () => clearInterval(timer);
      }
    }, [id, timeLeft]);
  
    const handleTimeExpired = async () => {
      if (isSubmitting) return; // Prevent multiple submissions
      setIsSubmitting(true);
  
      const answersToSubmit = questions.map((question, index) => ({
        question_id: question.id,
        answer: selectedAnswers[index] || null,
      }));
  
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/course/submit-quiz`,
          {
            user_id: userId,
            quiz_id: id,
            answers: answersToSubmit,
          }
        );
  
        if (response.data.success) {
          Swal.fire("Quiz berakhir", "Kuis telah disubmit!", "success").then(() => {
            localStorage.removeItem(`quiz-timer-${id}`);
            navigate(`/quiz-intro/${id}`);
          });
        } else {
          Swal.fire("Error", "Gagal submit kuis", "error");
        }
      } catch (error) {
        console.error("Error submitting quiz due to time expiration", error);
        Swal.fire("Error", "Terjadi kesalahan saat submit kuis karena waktu habis.", "error");
      } finally {
        setIsSubmitting(false); // Reset submission state
      }
    };
  
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };
  
    const handleAnswerSelect = (answer: string) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: answer,
      }));
    };
  
    const handleNext = () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      }
    };
  
    const handleEndQuizWithConfirmation = async () => {
      await storeUserdata();
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan mengakhiri kuis!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, akhiri!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          handleTimeExpired(); // Submit the quiz when confirmed
        }
      });
    };
  
    const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row">
        {/* Question Navigator */}
        <div className="md:w-1/4 bg-gray-200 p-4">
          <h3 className="text-lg font-bold mb-4">Navigasi Soal</h3>
          <div className="space-y-2 overflow-y-auto">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-full p-2 rounded-md ${
                  index === currentQuestionIndex ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                Soal {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question and options */}
        <div className="md:w-3/4 p-4">
          {currentQuestion && (
            <div className="bg-white shadow-lg p-6 rounded-md">
              {/* Timer */}
              <div className="top-0 right-0 p-4">
                <div className="bg-gray-200 inline-block p-2 rounded shadow-md text-lg font-bold w-auto">
                  Waktu Tersisa: {formatTime(timeLeft)}
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4">
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </h2>
              <div className="space-y-2">
                {currentQuestion.option_a && (
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="answer"
                        value="A"
                        checked={selectedAnswers[currentQuestionIndex] === "A"}
                        onChange={() => handleAnswerSelect("A")}
                      />
                      {currentQuestion.option_a}
                    </label>
                  </div>
                )}
                {currentQuestion.option_b && (
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="answer"
                        value="B"
                        checked={selectedAnswers[currentQuestionIndex] === "B"}
                        onChange={() => handleAnswerSelect("B")}
                      />
                      {currentQuestion.option_b}
                    </label>
                  </div>
                )}
                {currentQuestion.option_c && (
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="answer"
                        value="C"
                        checked={selectedAnswers[currentQuestionIndex] === "C"}
                        onChange={() => handleAnswerSelect("C")}
                      />
                      {currentQuestion.option_c}
                    </label>
                  </div>
                )}
                {currentQuestion.option_d && (
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="answer"
                        value="D"
                        checked={selectedAnswers[currentQuestionIndex] === "D"}
                        onChange={() => handleAnswerSelect("D")}
                      />
                      {currentQuestion.option_d}
                    </label>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePrevious}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                >
                  Previous
                </button>
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleEndQuizWithConfirmation}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Finish Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartQuiz;
