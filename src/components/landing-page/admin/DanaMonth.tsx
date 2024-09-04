import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSpring, animated } from 'react-spring';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const DanaMonth: React.FC = () => {
  const [data, setData] = useState<{ month: string; total_amount: string }[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/dana-month`)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          setData(result.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Chart data and options
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Total Amount',
        data: data.map(item => parseInt(item.total_amount, 10)),
        backgroundColor: data.map((_, index) => `hsl(${(index * 360) / data.length}, 70%, 70%)`),
        borderColor: data.map((_, index) => `hsl(${(index * 360) / data.length}, 70%, 30%)`),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      datalabels: {
        display: true,
        color: '#000',
        anchor: 'end',
        align: 'top',
        offset: 4,
        font: {
          weight: 'bold',
        },
        formatter: (value: number) => value.toLocaleString(), // Format the label text
        padding: { top: 5 }, // Add padding to the top of the data label
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...data.map(item => parseInt(item.total_amount, 10))) * 1.1, // Add 10% padding above the highest bar
        ticks: {
          callback: (value: number | string) => (typeof value === 'number' ? value.toLocaleString() : value), // Handle both number and string
        },
      },
    },
  };
  

  // React Spring for animation
  const animationProps = useSpring({
    to: { opacity: 1, transform: 'scale(1)' },
    from: { opacity: 0, transform: 'scale(0.8)' },
    config: { tension: 300, friction: 20 },
  });

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
        Dana masuk per bulan
      </p>
      <div className="flex justify-center items-center h-full">
        <animated.div style={animationProps} className="relative w-full h-full max-w-[600px] max-h-[300px]">
          <Bar data={chartData} options={chartOptions} height={300} />
        </animated.div>
      </div>
    </div>
  );
};

export default DanaMonth;
