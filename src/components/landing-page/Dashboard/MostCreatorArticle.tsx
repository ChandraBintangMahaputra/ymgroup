import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSpring, animated } from 'react-spring';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartOptions } from 'chart.js';
import { useDarkMode } from '../../../constants/DarkModeProvider';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const MostCreatorArticle: React.FC = () => {
  const [data, setData] = useState<{ name: string; total_article: string }[]>([]);
  const {darkMode} = useDarkMode()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/dashboard/most-created-article`)
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
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Total Amount',
        data: data.map(item => parseInt(item.total_article, 10)),
        backgroundColor: [
            '#FF6384', // Red
            '#36A2EB', // Blue
            '#FFCE56', // Yellow
            '#4BC0C0', // Green
            '#9966FF', // Purple
          ], // Customize colors
          borderColor: [
            '#FF6384', 
            '#36A2EB', 
            '#FFCE56', 
            '#4BC0C0', 
            '#9966FF'
          ], // Customize border colors
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
        anchor: 'end',
        align: 'top',
        offset: 4,
        color: darkMode ? 'white' : 'black', 
        font: {
          weight: 'bold'
        },
        formatter: (value: number) => value.toLocaleString(), // Format the label text
        padding: { top: 5 }, // Add padding to the top of the data label
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...data.map(item => parseInt(item.total_article, 10))) * 1.1,
        ticks: {
          color: darkMode ? 'white' : 'black', // Sesuaikan warna angka pada sumbu y
          callback: (value: number | string) => (typeof value === 'number' ? value.toLocaleString() : value),
        },
        grid: {
          color: darkMode ? '#444' : '#ccc', // Sesuaikan warna gridlines
        },
      },
      x: {
        ticks: {
          color: darkMode ? 'white' : 'black', // Sesuaikan warna label sumbu x
        },
        grid: {
          color: darkMode ? '#444' : '#ccc', // Sesuaikan warna gridlines
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
      className={`w-full h-[450px] ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} rounded-lg relative`}
      style={{
        boxShadow:
          "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
        borderRadius: "12px",
        padding: "20px"
      }}
    >
      <p className="absolute top-2 left-4 font-semibold mb-5">
        5 Most Creator Article All The Time
      </p>
      <div className="flex justify-center items-center h-full">
        <animated.div style={animationProps} className="relative w-full h-full max-w-[600px] max-h-[300px]">
          <Bar data={chartData} options={chartOptions} height={300} />
        </animated.div>
      </div>
    </div>
  );
};

export default MostCreatorArticle;
