import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useSpring, animated } from "react-spring";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const ProgressDana: React.FC = () => {
  const [progressData, setProgressData] = useState({
    total_amount: 0,
    progress_percentage: 0,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/progress-dana`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProgressData({
            total_amount: parseInt(data.data[0].total_amount, 10),
            progress_percentage: parseFloat(data.data[0].progress_percentage),
          });
        }
      });
  }, []);

  const totalAmountProps = useSpring({
    from: { val: 0 },
    to: { val: progressData.total_amount },
    config: { duration: 1500 },
  });

  const progressProps = useSpring({
    from: { val: 0 },
    to: { val: progressData.progress_percentage },
    config: { duration: 1500 },
  });

  const chartData = {
    datasets: [
      {
        data: [
          progressData.progress_percentage,
          100 - progressData.progress_percentage,
        ],
        backgroundColor: ["#4CAF50", "#EEEEEE"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
    cutout: "70%",
  };

  return (
    <div
      className="w-full h-[450px] bg-white rounded-lg relative"
      style={{
        boxShadow:
          "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
        borderRadius: "12px",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}
    >
      <p className="absolute top-2 left-4 text-gray-600 font-semibold mb-5">
        Progress Dana Terkumpul
      </p>
      <div className="flex justify-center items-center h-full">
        <div className="relative w-full h-full max-w-[350px] max-h-[350px]">
          <Pie data={chartData} options={options} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <animated.div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {totalAmountProps.val.to(
                (val) => `${Math.floor(val).toLocaleString()}`
              )}
            </animated.div>
            <animated.div style={{ fontSize: "18px", color: "#4CAF50" }}>
              {progressProps.val.to((val) => `${val.toFixed(1)}%`)}
            </animated.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDana;
